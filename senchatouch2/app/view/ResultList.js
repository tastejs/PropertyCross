﻿Ext.define('PropertyFinder.view.ResultList', {
    extend: 'Ext.dataview.List',
    xtype: 'resultlist',
	requires: ['Ext.plugin.ListPaging', 'PropertyFinder.util.Format', 'PropertyFinder.view.ResultListItem'],
	config: {
		plugins: [{ 
			xclass: 'Ext.plugin.ListPaging' ,
			autoPaging: false,
			loadMoreText: 'Load more results',
			noMoreRecordsText: 'No more results',
			loadTpl: '<div class="list-loading-text">Loading...</div>'
                    +'<div class="{cssPrefix}list-paging-msg">{message}</div>'
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
                    var pagingPlugin = this.getPlugins()[0];
                    if(totalCount && data) {
                        var fmt = PropertyFinder.util.Format.number;
                        var xOfY = fmt(data.length) + " of " + fmt(totalCount);
                        // Title is not read after first set, but parent doesn't exist initially.
                        var titleLocation = this.parent ? this.parent.getNavigationBar() : this;
                        titleLocation.setTitle(xOfY + " matches");
                        var params = store.getProxy().getExtraParams();
                        var searchTerm = params.place_name || "current location";
                        pagingPlugin.setLoadMoreText("<span id='listpaging-loadmore'>Load more...</span><br>" 
                            + "<span id='listpaging-results'>Results for " + searchTerm + ", showing " + xOfY + " properties</span>");
                    }
                }
            }
        } 
    }    
});
