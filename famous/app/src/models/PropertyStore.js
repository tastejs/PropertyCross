/*globals define*/
define(function(require, exports, module) {
    'use strict';

    var cache = {};

    module.exports.load = function(guid) {
        return cache[guid];
    };

    module.exports.store = function(property) {
        cache[property.guid] = property;
    };
});
