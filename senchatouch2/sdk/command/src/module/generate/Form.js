Ext.define('Command.module.generate.Form', {
    extend: 'Command.module.generate.Generator',

    description: 'Automates the generation of a new Form',
    
    execute: function() {
        var path = require('path'),
            fields = this.args.fields.split(','),
            length = fields.length,
            i;
        
        //parse fields
        for (i = 0; i < length; i++) {
            splits = fields[i].split(":");
            
            fields[i] = {
                name: splits[0],
                type: splits[1] || 'text',
                label: Ext.String.capitalize(splits[0])
            };
        }
        
        Ext.apply(this.args, {
            fields: fields,
            xtype: this.args.name.toLowerCase()
        });
        
        this.mkdir(
            path.join('app'),
            path.join('app', 'view')
        );
        
        this.template('form.js', path.join('app', 'view', this.args.name + '.js'));
        this.addToApp('views', this.args.name);
    }
});