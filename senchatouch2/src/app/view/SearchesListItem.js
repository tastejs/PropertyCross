Ext.define('PropertyCross.view.SearchesListItem', {
    extend: 'Ext.dataview.component.DataItem',
    xtype: 'searcheslistitem',
    requires: ['PropertyCross.util.Format'],

	config: {
		layout: 'hbox',
		padding: 10,
        cls: 'searcheslistitem',
        
        dataMap: {
            getPlaceName: {
                setHtml: 'display_name'
            },
            getCount: {
                setData: 'count'
            }
        },
        
		items: [
            {
                itemId: 'placeName',
                style: 'font-size: 18px',
                flex: 1
            },
            {
                itemId: 'count',
                cls: 'searchcount',
                tpl:  Ext.create('Ext.XTemplate', '{[PropertyCross.util.Format.number(values)]}')
            }
		]
	},
    
    getPlaceName: function() {
        return this.down('#placeName');
    },
    
    getCount: function() {
        return this.down('#count');
    }
});