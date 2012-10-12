/**
 * @class Command.preprocessor.statement.Elseif
 * @author Jacky Nguyen <jacky@sencha.com>
 */
Ext.define('Command.preprocessor.statement.Elseif', {
    extend: 'Command.preprocessor.statement.If',

    isEnd: function(line, lineStack) {
        var isEnd = false,
            parent = this.parent,
            statement = this.preprocessor.parseStatement(line);

        if (statement) {
            if (statement.type === 'elseif' || statement.type === 'else') {
                isEnd = true;
            }
        }
        else if (parent.isEnd.apply(parent, arguments)) {
            isEnd = true;
        }

        if (isEnd) {
            lineStack.unshift(line);
        }

        return isEnd;
    }
});
