Ext.define('PropertyFinder.view.ResultList', {
    extend: 'Ext.dataview.List',
    xtype: 'resultlist',
	requires: ['Ext.plugin.ListPaging', 'PropertyFinder.util.Format', 'PropertyFinder.view.ResultListItem'],
	config: {
		plugins: [{ 
			xclass: 'Ext.plugin.ListPaging' ,
			autoPaging: true,
			loadMoreText: '',
			noMoreRecordsText: ''
		}],
		
        title: 'Results',
        store: 'Results',
		defaultType: 'resultlistitem',
		useComponents: true,
        items: [
            {
                docked: 'top',
                title: '',
                ui: 'neutral',
                xtype: 'titlebar',
                style: "font-size: 10px"
            }
        ],
        itemHeight: '70px',
        listeners: {
            //Note: using the refresh event is not ideal as it can be cancelled by other listeners..
            refresh: {
                fn: function(){
                    var store = this.getStore();
                    var totalCount = store.getTotalCount();
                    var data = store.getData();
                    if(totalCount && data) {
                        var fmt = PropertyFinder.util.Format.number;
                        var xOfY = fmt(data.length) + " of " + fmt(totalCount);
                        // Title is not read after first set, but parent doesn't exist initially.
                        var titleLocation = this.parent ? this.parent.getNavigationBar() : this;
                        titleLocation.setTitle(xOfY + " matches");
                    }
                }
            }
        } 
    }    
});
