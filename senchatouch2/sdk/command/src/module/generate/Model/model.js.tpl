Ext.define('{appName}.model.{name}', {
    extend: 'Ext.data.Model',
    
    config: {
        fields: [<tpl for="fields">
            {name: '{name}', type: '{type}'}{[xindex == xcount ? '' : ',']}</tpl>
        ]
    }
});