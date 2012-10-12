/**
 * @aside guide layouts
 * @aside video layouts
 *
 * Fit Layout is probably the simplest layout available. All it does is make a child component fit to the full size of
 * its parent Container.
 *
 * {@img ../guides/layouts/fit.jpg}
 *
 * For example, if you have a parent Container that is 200px by 200px and give it a single child component and a 'fit'
 * layout, the child component will also be 200px by 200px:
 *
 *     var panel = Ext.create('Ext.Panel', {
 *         width: 200,
 *         height: 200,
 *         layout: 'fit',
 *
 *         items: {
 *             xtype: 'panel',
 *             html: 'Also 200px by 200px'
 *         }
 *     });
 *
 *     Ext.Viewport.add(panel);
 *
 * For a more detailed overview of what layouts are and the types of layouts shipped with Sencha Touch 2, check out the
 * [Layout Guide](#!/guide/layouts).
 */
Ext.define('Ext.layout.Fit', {
    extend: 'Ext.layout.Default',
    alternateClassName: 'Ext.layout.FitLayout',

    alias: 'layout.fit',

    cls: Ext.baseCSSPrefix + 'layout-fit',

    itemCls: Ext.baseCSSPrefix + 'layout-fit-item',

    constructor: function(container) {
        this.callParent(arguments);

        this.apply();
    },

    apply: function() {
        this.container.innerElement.addCls(this.cls);
    },

    reapply: function() {
        this.apply();
    },

    unapply: function() {
        this.container.innerElement.removeCls(this.cls);
    },

    doItemAdd: function(item, index) {
        if (item.isInnerItem()) {
            item.addCls(this.itemCls);
        }

        this.callParent(arguments);
    },

    /**
     * @private
     */
    doItemRemove: function(item) {
        if (item.isInnerItem()) {
            item.removeCls(this.itemCls);
        }

        this.callParent(arguments);
    }
});
