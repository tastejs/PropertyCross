Ext.define('PropertyFinder.store.Searches', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'searches',
        autoLoad: true,
        model: 'PropertyFinder.model.Search',
        sorters: {
            property: 'searchTimeMS',
            direction: 'DESC'
        }
    }
});
