Ext.define('PropertyCross.store.Favourites', {
    extend: 'Ext.data.Store',

    config: {
		storeId: 'favourites',
		model: 'PropertyCross.model.Results',
        autoLoad: true
    }
});