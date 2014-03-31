Ext.define('PropertyCross.view.ResultList', {
    extend: 'Ext.dataview.List',
    xtype: 'resultlist',
	requires: ['Ext.plugin.ListPaging', 'PropertyCross.util.Format', 'PropertyCross.view.ResultListItem'],
	config: {
		plugins: [{ 
			xclass: 'Ext.plugin.ListPaging' ,
			autoPaging: false,
			loadMoreText: 'Load more results',
			noMoreRecordsText: 'No more results',
			loadTpl: '<div class="list-loading-text">Loading ...</div>'
                    +'<div class="{cssPrefix}list-paging-msg">{message}</div>'
		}],
		
        title: 'Results',
        store: 'Results',
		defaultType: 'resultlistitem',
		useComponents: true,
        itemHeight: '70px',
        listeners: {
            //Note: using the refresh event is not ideal as it can be cancelled by other listeners..
            refresh: {
                fn: function(){
                    var store = this.getStore();
                    // only render the load more text for non-favourites view
                    if (store._storeId!=="favourites") {
                        var totalCount = store.getTotalCount();
                        var data = store.getData();
                        var pagingPlugin = this.getPlugins()[0];
                        if(totalCount && data) {
                            var fmt = PropertyCross.util.Format.number;
                            var xOfY = fmt(data.length) + " of " + fmt(totalCount);
                            // Title is not read after first set, but parent doesn't exist initially.
                            var titleLocation = this.parent ? this.parent.getNavigationBar() : this;
                            titleLocation.setTitle(xOfY + " matches");
                            var params = store.getProxy().getExtraParams();
                            var searchTerm = params.place_name || "current location";
                            pagingPlugin.setLoadMoreText("<span id='listpaging-loadmore'>Load more ...</span><br>" 
                                + "<span id='listpaging-results'>Results for <b>" + searchTerm + "</b>, showing <b>"
                    + fmt(data.length) + "</b> of <b>" + fmt(totalCount) + "</b> properties</span>");
                        }
                    }
                }
            }
        } 
    }    
});
