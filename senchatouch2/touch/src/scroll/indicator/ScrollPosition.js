/**
 * @private
 */
Ext.define('Ext.scroll.indicator.ScrollPosition', {
    extend: 'Ext.scroll.indicator.Abstract',

    config: {
        cls: 'scrollposition'
    },

    getElementConfig: function() {
        var config = this.callParent(arguments);

        config.children.unshift({
            className: 'x-scroll-bar-stretcher'
        });

        return config;
    },

    updateValue: function(value) {
        if (this.gapLength === 0) {
            if (value >= 1) {
                value--;
            }

            this.setOffset(this.barLength * value);
        }
        else {
            this.setOffset(this.gapLength * value);
        }
    },

    doUpdateLength: function() {
        var scrollOffset = this.barLength,
            element = this.element;

        this.callParent(arguments);

        if (this.getAxis() === 'x') {
            element.setLeft(scrollOffset);
        }
        else {
            element.setTop(scrollOffset);
        }
    },

    doSetOffset: function(offset) {
        var barLength = this.barLength,
            minLength = this.getMinLength(),
            barDom = this.barElement.dom;

        if (offset !== -10000) {
            offset = Math.min(barLength - minLength, Math.max(offset, minLength - this.getLength()));
            offset = barLength - offset;
        }

        if (this.getAxis() === 'x') {
            barDom.scrollLeft = offset;
        }
        else {
            barDom.scrollTop = offset;
        }
    }
});
