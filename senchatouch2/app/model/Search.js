Ext.define('PropertyFinder.model.Search', {
    extend: 'Ext.data.Model',
    requires: ['Ext.data.identifier.Uuid'],
    config: {
        fields: [
            'display_name',
            'place_name',
            'count', 
            'searchTimeMS'
        ],
        identifier: {
            type: 'uuid'
        },
        proxy: {
            type: 'localstorage',
            id  : 'PropertyFinder-Searches' //should be unique..
        }
    }
});
