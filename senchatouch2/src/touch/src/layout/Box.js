/**
 * @aside guide layouts
 * @aside video layouts
 *
 * Box is a superclass for the two box layouts:
 *
 * * {@link Ext.layout.HBox hbox}
 * * {@link Ext.layout.VBox vbox}
 *
 * Box itself is never used directly, but its subclasses provide flexible arrangement of child components
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
Ext.define('Ext.layout.Box', {
    extend: 'Ext.layout.Default',

    config: {
        orient: 'horizontal',

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
        align: 'start',

        /**
         * @cfg {String} pack
         * Controls how the child items of the container are packed together. Acceptable configuration values
         * for this property are:
         *
         * - ** start ** : child items are packed together at left side of container
         * - ** center ** : child items are packed together at mid-width of container
         * - ** end ** : child items are packed together at right side of container
         * - ** justify ** : child items are packed evenly across the container. Uses the 'justify-content: space-between' css property
         *
         * Please see the 'Pack and Align' section of the [Layout guide](#!/guide/layouts) for a detailed example and
         * explanation.
         * @accessor
         */
        pack: 'start'
    },

    alias: 'layout.tablebox',

    layoutBaseClass: 'x-layout-tablebox',

    itemClass: 'x-layout-tablebox-item',

    setContainer: function(container) {
        this.callSuper(arguments);

        container.innerElement.addCls(this.layoutBaseClass);

        container.on('flexchange', 'onItemFlexChange', this, {
            delegate: '> component'
        });
    },

    onItemInnerStateChange: function(item, isInner) {
        this.callSuper(arguments);

        item.toggleCls(this.itemClass, isInner);
    },

    onItemFlexChange: function() {

    }
});
