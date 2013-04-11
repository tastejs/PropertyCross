/**
 * @private
 */
Ext.define('Ext.scroll.indicator.Rounded', {
    extend: 'Ext.scroll.indicator.Abstract',

    config: {
        cls: 'rounded'
    },

    constructor: function() {
        this.callParent(arguments);
        this.transformPropertyName = Ext.browser.getVendorProperyName('transform');
    },

    getElementConfig: function() {
        var config = this.callParent();

        config.children[0].children = [
            {
                reference: 'startElement'
            },
            {
                reference: 'middleElement'
            },
            {
                reference: 'endElement'
            }
        ];

        return config;
    },

    refresh: function() {
        var axis = this.getAxis(),
            startElementDom = this.startElement.dom,
            endElementDom = this.endElement.dom,
            middleElement = this.middleElement,
            startElementLength, endElementLength;

        if (axis === 'x') {
            startElementLength = startElementDom.offsetWidth;
            endElementLength = endElementDom.offsetWidth;
            middleElement.setLeft(startElementLength);
        }
        else {
            startElementLength = startElementDom.offsetHeight;
            endElementLength = endElementDom.offsetHeight;
            middleElement.setTop(startElementLength);
        }

        this.startElementLength = startElementLength;
        this.endElementLength = endElementLength;

        this.callParent();
    },

    doUpdateLength: function(length) {
        var axis = this.getAxis(),
            endElement = this.endElement,
            middleElementStyle = this.middleElement.dom.style,
            endElementLength = this.endElementLength,
            endElementOffset = length - endElementLength,
            middleElementLength = endElementOffset - this.startElementLength,
            transformPropertyName = this.transformPropertyName;

        if (axis === 'x') {
            endElement.translate(endElementOffset, 0);
            middleElementStyle[transformPropertyName] = 'translate3d(0, 0, 0) scaleX(' + middleElementLength + ')';
        }
        else {
            endElement.translate(0, endElementOffset);
            middleElementStyle[transformPropertyName] = 'translate3d(0, 0, 0) scaleY(' + middleElementLength + ')';
        }
    }
});
