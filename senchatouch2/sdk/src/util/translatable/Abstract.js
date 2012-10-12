/**
 * @private
 *
 * The abstract class. Sub-classes are expected, at the very least, to implement translation logics inside
 * the 'translate' method
 */
Ext.define('Ext.util.translatable.Abstract', {
    extend: 'Ext.Evented',

    requires: ['Ext.fx.easing.Linear'],

    config: {
        element: null,

        easing: null,

        easingX: null,

        easingY: null,

        fps: 60
    },

    /**
     * @event animationstart
     * Fires whenever the animation is started
     * @param {Ext.util.translatable.Abstract} this
     * @param {Number} x The current translation on the x axis
     * @param {Number} y The current translation on the y axis
     */

    /**
     * @event animationframe
     * Fires for each animation frame
     * @param {Ext.util.translatable.Abstract} this
     * @param {Number} x The new translation on the x axis
     * @param {Number} y The new translation on the y axis
     */

    /**
     * @event animationend
     * Fires whenever the animation is ended
     * @param {Ext.util.translatable.Abstract} this
     * @param {Number} x The current translation on the x axis
     * @param {Number} y The current translation on the y axis
     */

    constructor: function(config) {
        var element;

        this.doAnimationFrame = Ext.Function.bind(this.doAnimationFrame, this);

        this.x = 0;

        this.y = 0;

        this.activeEasingX = null;

        this.activeEasingY = null;

        this.initialConfig = config;

        if (config && config.element) {
            element = config.element;
            this.setElement(element);
        }
    },

    applyElement: function(element) {
        if (!element) {
            return;
        }

        return Ext.get(element);
    },

    updateElement: function(element) {
        this.initConfig(this.initialConfig);
        this.refresh();
    },

    factoryEasing: function(easing) {
        return Ext.factory(easing, Ext.fx.easing.Linear, null, 'easing');
    },

    applyEasing: function(easing) {
        if (!this.getEasingX()) {
            this.setEasingX(this.factoryEasing(easing));
        }

        if (!this.getEasingY()) {
            this.setEasingY(this.factoryEasing(easing));
        }
    },

    applyEasingX: function(easing) {
        return this.factoryEasing(easing);
    },

    applyEasingY: function(easing) {
        return this.factoryEasing(easing);
    },

    updateFps: function(fps) {
        this.animationInterval = 1000 / fps;
    },

    doTranslate: function(x, y) {
        if (typeof x == 'number') {
            this.x = x;
        }

        if (typeof y == 'number') {
            this.y = y;
        }

        return this;
    },

    translate: function(x, y, animation) {
        if (!this.getElement().dom) {
            return;
        }
        if (Ext.isObject(x)) {
            throw new Error();
        }

        this.stopAnimation();

        if (animation) {
            return this.translateAnimated(x, y, animation);
        }

        return this.doTranslate(x, y);
    },

    animate: function(easingX, easingY) {
        this.activeEasingX = easingX;
        this.activeEasingY = easingY;

        this.isAnimating = true;
        this.animationTimer = setInterval(this.doAnimationFrame, this.animationInterval);

        this.fireEvent('animationstart', this, this.x, this.y);

        return this;
    },

    translateAnimated: function(x, y, animation) {
        if (Ext.isObject(x)) {
            throw new Error();
        }

        if (!Ext.isObject(animation)) {
            animation = {};
        }

        var now = Ext.Date.now(),
            easing = animation.easing,
            easingX = (typeof x == 'number') ? (animation.easingX || this.getEasingX() || easing || true) : null,
            easingY = (typeof y == 'number') ? (animation.easingY || this.getEasingY() || easing || true) : null;

        if (easingX) {
            easingX = this.factoryEasing(easingX);
            easingX.setStartTime(now);
            easingX.setStartValue(this.x);
            easingX.setEndValue(x);

            if ('duration' in animation) {
                easingX.setDuration(animation.duration);
            }
        }

        if (easingY) {
            easingY = this.factoryEasing(easingY);
            easingY.setStartTime(now);
            easingY.setStartValue(this.y);
            easingY.setEndValue(y);

            if ('duration' in animation) {
                easingY.setDuration(animation.duration);
            }
        }

        return this.animate(easingX, easingY);
    },

    doAnimationFrame: function() {
        var easingX = this.activeEasingX,
            easingY = this.activeEasingY,
            element = this.getElement(),
            x, y;

        if (!this.isAnimating || !element.dom) {
            return;
        }

        if (easingX === null && easingY === null) {
            this.stopAnimation();
            return;
        }

        if (easingX !== null) {
            this.x = x = Math.round(easingX.getValue());

            if (easingX.isEnded) {
                this.activeEasingX = null;
                this.fireEvent('axisanimationend', this, 'x', x);
            }
        }
        else {
            x = this.x;
        }

        if (easingY !== null) {
            this.y = y = Math.round(easingY.getValue());

            if (easingY.isEnded) {
                this.activeEasingY = null;
                this.fireEvent('axisanimationend', this, 'y', y);
            }
        }
        else {
            y = this.y;
        }

        this.doTranslate(x, y);
        this.fireEvent('animationframe', this, x, y);
    },

    stopAnimation: function() {
        if (!this.isAnimating) {
            return;
        }

        this.activeEasingX = null;
        this.activeEasingY = null;

        this.isAnimating = false;

        clearInterval(this.animationTimer);
        this.fireEvent('animationend', this, this.x, this.y);
    },

    refresh: function() {
        this.translate(this.x, this.y);
    }
});
