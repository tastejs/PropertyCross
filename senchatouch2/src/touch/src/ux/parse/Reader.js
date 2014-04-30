Ext.define('Ext.ux.parse.Reader', {
    extend: 'Ext.data.reader.Json',
    alias: 'reader.parse',

    getResponseData: function(response) {
        if(response instanceof Parse.Relation) {
          return null;
        } if (response instanceof Parse.Collection || Ext.isArray(response)) {
            var results = [];

            if (Ext.isArray(response)) {
                response = {
                    models: response
                }
            }

            Ext.Array.forEach(response.models, function(item) {
                item.attributes.id = item.id;
                results.push(item.attributes);
            });
            return results;
        }
        return response;
    },


    buildRecordDataExtractor: function() {
        var me = this,
            code = [
            'return function(source) {',
                'return source;',
            '}'
        ];

        return Ext.functionFactory(code.join('')).call(me);
    }
})
;