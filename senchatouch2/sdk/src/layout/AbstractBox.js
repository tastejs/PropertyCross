/**
 * @aside guide layouts
 * @aside video layouts
 *
 * AbstractBox is a superclass for the two box layouts:
 *
 * * {@link Ext.layout.HBox hbox}
 * * {@link Ext.layout.VBox vbox}
 *
 * AbstractBox itself is never used directly, but its subclasses provide flexible arrangement of child components
 * inside a {@link Ext.Container Container}. For a full overview of layouts check out the
 * [Layout Guide](#!/guide/layouts).
 *
 * ## Horizontal Box
 *
 * HBox allows you to easily lay out child components horizontally. It can size items based on a fixed width or a
 * fraction of the total width available, enabling you to achieve flexible layouts that expand or contract to fill the
 * space available.
 *
 * {@img ../guides/layouts/hbox.jpg}
 *
 * See the {@link Ext.layout.HBox HBox layout docs} for more information on using hboxes.
 *
 * ## Vertical Box
 *
 * VBox allows you to easily lay out child components verticaly. It can size items based on a fixed height or a
 * fraction of the total height available, enabling you to achieve flexible layouts that expand or contract to fill the
 * space available.
 *
 * {@img ../guides/layouts/vbox.jpg}
 *
 * See the {@link Ext.layout.VBox VBox layout docs} for more information on using vboxes.
 */
Ext.define('Ext.layout.AbstractBox', {
    extend: 'Ext.layout.Default',

    config: {
        /**
         * @cfg {String} align
         * Controls how the child items of the container are aligned. Acceptable configuration values for this property are:
         *
         * - ** start ** : child items are packed together at left side of container
         * - ** center ** : child items are packed together at mid-width of container
         * - ** end ** : child items are packed together at right side of container
         * - **stretch** : child items are stretched vertically to fill the height of the container
         *
         * Please see the 'Pack and Align' section of the [Layout guide](#!/guide/layouts) for a detailed example and
         * explanation.
         * @accessor
         */
        align: 'stretch',

        /**
         * @cfg {String} pack
         * Controls how the child items of the container are packed together. Acceptable configuration values
         * for this property are:
         *
         * - ** start ** : child items are packed together at left side of container
         * - ** center ** : child items are packed together at mid-width of container
         * - ** end ** : child items are packed together at right side of container
         *
         * Please see the 'Pack and Align' section of the [Layout guide](#!/guide/layouts) for a detailed example and
         * explanation.
         * @accessor
         */
        pack: null
    },

    flexItemCls: Ext.baseCSSPrefix + 'layout-box-item',

    positionMap: {
        middle: 'center',
        left: 'start',
        top: 'start',
        right: 'end',
        bottom: 'end'
    },

    constructor: function(container) {
        this.callParent(arguments);

        container.innerElement.addCls(this.cls);

        container.on(this.sizeChangeEventName, 'onItemSizeChange', this, {
            delegate: '> component'
        });
    },

    reapply: function() {
        this.container.innerElement.addCls(this.cls);

        this.updatePack(this.getPack());
        this.updateAlign(this.getAlign());
    },

    unapply: function() {
        this.container.innerElement.removeCls(this.cls);

        this.updatePack(null);
        this.updateAlign(null);
    },

    /**
     * @private
     */
    doItemAdd: function(item, index) {
        this.callParent(arguments);

        if (item.isInnerItem()) {
            var size = item.getConfig(this.sizePropertyName),
                config = item.config;

            if (!size && ('flex' in config)) {
                this.setItemFlex(item, config.flex);
            }
        }
    },

    /**
     * @private
     */
    doItemRemove: function(item) {
        if (item.isInnerItem()) {
            this.setItemFlex(item, null);
        }

        this.callParent(arguments);
    },

    onItemSizeChange: function(item) {
        this.setItemFlex(item, null);
    },

    /**
     * @private
     */
    doItemCenteredChange: function(item, centered) {
        if (centered) {
            this.setItemFlex(item, null);
        }

        this.callParent(arguments);
    },

    /**
     * @private
     */
    doItemFloatingChange: function(item, floating) {
        if (floating) {
            this.setItemFlex(item, null);
        }

        this.callParent(arguments);
    },

    /**
     * @private
     */
    doItemDockedChange: function(item, docked) {
        if (docked) {
            this.setItemFlex(item, null);
        }

        this.callParent(arguments);
    },

    redrawContainer: function() {
        var container = this.container,
            renderedTo = container.renderElement.dom.parentNode;

        if (renderedTo && renderedTo.nodeType !== 11) {
            container.innerElement.redraw();
        }
    },

    /**
     * Sets the flex of an item in this box layout.
     * @param {Ext.Component} item The item of this layout which you want to update the flex of.
     * @param {Number} flex The flex to set on this method
     */
    setItemFlex: function(item, flex) {
        var element = item.element,
            flexItemCls = this.flexItemCls;

        if (flex) {
            element.addCls(flexItemCls);
        }
        else if (element.hasCls(flexItemCls)) {
            this.redrawContainer();
            element.removeCls(flexItemCls);
        }

        element.dom.style.webkitBoxFlex = flex;
    },

    convertPosition: function(position) {
        if (this.positionMap.hasOwnProperty(position)) {
            return this.positionMap[position];
        }

        return position;
    },

    applyAlign: function(align) {
        return this.convertPosition(align);
    },

    updateAlign: function(align) {
        this.container.innerElement.dom.style.webkitBoxAlign = align;
    },

    applyPack: function(pack) {
         return this.convertPosition(pack);
    },

    updatePack: function(pack) {
        this.container.innerElement.dom.style.webkitBoxPack = pack;
    }
});
