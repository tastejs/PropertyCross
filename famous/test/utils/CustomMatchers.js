/*global define, describe, it */
define(function(require, exports, module) {
    'use strict';

    var customMatchers = {
        toBeInstanceOf: function() {
            return {
                compare: function(actual, expected) {
                    var passed = !!(actual instanceof expected);
                    var description = passed ? " not to be instance of " : " to be instance of ";
                    var actualConstructorName = actual && actual.constructor.name || 'undefined';

                    return {
                        pass: passed,
                        message: "Expected " + actualConstructorName + description + expected.name
                    };
                }
            };
        }
    };

    module.exports = customMatchers;
});