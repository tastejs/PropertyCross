/**
 * @class Command.module.Abstract
 * @author Jacky Nguyen <jacky@sencha.com>
 */
Ext.define('Command.module.Abstract', {
    actions: {},

    constructor: function(cli) {
        this.cli = cli;
    },

    getModule: function(name) {
        return this.cli.getModule(name);
    },

    getTemplate: function(name) {
        return this.cli.getTemplate(name);
    },

    hasAction: function(action) {
        return this.actions.hasOwnProperty(action);
    },

    getActionRules: function(action) {
        return this.actions[action];
    },

    getBinaryPath: function(binary) {
        return require('path').join(this.cli.getBinPath(), binary);
    },

    getVendorPath: function(name) {
        return require('path').resolve(this.cli.getCurrentPath(), 'vendor/' + name);
    },

    escapeShell: function(cmd) {
        if (!cmd) {
            return '';
        }

        return '"' + cmd + '"';
    },

    exec: function(command, args, callback) {
        var util = require('util');

        if (typeof args == 'function') {
            callback = args;
            args = [];
        }

        args = args.map(function(arg) {
            return this.escapeShell(arg);
        }, this);
        args.unshift(command);

        command = util.format.apply(util, args);
        callback = callback.bind(this);

        require('child_process').exec(command, callback);
    }

}, function() {
    ['log', 'info', 'warn', 'error'].forEach(function(name) {
        this.addMember(name, function() {
            var args = Ext.Array.from(arguments);
            args.push(name);
            return this.cli.doLog.apply(this.cli, args);
        });
    }, this);
});
