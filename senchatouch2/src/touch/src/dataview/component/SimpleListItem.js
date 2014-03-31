/**
 * A SimpleListItem is a simplified list item that is used by {@link Ext.dataview.List} when
 * useSimpleItems is set to true.  It supports disclosure icons and headers and generates the
 * slimmest markup possible to achieve this. It doesn't support container functionality like adding
 * or docking items. If you require those features you should have your list use
 * {@link Ext.dataview.component.ListItem} instances.
 */
Ext.define('Ext.dataview.component.SimpleListItem', {
    extend: 'Ext.Component',
    xtype : 'simplelistitem',

    config: {
        baseCls: Ext.baseCSSPrefix + 'list-item',

        disclosure: {
            xtype: 'component',
            cls: 'x-list-disclosure',
            hidden: true
        },

        header: {
            xtype: 'component',
            cls: 'x-list-header',
            html: ' '
        },

        /*
         * @private dataview
         */
        dataview: null,

        /**
         * @cfg {Ext.data.Model} record The model instance of this ListTplItem. It is controlled by the List.
         * @accessor
         */
        record: null
    },

    initialize: function() {
        this.element.addCls(this.getBaseCls() + '-tpl');
    },

    applyHeader: function(header) {
        if (header && !header.isComponent) {
            header = Ext.factory(header, Ext.Component, this.getHeader());
        }
        return header;
    },

    updateHeader: function(header, oldHeader) {
        if (oldHeader) {
            oldHeader.destroy();
        }
    },

    applyDisclosure: function(disclosure) {
        if (disclosure && !disclosure.isComponent) {
            disclosure = Ext.factory(disclosure, Ext.Component, this.getDisclosure());
        }
        return disclosure;
    },

    updateDisclosure: function(disclosure, oldDisclosure) {
        if (disclosure) {
            this.element.appendChild(disclosure.renderElement);
        } else if (oldDisclosure) {
            oldDisclosure.destroy();
        }
    },

    updateRecord: function(record) {
        var me = this,
            dataview = me.dataview || this.getDataview(),
            data = record && dataview.prepareData(record.getData(true), dataview.getStore().indexOf(record), record),
            disclosure = this.getDisclosure();

        me.updateData(data || null);

        if (disclosure && record && dataview.getOnItemDisclosure()) {
            var disclosureProperty = dataview.getDisclosureProperty();
            disclosure[(data.hasOwnProperty(disclosureProperty) && data[disclosureProperty] === false) ? 'hide' : 'show']();
        }
    },

    destroy: function() {
        Ext.destroy(this.getHeader(), this.getDisclosure());
        this.callParent(arguments);
    }
});
