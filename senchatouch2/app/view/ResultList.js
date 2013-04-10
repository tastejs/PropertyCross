Ext.define('PropertyFinder.view.ResultList', {
    extend: 'Ext.DataView',
    xtype: 'resultlist',
	requires: ['Ext.plugin.ListPaging', 'PropertyFinder.util.Format', 'PropertyFinder.view.ResultListItem'],
	config: {
	    // TODO: ListPaging should not be used with DataView: http://www.sencha.com/forum/showthread.php?252338 - as a result using 2.0 version of ListPaging.js
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
 
        listeners: {
            //Note: using the refresh event is not ideal as it can be cancelled by other listeners..
            refresh: {
                fn: function(){
                    var store = this.getStore();
                    var totalCount = store.getTotalCount();
                    var data = store.getData();
                    if(totalCount && data) {
                        var fmt = PropertyFinder.util.Format.number;
                        this.setTitle(fmt(data.length) + " of " + fmt(totalCount) + " matches");
                    }
                }
            }
        } 
    }    
});
