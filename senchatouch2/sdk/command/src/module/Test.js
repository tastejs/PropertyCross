/**
 * @class Command.module.Test
 * @author Jacky Nguyen <jacky@sencha.com>
 */
Ext.define('Command.module.Test', {
    extend: 'Command.module.Abstract',

    description: 'Unit testing using Jasmine',

    actions: {
        run: [
            "Run Jasmine's unit tests",
            ['path', 'p', 'The *absolute* path to the directory that contains all spec files', 'string', null, '/path/to/specs'],
            ['verbose', 'v', 'Whether to print extra information per each test run', 'boolean', false, 'yes'],
            ['color', 'c', 'Whether to use color coding for output', 'boolean', true, 'no']
        ]
    },

    run: function(path, verbose, color) {
        require('jasmine-node').executeSpecsInFolder(path, Ext.emptyFn, verbose, color);
    }
});
