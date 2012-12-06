Ext.define('PropertyFinder.store.Favourites', {
    extend: 'Ext.data.Store',

    config: {
		storeId: 'favourites',
		model: 'PropertyFinder.model.Results',
        autoLoad: true
    }
});