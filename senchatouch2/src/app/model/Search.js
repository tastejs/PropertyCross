Ext.define('PropertyCross.model.Search', {
    extend: 'Ext.data.Model',
    requires: ['Ext.data.identifier.Uuid'],
    config: {
        fields: [
            'display_name',
            'place_name',
            'centre_point',
            'count', 
            'searchTimeMS'
        ],
        identifier: {
            type: 'uuid'
        },
        proxy: {
            type: 'localstorage',
            id  : 'PropertyCross-Searches' //should be unique..
        }
    }
});
