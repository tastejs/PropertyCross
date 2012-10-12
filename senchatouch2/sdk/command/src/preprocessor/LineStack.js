/**
 * @class Command.preprocessor.LineStack
 * @author Jacky Nguyen <jacky@sencha.com>
 */
Ext.define('Command.preprocessor.LineStack', {
    constructor: function(filePath) {
        this.stack = require('fs').readFileSync(filePath, 'utf8').split("\n");
        this.currentLineNumber = 0;
    },

    getCurrentLineNumber: function() {
        return this.currentLineNumber;
    },

    isEmpty: function() {
        return this.stack.length == 0;
    },

    shift: function() {
        this.currentLineNumber++;
        return this.stack.shift();
    },

    unshift: function(line) {
        this.currentLineNumber--;
        this.stack.unshift(line);

        return this;
    }
});
