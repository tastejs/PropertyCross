Ext.define('Command.module.generate.Profile', {
    extend: 'Command.module.generate.Generator',

    description: 'Automates the generation of a new Profile',
    
    execute: function(args) {
        var path = require('path'),
            proj = this.getProjectDetails();

        args = Ext.applyIf(args, proj);
        args.appName = proj.name;
        
        this.mkdir(
            path.join('app'),
            path.join('app', 'profile')
        );
        
        this.template('profile.js', path.join('app', 'profile', args.name + '.js'));
        this.addToApp('profiles', args.name);
    }
});