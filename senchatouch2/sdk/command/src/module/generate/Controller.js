Ext.define('Command.module.generate.Controller', {
    extend: 'Command.module.generate.Generator',

    description: 'Automates the generation of a new Controller',
    
    execute: function(args) {
        var path = require('path'),
            proj = this.getProjectDetails();

        args = Ext.applyIf(args, proj);
        args.appName = proj.name;
        
        this.mkdir(
            path.join('app'),
            path.join('app', 'controller')
        );
        
        this.template('controller.js', path.join('app', 'controller', args.name + '.js'));
        this.addToApp('controllers', args.name);
    }
});