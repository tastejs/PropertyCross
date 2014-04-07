/**
 * @private
 */
Ext.define('Ext.scroll.indicator.Abstract', {
    extend: 'Ext.Component',

    requires: [
        'Ext.TaskQueue'
    ],

    config: {
        baseCls: 'x-scroll-indicator',

        axis: 'x',

        value: null,

        length: null,

        minLength: 6,

        hidden: true,

        ui: 'dark',

        /**
         * @cfg {Boolean} [autoHide=true] Set to `false` to always show the indicator for this axis.
         */
        autoHide : true
    },

    cachedConfig: {
        ratio: 1,

        barCls: 'x-scroll-bar',

        active: true
    },

    barElement: null,

    barLength: 0,

    gapLength: 0,

    getElementConfig: function() {
        return {
            reference: 'barElement',
            children: [this.callParent()]
        };
    },

    applyRatio: function(ratio) {
        if (isNaN(ratio) || ratio > 1) {
            ratio = 1;
        }

        return ratio;
    },

    refresh: function() {
        var bar = this.barElement,
            barDom = bar.dom,
            ratio = this.getRatio(),
            axis = this.getAxis(),
            barLength = (axis === 'x') ? barDom.offsetWidth : barDom.offsetHeight,
            length = barLength * ratio;

        this.barLength = barLength;

        this.gapLength = barLength - length;

        this.setLength(length);

        this.updateValue(this.getValue());
    },

    updateBarCls: function(barCls) {
        this.barElement.addCls(barCls);
    },

    updateAxis: function(axis) {
        this.element.addCls(this.getBaseCls(), null, axis);
        this.barElement.addCls(this.getBarCls(), null, axis);
    },

    updateValue: function(value) {
        var barLength = this.barLength,
            gapLength = this.gapLength,
            length = this.getLength(),
            newLength, offset, extra;

        if (value <= 0) {
            offset = 0;
            this.updateLength(this.applyLength(length + value * barLength));
        }
        else if (value >= 1) {
            extra = Math.round((value - 1) * barLength);
            newLength = this.applyLength(length - extra);
            extra = length - newLength;
            this.updateLength(newLength);
            offset = gapLength + extra;
        }
        else {
            offset = gapLength * value;
        }

        this.setOffset(offset);
    },

    updateActive: function(active) {
        this.barElement[active ? 'addCls' : 'removeCls']('active');
    },

    doSetHidden: function(hidden) {
        var me = this;

        if (hidden) {
            me.getAutoHide() && me.setOffset(-10000);
        } else {
            delete me.lastLength;
            delete me.lastOffset;
            me.updateValue(me.getValue());
        }
    },

    applyLength: function(length) {
        return Math.max(this.getMinLength(), length);
    },

    updateLength: function(length) {
        length = Math.round(length);
        if (this.lastLength === length) {
            return;
        }
        this.lastLength = length;
        Ext.TaskQueue.requestWrite('doUpdateLength', this, [length]);
    },

    doUpdateLength: function(length){
        if (!this.isDestroyed) {
            var axis = this.getAxis(),
                element = this.element;

            if (axis === 'x') {
                element.setWidth(length);
            }
            else {
                element.setHeight(length);
            }
        }
    },

    setOffset: function(offset) {
        offset = Math.round(offset);
        if (this.lastOffset === offset || this.lastOffset === -10000) {
            return;
        }
        this.lastOffset = offset;
        Ext.TaskQueue.requestWrite('doSetOffset', this,[offset]);
    },

    doSetOffset: function(offset) {
        if (!this.isDestroyed) {
            var axis = this.getAxis(),
                element = this.element;

            if (axis === 'x') {
                element.translate(offset, 0);
            }
            else {
                element.translate(0, offset);
            }
        }
    }
});
