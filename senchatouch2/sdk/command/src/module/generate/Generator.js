Ext.define('Command.module.generate.Generator', {
    constructor: function(args, cli) {
        this.templates = {};
        this.args = Ext.applyIf(args, this.getProjectDetails());
        this.cli = cli;

        this.execute(args);
    },

    template: function(templateName, destination, args) {
        var fs   = require('fs'),
            path = require('path'),
            template = this.getTemplate(templateName);

        args = args || this.args;

        template = this.getTemplate(templateName);

        fs.writeFile(destination, template.apply(args));
        this.cli.info('Created file ' + destination);
    },

    getTemplate: function(name) {
        var templates = this.templates,
            template = templates[name],

            splits = this.$className.split('.'),
            className = splits[splits.length - 1],
            templateDir = require('path').join('src', 'module', 'generate', className, name + '.tpl'),
            filePath;

        if (!template) {
            filePath = require('path').resolve(this.cli.getCurrentPath(), templateDir);
            templates[name] = template = Ext.create('Ext.XTemplate', this.cli.getModule('fs').read(filePath));
        }

        return template;
    },

    mkdir: function() {
        this.cli.getModule('fs').mkdir.apply(this.cli, arguments);
    },

    file: function(src, destination, log) {
        this.cli.getModule('fs').copyFile(src, destination);

        if (log !== false) {
            this.cli.info('Copied file: ' + destination);
        }
    },

    directory: function(src, destination, log) {
        this.cli.getModule('fs').copyDirectory(src, destination);

        if (log !== false) {
            this.cli.info('Copied dir: ' + destination);
        }
    },

    getProjectDetails: function() {
        var details = {};

        try {
            details = Ext.JSON.decode(require('fs').readFileSync('app.json'));
        } catch(e) {}

        details.appName = details.name;

        return details;
    },

    /**
     * Adds an item to the app.js definition, usage:
     *     this.addToApp('models', "MyModel");
     * This will look for a "models: [*]" in your app.js, prepending to it if it's already present, or creating it if not
     * @param {String} section The section to add to (e.g. 'models', 'views', 'controllers')
     * @param {String} item The name of the class to add
     * @param {Boolean} log Pass false to suppress logging
     */
    addToApp: function(section, item, log) {
        var fs = require('fs'),
            file = fs.readFileSync('app.js').toString();

        //if this section isn't present at all
        if (!file.match(section + "\\s*\\:")) {
            file = file.replace(/(Ext.application\(\{\n)/, "$1    " + section + ': ["' + item + '"],\n\n');
        }

        //if the section is present and empty
        else if (file.match(section + "\\s*\\:\\s*\\[\\s*\n*\]")) {
            file = file.replace(new RegExp("(" + section + "\\s*\\:\\s*\\[)",'g'), '$1"' + item + '"');
        }

        //if the seconds if present and not empty
        // else if (file.match(section + "\\s*\\:\\s*\\[\\" + '"' + "+]")) {
        else {
            file = file.replace(new RegExp("(" + section + "\\s*\\:\\s*\\[)",'g'), '$1"' + item + '", ');
        }

        if (log !== false) {
            this.cli.info('Adding ' + item + ' into app.js');
        }

        fs.writeFileSync('app.js', file);
    }
});
