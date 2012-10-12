/**
 * @class Command.preprocessor.statement.Else
 * @author Jacky Nguyen <jacky@sencha.com>
 */
Ext.define('Command.preprocessor.statement.Else', {
    extend: 'Command.preprocessor.statement.If',

    isEnd: function(line, lineStack) {
        var parent = this.parent;

        if (parent.isEnd.apply(parent, arguments)) {
            lineStack.unshift(line);
            return true;
        }

        return false;
    }
});
