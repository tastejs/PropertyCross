Ext.define('PropertyFinder.store.Results', {
    extend: 'Ext.data.Store',

    config: {
        storeId: 'results',
        model: 'PropertyFinder.model.Results',
        autoLoad: false, //need to set place_name or centre_point param before loading.
        pageSize: 20,
        proxy: {
            type: 'jsonp',
            url: 'http://api.nestoria.co.uk/api',
            reader: {
                type: 'json',
                rootProperty: 'response.listings',
                totalProperty: 'response.total_results'
            },
            extraParams: {
                country : 'uk',
                pretty : '1',
                action : 'search_listings',
                encoding : 'json',
                listing_type : 'buy'
            }
        }
    }
});