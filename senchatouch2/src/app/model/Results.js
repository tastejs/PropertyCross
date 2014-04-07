Ext.define('PropertyCross.model.Results', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            'guid', 'title', 'price', 'property_type', 'img_url', 'thumb_url', 'summary',
            'bedroom_number', 'bathroom_number', 'latitude', 'longitude'
        ],
		proxy: {
			type: 'localstorage',
            id  : 'favourite-properties'
		},
		identifier: {
			type: 'uuid'
		}
    }
});
