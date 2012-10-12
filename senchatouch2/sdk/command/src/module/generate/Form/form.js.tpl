Ext.define('{appName}.view.{name}', {
    extend: 'Ext.form.FieldSet',
    xtype: '{xtype}',
    
    config: {
        title: '{name}',
        
        items: [<tpl for="fields">
            {
                name: '{name}',
                xtype: '{type}field',
                label: '{label}'
            },</tpl>
            {
                xtype: 'button',
                text: 'Submit',
                ui: 'confirm'
            }
        ]        
    }
});