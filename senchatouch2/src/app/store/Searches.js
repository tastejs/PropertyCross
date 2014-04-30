Ext.define('PropertyCross.store.Searches', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'searches',
        autoLoad: true,
        model: 'PropertyCross.model.Search',
        sorters: {
            property: 'searchTimeMS',
            direction: 'DESC'
        }
    }
});
