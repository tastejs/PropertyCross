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
            if (value > 1) {
                value = value - 1;
            }

            this.setOffset(this.barLength * value);
        }
        else {
            this.setOffset(this.gapLength * value);
        }
    },

    setLength: function(length) {
        var axis = this.getAxis(),
            scrollOffset = this.barLength,
            barDom = this.barElement.dom,
            element = this.element;

        this.callParent(arguments);

        if (axis === 'x') {
            barDom.scrollLeft = scrollOffset;
            element.setLeft(scrollOffset);
        }
        else {
            barDom.scrollTop = scrollOffset;
            element.setTop(scrollOffset);
        }
    },

    setOffset: function(offset) {
        var axis = this.getAxis(),
            scrollOffset = this.barLength,
            barDom = this.barElement.dom;

        offset = scrollOffset - offset;

        if (axis === 'x') {
            barDom.scrollLeft = offset;
        }
        else {
            barDom.scrollTop = offset;
        }
    }
});
