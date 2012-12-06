Ext.define('Command.module.Project', {
    extend: 'Command.module.Abstract',

    description: 'Utility actions to work a project',

    actions: {
        create: [
            "Generate a new project with the recommended structure",
            ['name', 'p', 'The name of the application to create', 'string', null, 'MyApp']
        ]
    },
    
    constructor: function() {
        this.templates = {};
        
        this.callParent(arguments);
    },

    create: function(name) {
        this.args = {
            name: name
        };
        
        console.log(this.args);
        
        this.createDirectories(name);
        this.copyFiles(name);
        
    },
    
    createDirectories: function(name) {
        var fs   = require('fs'),
            path = require('path');
        
        fs.mkdirSync(name);
        
        fs.mkdirSync(path.join(name, 'app'));
        fs.mkdirSync(path.join(name, 'app', 'model'));
        fs.mkdirSync(path.join(name, 'app', 'view'));
        fs.mkdirSync(path.join(name, 'app', 'controller'));
        fs.mkdirSync(path.join(name, 'app', 'store'));
        fs.mkdirSync(path.join(name, 'app', 'profile'));
        
        fs.mkdirSync(path.join(name, 'deploy'));
    },
    
    template: function(template, destination) {
        var fs   = require('fs'),
            path = require('path');
        
        template = this.getTemplate(template);
        
        console.log(template.apply(this.args));
        
        fs.writeFile(path || template, template.apply(this.args));
    },
    
    copyFiles: function(name) {
        var fs   = require('fs'),
            path = require('path');
        
        this.template('index.html')
    },
    
    getTemplate: function(name) {
        var templates = this.templates,
            template = templates[name],
            filePath;

        if (!template) {
            filePath = require('path').resolve(this.cli.getCurrentPath(), 'src/module/Project/templates/' + name + '.tpl');
            templates[name] = template = Ext.create('Ext.XTemplate', this.getModule('fs').read(filePath));
        }

        return template;
    }
});

// this.log("Generate application at " + path + " with namespace: " + namespace);
// this.info("Generate application at " + path + " with namespace: " + namespace);
// this.warn("Generate application at " + path + " with namespace: " + namespace);
// this.error("Generate application at " + path + " with namespace: " + namespace);