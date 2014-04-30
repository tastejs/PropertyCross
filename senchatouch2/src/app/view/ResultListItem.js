Ext.define('PropertyCross.view.ResultListItem', {
    extend: 'Ext.dataview.component.ListItem',
    xtype: 'resultlistitem',
	
	requires: ['Ext.Img', 'PropertyCross.util.Format'],
	
	config: {
		layout: 'hbox',
		padding: 5,
		border: '0 0 1', //bottom border only - border stlye and colour has to be defined in CSS... 
		cls: 'resultlistitem',

        dataMap: {
            getImage: {
                setSrc: 'thumb_url'
            }, 
            getPrice: {
                setData: 'price'
            },
            getTitle: {
                setHtml: 'title'
            }
        },
        
		items: [
			{
				xtype: 'img',
				width: 60,
				height: 60
			},
			{
				xtype: 'container',
				layout: 'vbox',
				padding: '0 0 0 5',
				flex: 1,
				items: [
					{
                        itemId: 'price',
						style: 'font-size: 18px; line-height: normal',
						tpl:  Ext.create('Ext.XTemplate', '{[PropertyCross.util.Format.currency(values)]}')
					},
					{
                        itemId: 'title',
						style: 'font-size: 12px; line-height: normal;'
					}
				]
			}
		]
	},
	
    getImage: function() {
        return this.down('img');
    },
    getPrice: function() {
        return this.down('#price');
    },
    getTitle: function() {
        return this.down('#title');
    }
});