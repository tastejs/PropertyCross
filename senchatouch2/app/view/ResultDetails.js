Ext.define('PropertyFinder.view.ResultDetails', {
    extend: 'Ext.Container',
    xtype: 'resultdetails',
    requires: ['PropertyFinder.util.Format', 'Ext.Img'],

    config: {
        title: 'Information',
        iconCls: 'home',
        scrollable: true,
        defaultType: 'panel',
        items: [
            {
                padding: '15 15 0 15',
                style: 'font-size: 24px',
                tpl:  Ext.create('Ext.XTemplate', '{[PropertyFinder.util.Format.currency(values.price)]}')
            },
            {
                padding: '2 15 0 15',
                style: 'font-size: 18px',
                tpl:  Ext.create('Ext.XTemplate', '{[PropertyFinder.util.Format.title(values.title)]}')
            },
            {
                xtype: 'img',
                padding: 5,
                mode: 'image',
                width: '100%'
            },
            {
                padding: '2 15 0 15',
                style: 'font-size: 14px',
                tpl: '<tpl if="bedroom_number">Bedrooms: {bedroom_number}<tpl if="bathroom_number">, </tpl></tpl><tpl if="bathroom_number">Bathrooms: {bathroom_number}</tpl>'
            },
            {
                padding: '2 15 15 15',
                style: 'font-size: 18px',
                tpl: '{summary}'
            }
        ],

        record: null
    },

    updateRecord: function(newRecord) {
        if (newRecord) {
            //set data on details tab
            var data = newRecord.data;
            Ext.each(this.query('panel'), function(item, index){
                item.setData(data);
            });
            this.down('img').setSrc(data.img_url);
        }
    }
});
