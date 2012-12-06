/**
 * @class Command.preprocessor.statement.Feature
 * @author Jacky Nguyen <jacky@sencha.com>
 */
Ext.define('Command.preprocessor.statement.Feature', {
    extend: 'Command.preprocessor.statement.If',

    constructor: function() {
        this.callParent(arguments);

        var properties = this.properties,
            name;

        for (name in properties) {
            if (properties.hasOwnProperty(name)) {
                this.setProperty(name, '!no');
            }
        }
    }
});
