/**
 * @class Command.module.Manifest
 * @author Jacky Nguyen <jacky@sencha.com>
 */
Ext.define('Command.module.Manifest', {
    extend: 'Command.module.Abstract',

    description: 'Extract class metadata',

    actions: {
        create: [
            "Generate a list of metadata for all classes found in the given directories",
            ['path', 'p', 'The directory path(s) that contains all classes', 'array', null, '/path/to/src,/path/to/another/src'],
            ['output', 'o', 'The file path to write the results to in JSON format.', 'string', null, 'metadata.json']
        ]
    },

    compareAst: function(branch, matcher) {
        var i, ln, toBranch, fromBranch;

        for (i = 0,ln = matcher.length; i < ln; i++) {
            toBranch = matcher[i];
            fromBranch = branch[i];

            if (Ext.isArray(toBranch)) {
                if (!this.compareAst(fromBranch, toBranch)) {
                    return false;
                }
            }
            else {
                if (toBranch !== undefined && toBranch !== fromBranch) {
                    return false;
                }
            }
        }

        return true;
    },

    walkAst: function(ast, matcher, single, matches) {
        var i, ln, block;

        if (!single && !matches) {
            matches = [];
        }

        for (i = 0, ln = ast.length; i < ln; i++) {
            block = ast[i];

            if (Ext.isArray(block)) {
                if (this.compareAst(block, matcher)) {
                    if (!single) {
                        matches.push(block);
                    }
                    else {
                        return block;
                    }
                }

                if (!single) {
                    this.walkAst(block, matcher, single, matches);
                }
                else {
                    return this.walkAst(block, matcher, single, matches);
                }
            }
        }

        return matches || null;
    },

    create: function(paths, output) {
        var uglifyjs = require('uglify-js'),
            findit = require('findit'),
            fsModule = this.getModule('fs'),
            fileNameMatcher = /\.js$/,
            parser = uglifyjs.parser,
            assembler = uglifyjs.uglify,
            properties = {
                extend: true,
                singleton: true,
                requires: true,
                alias: true,
                mixins: true,
                alternateClassName: true
            },
            defineMatcher = [
                "stat",
                [
                    "call",
                    [
                        "dot",
                        [
                            "name",
                            "Ext"
                        ],
                        "define"
                    ],
                    [
                        [
                            "string",
                            undefined
                        ],
                        [
                            "object"
                        ]
                    ]
                ]
            ],
            results = [],
            ast, files,
            match, body, metadata;

        paths.forEach(function(path) {
            files = findit.sync(path);

            files.forEach(function(file) {
                if (fileNameMatcher.test(file)) {
                    try {
                        ast = parser.parse(fsModule.read(file));
                    }
                    catch (e) {
                        throw new Error(require('util').format(
                            "Failed parsing file: %s\nReason: %s\nLine: %s\nColumn: %s",
                            file, e.message, e.line, e.col
                        ));
                    }

                    match = this.walkAst(ast, defineMatcher, true);

                    if (match) {
                        metadata = {};
                        metadata.name = match[1][2][0][1];

                        body = match[1][2][1][1];

                        body.forEach(function(property) {
                            if (properties.hasOwnProperty(property[0])) {
                                metadata[property[0]] = eval("(" + assembler.gen_code(property[1]) + ")");
                            }
                        });

                        results.push(metadata);
                    }
                }
            }, this);

        }, this);

        if (output) {
            fsModule.write(output, JSON.stringify(results, null, 4));
        }

        return output;
    }
});
