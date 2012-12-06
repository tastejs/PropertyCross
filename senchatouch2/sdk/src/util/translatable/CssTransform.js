/**
 * @private
 *
 * CSS Transform implementation
 */
Ext.define('Ext.util.translatable.CssTransform', {
    extend: 'Ext.util.translatable.Abstract',

    doTranslate: function(x, y) {
        var domStyle = this.getElement().dom.style;

        if (typeof x != 'number') {
            x = this.x;
        }

        if (typeof y != 'number') {
            y = this.y;
        }

        domStyle.webkitTransform = 'translate3d(' + x + 'px, ' + y + 'px, 0px)';

        return this.callParent(arguments);
    },

    destroy: function() {
        var element = this.getElement();

        if (element && !element.isDestroyed) {
            element.dom.style.webkitTransform = null;
        }

        this.callParent(arguments);
    }
});
