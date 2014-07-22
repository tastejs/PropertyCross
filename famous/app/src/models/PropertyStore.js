/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var FavouritesStore = require('models/FavouritesStore');

    var cache = {};

    FavouritesStore.query().forEach(function(property) {
        cache[property.guid] = property;
    });

    module.exports.load = function(guid) {
        return cache[guid];
    };

    module.exports.store = function(property) {
        cache[property.guid] = property;
    };
});
