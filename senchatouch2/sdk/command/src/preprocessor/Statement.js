/**
 * @class Command.preprocessor.Statement
 * @author Jacky Nguyen <jacky@sencha.com>
 */
Ext.define('Command.preprocessor.Statement', {
    requires: 'Command.Preprocessor',

    isInverted: false,
    properties: {},
    buffer: '',
    parent: null,

    statics: {
        factory: function(type, properties, isInverted) {
            var className, classFile, classReference, statement;

            if (Ext.isObject(type)) {
                properties = type.properties;
                isInverted = type.isInverted;
                type = type.type;
            }

            type = type.toLowerCase();

            className = 'Command.preprocessor.statement.' + Ext.String.capitalize(type);

            classReference = Ext.ClassManager.get(className);

            if (!classReference) {
                classFile = Ext.Loader.getPath(className);

                if (require('path').existsSync(classFile)) {
                    classReference = Ext.require(className);
                }
                else {
                    // Not supported
                    Ext.Logger.info("Statement type '" + type + "' is currently not supported, ignored");
                    return false;
                }
            }

            statement = new classReference(properties, isInverted);
            statement.type = type;

            return statement;
        }
    },

    constructor: function(properties, isInverted) {
        if (properties === undefined) {
            properties = {};
        }

        if (isInverted === undefined) {
            isInverted = false;
        }

        this.properties = properties;
        this.isInverted = isInverted;
    },

    setProperty: function(name, value) {
        this.properties[name] = value;
    },

    getProperty: function(name) {
        var properties = this.properties;

        return properties.hasOwnProperty(name) ? properties[name] : null;
    },

    removeProperty: function(name) {
        delete this.properties[name];
    },

    isEnd: function(line, lineStack) {
        return this.preprocessor.isCloseOf(line, this);
    },

    pushBuffer: function(content, withNewLine) {
        if (withNewLine === undefined) {
            withNewLine = false;
        }

        this.buffer += content + ((withNewLine) ? "\n" : "");
    },

    resetBuffer: function() {
        this.buffer = '';
    },

    process: function(lineStack) {
        var preprocessor = this.preprocessor,
            line, subStatementData, subStatement;

        while (!lineStack.isEmpty()) {
            line = lineStack.shift();

            if (this.isEnd(line, lineStack)) {
                break;
            }

            if ((subStatementData = preprocessor.parseStatement(line)) && (subStatement = this.statics().factory(subStatementData))) {
                subStatement.parent = this;
                this.onSubStatement(subStatement, lineStack);
            }
            else {
                this.pushBuffer(line, !lineStack.isEmpty());
            }
        }

        return this.buffer;
    },

    onSubStatement: function(statement, lineStack) {
        this.pushBuffer(statement.process(lineStack));
    }

}, function() {
    this.addMember('preprocessor', Command.Preprocessor.getInstance());
});
