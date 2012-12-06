/**
 * @class Command.preprocessor.statement.Debug
 * @author Jacky Nguyen <jacky@sencha.com>
 */
Ext.define('Command.preprocessor.statement.Debug', {
    extend: 'Command.preprocessor.statement.If',

    priorities: {
        error: 3,
        warn: 2,
        info: 1
    },

    constructor: function() {
        var priorities = this.priorities,
            priority, name;

        this.callParent(arguments);

        this.setProperty('debug', true);

        for (name in priorities) {
            if (priorities.hasOwnProperty(name)) {
                if (this.getProperty(name)) {
                    priority = priorities[name];
                    this.removeProperty(name);
                    break;
                }
            }
        }

        if (!priority) {
            priority = 1;
        }

        this.setProperty('debugLevel', '<=' + priority);
    }
});
