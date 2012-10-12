Ext.define('Command.module.generate.Model', {
    extend: 'Command.module.generate.Generator',

    description: 'Automates the generation of a new Model',
    
    execute: function(args) {
        var path = require('path'),
            proj = this.getProjectDetails();

        args = Ext.applyIf(args, proj);
        args.appName = proj.name;
        
        var fields = args.fields,
            length = fields.length,
            field, splits, i;
        
        for (i = 0; i < length; i++) {
            splits = fields[i].split(":");
            
            if (splits.length == 2) {
                field = {
                    name: splits[0],
                    type: splits[1]
                };
            } else {
                field = {
                    name: fields[i],
                    type: 'auto'
                }
            }
            
            fields[i] = field;
        }
        
        args.fields = fields;

        this.mkdir(
            path.join('app'),
            path.join('app', 'model')
        );
        
        this.template('model.js', path.join('app', 'model', args.name + '.js'));
        this.addToApp('models', args.name);
    }
});