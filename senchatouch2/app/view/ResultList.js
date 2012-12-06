Ext.define('PropertyFinder.view.ResultList', {
    extend: 'Ext.DataView',
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
 
        listeners: {
            //Note: using the refresh event is not ideal as it can be cancelled by other listeners..
            refresh: {
                fn: function(){
                    var store = this.getStore();
                    var showingResultsTitle = this.down('.titlebar');
                    var totalCount = store.getTotalCount();
                    var data = store.getData();
                    if(totalCount && data) {
                        var fmt = PropertyFinder.util.Format.number;
                        showingResultsTitle.setTitle("Showing " + fmt(data.length) + " of " + fmt(totalCount) + " matches");
                        showingResultsTitle.show();
                    } else {
                        showingResultsTitle.hide();
                    }
                }
            }
        } 
    }    
});
