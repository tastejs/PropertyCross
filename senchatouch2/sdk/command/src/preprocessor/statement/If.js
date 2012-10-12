/**
 * @class Command.preprocessor.statement.If
 * @author Jacky Nguyen <jacky@sencha.com>
 */
Ext.define('Command.preprocessor.statement.If', {
    extend: 'Command.preprocessor.Statement',

    satisfied: false,

    evaluate: function() {
        var ret = true,
            preprocessor = this.preprocessor,
            properties = this.properties,
            name;

        for (name in properties) {
            if (properties.hasOwnProperty(name) && !preprocessor.evaluate(name, properties[name])) {
                ret = false;
//                Logger.log('[DEBUG][Parser.Statement.If#evaluate] ' + ret + ' because "' + Parser.params[n] + '" doesn\'t evaluate to "' + this.properties[n] + '"');
                break;
            }
        }

        return (this.isInverted ? !ret : ret);
    },

    process: function(lineStack) {
        if (this.evaluate()) {
            this.satisfied = true;
        }

        this.callParent(arguments);

        if (!this.satisfied) {
            return '';
        }

        return this.buffer;
    },

    onSubStatement: function(statement, lineStack) {
        var processed = statement.process(lineStack),
            satisfied = false;

        if (statement.type === 'elseif') {
            if (!this.satisfied) {
                if (statement.evaluate()) {
                    this.satisfied = true;
                    satisfied = true;
                }
            }
        }
        else if (statement.type === 'else') {
            if (!this.satisfied) {
                this.satisfied = true;
                satisfied = true;
            }
        }
        else {
            this.pushBuffer(processed);
            return;
        }

        if (satisfied) {
            this.resetBuffer();
            this.pushBuffer(processed);
        }
    }
});
