Ext.require('Command.preprocessor.statement.If');

describe("Command.preprocessor.statement.If", function() {
    function readFile(name) {
        return require('fs').readFileSync(require('path').resolve(__dirname, '../../../helpers/preprocessor/' + name), 'utf8');
    }

    var from = readFile('before1.js'),
        to = readFile('after1.js');

    it("should pass", function() {

    });
});
