/**
 * @class Command.Preprocessor
 * @author Jacky Nguyen <jacky@sencha.com>
 */
Ext.define('Command.Preprocessor', {
    statics: {
        getInstance: function() {
            if (!this.instance) {
                this.instance = new this();
            }

            return this.instance;
        }
    },

    params: {},

    process: function(filePath) {
        // This is currently not memory-efficient since it reads the whole file's content at once.
        // However nodejs doesn't have a proper / easy way to "readLine" synchronously
        // And it takes a ridiculous amount of effort to do so
        var lineStack = Ext.create('Command.preprocessor.LineStack', filePath);

        return Ext.create('Command.preprocessor.Statement').process(lineStack);
    },

    evaluate: function(name, value) {
        var params = this.params,
            modifier = null,
            param = (params.hasOwnProperty(name)) ? params[name] : false,
            match;

        if (value === undefined) {
            value = true;
        }

        if (Ext.isString(value)) {
            match = value.match(/^(!=*|<=|>=|<|>|=+)/);

            if (match) {
                modifier = match[0];
                value = value.slice(modifier.length);
            }

            // Boolean
            if (value === 'true') {
                value = true;
            }
            else if (value === 'false') {
                value = false;
            }
            // Numeric
            else if (!isNaN(value)) {
                value = parseFloat(value);
            }
        }

//        Logger.log('[DEBUG][Parser#evaluate] name:"' + name + '", modifier:'+modifier+', param:"' + param + '", value:"' + value + '"');

        switch (modifier) {
            case '!==':
            case '!=':
            case '!':
                return (param !== value);
            case '>':
                return (param > value);
            case '<':
                return (param < value);
            case '<=':
                return (param <= value);
            case '>=':
                return (param >= value);
            case '==':
                return (param == value);
            case '=':
            case '===':
            default:
                return (param === value);
        }
    },

    setParams: function(params) {
        this.params = params || {};
    },

    isCloseOf: function(string, statement) {
        if (!statement.type) {
            return false;
        }

        return string.trim().match(new RegExp("^\\/\\/(?:\\t|\\s)*<\\/" + ((statement.isInverted) ? "!" : "") +
                                   statement.type + ">$")) !== null;
    },

    isStatement: function(string) {
        return this.parseStatementParts(string) !== null;
    },

    parseStatementParts: function(string) {
        return string.trim().match(/^\/\/(?:\t|\s)*<([^\/]+)>$/);
    },

    parseStatementProperties: function(string) {
        var properties = {},
            expect = function(regexp) {
                var result = string.match(regexp);

                if (result !== null) {
                    string = string.slice(result[0].length);
                    return result[0];
                }

                return null;
            },
            name, equalSign, valueWrapper, valueCheck, value;

        while (string.length > 0) {
            expect(/^[^\w]+/i);
            name = expect(/^[\w\.\-_]+/i);

            if (name === null) {
                break;
            }

            equalSign = expect(/^=/);

            if (equalSign === null) {
                properties[name] = true;
                continue;
            }

            valueWrapper = expect(/^('|")/i);
            valueCheck = valueWrapper || "\\s";

            value = expect(new RegExp('^[^' + valueCheck + ']+'));

            if (valueWrapper !== null) {
                expect(new RegExp(valueWrapper));
            }

            properties[name] = value;
        }

        return properties;
    },

    parseStatement: function(string) {
        string = string.trim();

        var parts = this.parseStatementParts(string),
            typeMatch, statement;

        // Check if it's actually a valid statement
        if (parts === null) {
            return false;
        }

        string = parts[1];

        typeMatch = string.match(/^(!)?([\w]+)/i);

        if (typeMatch === null) {
            return false;
        }

        statement = {
            properties: {}
        };

        statement.type = typeMatch[2];
        statement.isInverted = (typeMatch[1] !== undefined);

        string = string.substr(typeMatch[0].length, string.length).trim();
        statement.properties = this.parseStatementProperties(string);

        return statement;
    }

});
