/**
 * @private
 */
Ext.define('Ext.event.publisher.TouchGesture', {

    extend: 'Ext.event.publisher.Dom',

    requires: [
        'Ext.util.Point',
        'Ext.event.Touch',
        'Ext.AnimationQueue'
    ],

    isNotPreventable: /^(select|a)$/i,

    handledEvents: ['touchstart', 'touchmove', 'touchend', 'touchcancel'],

    mouseToTouchMap: {
        mousedown: 'touchstart',
        mousemove: 'touchmove',
        mouseup: 'touchend'
    },

    lastEventType: null,

    config: {
        moveThrottle: 0,
        recognizers: {}
    },

    constructor: function(config) {
        this.eventProcessors = {
            touchstart: this.onTouchStart,
            touchmove: this.onTouchMove,
            touchend: this.onTouchEnd,
            touchcancel: this.onTouchEnd
        };

        this.eventToRecognizerMap = {};

        this.activeRecognizers = [];

        this.touchesMap = {};

        this.currentIdentifiers = [];

        if (Ext.browser.is.Chrome && Ext.os.is.Android) {
            this.screenPositionRatio = Ext.browser.version.gt('18') ? 1 : 1 / window.devicePixelRatio;
        }
        else if (Ext.browser.is.AndroidStock4) {
            this.screenPositionRatio = 1;
        }
        else if (Ext.os.is.BlackBerry) {
            this.screenPositionRatio = 1 / window.devicePixelRatio;
        }
        else if (Ext.browser.engineName == 'WebKit' && Ext.os.is.Desktop) {
            this.screenPositionRatio = 1;
        }
        else {
            this.screenPositionRatio = window.innerWidth / window.screen.width;
        }
        this.initConfig(config);

        return this.callSuper();
    },

    applyRecognizers: function(recognizers) {
        var i, recognizer;

        for (i in recognizers) {
            if (recognizers.hasOwnProperty(i)) {
                recognizer = recognizers[i];

                if (recognizer) {
                    this.registerRecognizer(recognizer);
                }
            }
        }

        return recognizers;
    },

    handles: function(eventName) {
        return this.callSuper(arguments) || this.eventToRecognizerMap.hasOwnProperty(eventName);
    },

    doesEventBubble: function() {
        // All touch events bubble
        return true;
    },
    onEvent: function(e) {
        var type = e.type,
            lastEventType = this.lastEventType,
            touchList = [e];

        if (this.eventProcessors[type]) {
            this.eventProcessors[type].call(this, e);
            return;
        }

        if ('button' in e && e.button > 0) {
            return;
        }
        else {
            // Temporary fix for a recent Chrome bugs where events don't seem to bubble up to document
            // when the element is being animated with webkit-transition (2 mousedowns without any mouseup)
            if (type === 'mousedown' && lastEventType && lastEventType !== 'mouseup') {
                var fixedEvent = document.createEvent("MouseEvent");
                    fixedEvent.initMouseEvent('mouseup', e.bubbles, e.cancelable,
                        document.defaultView, e.detail, e.screenX, e.screenY, e.clientX,
                        e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.metaKey,
                        e.button, e.relatedTarget);

                this.onEvent(fixedEvent);
            }

            if (type !== 'mousemove') {
                this.lastEventType = type;
            }

            e.identifier = 1;
            e.touches = (type !== 'mouseup') ? touchList : [];
            e.targetTouches = (type !== 'mouseup') ? touchList : [];
            e.changedTouches = touchList;

            this.eventProcessors[this.mouseToTouchMap[type]].call(this, e);
        }
    },

    registerRecognizer: function(recognizer) {
        var map = this.eventToRecognizerMap,
            activeRecognizers = this.activeRecognizers,
            handledEvents = recognizer.getHandledEvents(),
            i, ln, eventName;

        recognizer.setOnRecognized(this.onRecognized);
        recognizer.setCallbackScope(this);

        for (i = 0,ln = handledEvents.length; i < ln; i++) {
            eventName = handledEvents[i];

            map[eventName] = recognizer;
        }

        activeRecognizers.push(recognizer);

        return this;
    },

    onRecognized: function(eventName, e, touches, info) {
        var targetGroups = [],
            ln = touches.length,
            targets, i, touch;

        if (ln === 1) {
            return this.publish(eventName, touches[0].targets, e, info);
        }

        for (i = 0; i < ln; i++) {
            touch = touches[i];
            targetGroups.push(touch.targets);
        }

        targets = this.getCommonTargets(targetGroups);

        this.publish(eventName, targets, e, info);
    },

    publish: function(eventName, targets, event, info) {
        event.set(info);
        return this.callSuper([eventName, targets, event]);
    },

    getCommonTargets: function(targetGroups) {
        var firstTargetGroup = targetGroups[0],
            ln = targetGroups.length;

        if (ln === 1) {
            return firstTargetGroup;
        }

        var commonTargets = [],
            i = 1,
            target, targets, j;

        while (true) {
            target = firstTargetGroup[firstTargetGroup.length - i];

            if (!target) {
                return commonTargets;
            }

            for (j = 1; j < ln; j++) {
                targets = targetGroups[j];

                if (targets[targets.length - i] !== target) {
                    return commonTargets;
                }
            }

            commonTargets.unshift(target);
            i++;
        }

        return commonTargets;
    },

    invokeRecognizers: function(methodName, e) {
        var recognizers = this.activeRecognizers,
            ln = recognizers.length,
            i, recognizer;

        if (methodName === 'onStart') {
            for (i = 0; i < ln; i++) {
                recognizers[i].isActive = true;
            }
        }

        for (i = 0; i < ln; i++) {
            recognizer = recognizers[i];
            if (recognizer.isActive && recognizer[methodName].call(recognizer, e) === false) {
                recognizer.isActive = false;
            }
        }
    },

    getActiveRecognizers: function() {
        return this.activeRecognizers;
    },

    updateTouch: function(touch) {
        var identifier = touch.identifier,
            currentTouch = this.touchesMap[identifier],
            target, x, y;

        if (!currentTouch) {
            target = this.getElementTarget(touch.target);

            this.touchesMap[identifier] = currentTouch = {
                identifier: identifier,
                target: target,
                targets: this.getBubblingTargets(target)
            };

            this.currentIdentifiers.push(identifier);
        }

        x  = touch.pageX;
        y  = touch.pageY;

        if (x === currentTouch.pageX && y === currentTouch.pageY) {
            return false;
        }

        currentTouch.pageX = x;
        currentTouch.pageY = y;
        currentTouch.timeStamp = touch.timeStamp;
        currentTouch.point = new Ext.util.Point(x, y);

        return currentTouch;
    },

    updateTouches: function(touches) {
        var i, ln, touch,
            changedTouches = [];

        for (i = 0, ln = touches.length; i < ln; i++) {
            touch = this.updateTouch(touches[i]);
            if (touch) {
                changedTouches.push(touch);
            }
        }

        return changedTouches;
    },

    factoryEvent: function(e) {
        return new Ext.event.Touch(e, null, this.touchesMap, this.currentIdentifiers);
    },

    onTouchStart: function(e) {
        var changedTouches = e.changedTouches,
            target = e.target,
            ln = changedTouches.length,
            isNotPreventable = this.isNotPreventable,
            i, touch, parent;

        this.updateTouches(changedTouches);

        e = this.factoryEvent(e);
        changedTouches = e.changedTouches;

        for (i = 0; i < ln; i++) {
            touch = changedTouches[i];
            this.publish('touchstart', touch.targets, e, {touch: touch});
        }

        if (!this.isStarted) {
            this.isStarted = true;
            this.invokeRecognizers('onStart', e);
        }

        this.invokeRecognizers('onTouchStart', e);

        parent = target.parentNode || {};
    },

    onTouchMove: function(e) {
        if (!this.isStarted) {
            return;
        }

        if (!this.animationQueued) {
            this.animationQueued = true;
            Ext.AnimationQueue.start('onAnimationFrame', this);
        }

        this.lastMoveEvent = e;
    },

    onAnimationFrame: function() {
        var event = this.lastMoveEvent;

        if (event) {
            this.lastMoveEvent = null;
            this.doTouchMove(event);
        }
    },

    doTouchMove: function(e) {
        var changedTouches, i, ln, touch;

        changedTouches = this.updateTouches(e.changedTouches);

        ln = changedTouches.length;

        e = this.factoryEvent(e);

        for (i = 0; i < ln; i++) {
            touch = changedTouches[i];
            this.publish('touchmove', touch.targets, e, {touch: touch});
        }

        if (ln > 0) {
            this.invokeRecognizers('onTouchMove', e);
        }
    },

    onTouchEnd: function(e) {
        if (!this.isStarted) {
            return;
        }

        if (this.lastMoveEvent) {
            this.onAnimationFrame();
        }

        var touchesMap = this.touchesMap,
            currentIdentifiers = this.currentIdentifiers,
            changedTouches = e.changedTouches,
            ln = changedTouches.length,
            identifier, i, touch;

        this.updateTouches(changedTouches);

        changedTouches = e.changedTouches;

        for (i = 0; i < ln; i++) {
            Ext.Array.remove(currentIdentifiers, changedTouches[i].identifier);
        }

        e = this.factoryEvent(e);

        for (i = 0; i < ln; i++) {
            identifier = changedTouches[i].identifier;
            touch = touchesMap[identifier];
            delete touchesMap[identifier];
            this.publish('touchend', touch.targets, e, {touch: touch});
        }

        this.invokeRecognizers('onTouchEnd', e);

        // Only one touch currently active, and we're ending that one. So currentTouches should be 0 and clear the touchMap.
        // This resolves an issue in iOS where it can sometimes not report a touchend/touchcancel
        if (e.touches.length === 1 && currentIdentifiers.length) {
            currentIdentifiers.length = 0;
            this.touchesMap = {};
        }

        if (currentIdentifiers.length === 0) {
            this.isStarted = false;
            this.invokeRecognizers('onEnd', e);
            if (this.animationQueued) {
                this.animationQueued = false;
                Ext.AnimationQueue.stop('onAnimationFrame', this);
            }
        }
    }

}, function() {
    if (Ext.feature.has.Pointer) {
        this.override({
            pointerToTouchMap: {
                MSPointerDown: 'touchstart',
                MSPointerMove: 'touchmove',
                MSPointerUp: 'touchend',
                MSPointerCancel: 'touchcancel',
                pointerdown: 'touchstart',
                pointermove: 'touchmove',
                pointerup: 'touchend',
                pointercancel: 'touchcancel'
            },

            touchToPointerMap: {
                touchstart: 'MSPointerDown',
                touchmove: 'MSPointerMove',
                touchend: 'MSPointerUp',
                touchcancel: 'MSPointerCancel'
            },

            attachListener: function(eventName, doc) {
                eventName = this.touchToPointerMap[eventName];

                if (!eventName) {
                    return;
                }

                return this.callOverridden([eventName, doc]);
            },

            onEvent: function(e) {
                if ('button' in e && e.button > 0) {
                    return;
                }

                var type = this.pointerToTouchMap[e.type];

                e.identifier = e.pointerId;
                e.changedTouches = [e];

                this.eventProcessors[type].call(this, e);
            }
        });
    }
    else if (!Ext.browser.is.Ripple && (Ext.os.is.ChromeOS || !Ext.feature.has.Touch)) {
        this.override({
            handledEvents: ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'mousedown', 'mousemove', 'mouseup']
        });
    }
});