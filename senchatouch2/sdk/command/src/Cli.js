/**
 * @class Command.Cli
 * @author Jacky Nguyen <jacky@sencha.com>
 */
Ext.define('Command.Cli', {
    config: {
        version: '',
        logger: null,
        currentPath: '',
        binPath: '',
        modules: {}
    },

    modules: {},

    templates: {},

    ArgumentError: new Ext.Class({
        extend: Error,
        constructor: function(message){
            this.message = message;
        }
    }),

    constructor: function(config) {
        var platformName = process.platform;

        if (platformName === 'win32') {
            platformName = 'win';
        }
        else if (platformName === 'darwin') {
            platformName = 'osx';
        }
        else {
            platformName = 'linux';

            if (/64/.test(process.arch)) {
                platformName += '64';
            }
        }

        this.platformName = platformName;

        this.initConfig(config);
    },

    applyVersion: function(version) {
        return new Ext.Version(version);
    },

    applyModules: function(modules) {
        var classManager = Ext.ClassManager,
            alias, name;

        for (alias in modules) {
            if (modules.hasOwnProperty(alias)) {
                name = modules[alias];
                classManager.setAlias('Command.module.' + name, 'module.' + alias);
            }
        }

        return modules;
    },

    run: function(args) {
        var options = this.parseArguments(args),
            targets = options.targets,
            moduleName = targets.shift(),
            action = targets.shift(),
            module;

        if (!moduleName || !(module = this.getModule(moduleName))) {
            return this.printUsage();
        }

        if (!action || !module.hasAction(action)) {
            return this.printUsage(moduleName);
        }

        process.on('uncaughtException', function(e) {
            this.error(e.message);
        }.bind(this));

        try {
            this.execute(module, action, options);
        }
        catch (e) {
            this.error(e.message);

            if (e instanceof this.ArgumentError) {
                this.printUsage(moduleName, action);
            }
        }
    },

    getModule: function(name) {
        var modules = this.modules,
            module = modules[name];

        if (!module) {
            try {
                module = Ext.createByAlias('module.' + name, this);
            }
            catch (e) {
                return null;
            }

            modules[name] = module;
        }

        return module;
    },

    execute: function(module, action, options) {
        var rules = module.getActionRules(action).slice(1),
            args = [],
            targets = options.targets,
            i, ln, arg, value, name, longName, shortName, type, defaultValue;

        for (i = 0,ln = rules.length; i < ln; i++) {
            arg = rules[i];

            longName = arg[0];
            shortName = arg[1];
            type = arg[3];
            defaultValue = arg[4];
            name = '--' + longName;

            if (options.hasOwnProperty(longName)) {
                value = this.formatArgumentValue(options[longName], type, name);
            }
            else if (shortName && options.hasOwnProperty(shortName)) {
                name = '-' + shortName;
                value = this.formatArgumentValue(options[shortName], type, name);
            }
            else {
                value = targets.shift();

                if (value !== undefined) {
                    value = this.formatArgumentValue(value, type, name);
                }
                else if (defaultValue !== undefined && defaultValue !== null) {
                    value = defaultValue;
                }
                else {
                    throw new this.ArgumentError("Missing required value for argument: '" + name + "'");
                }
            }

            args.push(value);
        }

        module[action].apply(module, args);
    },

    formatArgumentValue: function(value, type, name) {
        var errorMessagePrefix = "Invalid value of: '" + value + "' for argument: '" + name + "', ";

        switch (type) {
            case "number":
                if (isNaN(value)) {
                    throw new this.ArgumentError(errorMessagePrefix + "must be a valid number");
                }
                return Number(value);
                break;

            case "array":
                if (typeof value != 'string') {
                    throw new this.ArgumentError(errorMessagePrefix + "must be a valid comma-separated list of items");
                }
                return value.split(',');
                break;

            case "boolean":
                if (value === "yes") {
                    value = true;
                }
                else if (value === "no") {
                    value = false;
                }
                return Boolean(value);
                break;

            default:
                return String(value);
        }
    },

    getTemplate: function(name) {
        var templates = this.templates,
            template = templates[name],
            filePath;

        if (!template) {
            filePath = require('path').resolve(this.getCurrentPath(), 'templates/' + name + '.tpl');
            templates[name] = template = Ext.create('Ext.XTemplate', this.getModule('fs').read(filePath));
        }

        return template;
    },

    printUsage: function(moduleName, actionName) {
        var modules = [],
            actions = [],
            module, info;

        if (!moduleName) {
            Ext.Object.each(this.getModules(), function(alias) {
                modules.push({
                    name: alias,
                    description: this.getModule(alias).description
                });
            }, this);

            console.log(this.getTemplate('modules').apply({
                version: this.getVersion().toString(),
                modules: modules
            }));
        }
        else if (!actionName) {
            module = this.getModule(moduleName);

            Ext.Object.each(module.actions, function(name, args) {
                actions.push({
                    name: name,
                    description: args[0],
                    args: args.slice(1)
                });
            });

            console.log(this.getTemplate('actions').apply({
                name: moduleName,
                description: module.description,
                actions: actions
            }));
        }
        else {
            module = this.getModule(moduleName);
            info = module.actions[actionName];

            console.log(this.getTemplate('action').apply({
                module: moduleName,
                name: actionName,
                description: info[0],
                args: info.slice(1)
            }));
        }
    },

    parseArguments: function(args) {
        var targets = [],
            options = {
                targets: targets
            },
            key = null,
            i, ln, option, match;

        for (i = 0, ln = args.length; i < ln; i++) {
            option = args[i];

            if (key !== null) {
                if (!option.match(/^-{1,2}([^-])/i)) {
                    options[key] = option;
                    key = null;
                    continue;
                }

                options[key] = true;
                key = null;
            }

            if (match = option.match(/^--([^=]+)=(.*)$/i)) {
                options[match[1]] = match[2];
            }
            else if ((match = option.match(/^--(.+)$/i)) || (match = option.match(/^-(.)$/i))) {
                key = match[1];
            }
            else if (match = option.match(/^-(.+)$/i)) {
                match[1].split('').forEach(function(a) {
                    options[a] = true;
                });
            }
            else {
                targets.push(option);
            }
        }

        if (key !== null) {
            options[key] = true;
        }

        return options;
    },

    doLog: function(message, priority, stackLevel) {
        return this.getLogger().log(message, priority, (stackLevel !== undefined) ? stackLevel : 2);
    },

    log: function(message) {
        return this.doLog(message, 'verbose');
    },

    info: function(message) {
        return this.doLog(message, 'info');
    },

    warn: function(message) {
        return this.doLog(message, 'warn');
    },

    error: function(message) {
        return this.doLog(message, 'error');
    }
});
