/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var LocalStorage = require('models/LocalStorage');

    var EventHandler = require('famous/core/EventHandler');

    var _event = new EventHandler();
    var _key = "Favourites";
    var _cache = LocalStorage.readObject(_key);

    function onChange() {
        LocalStorage.writeObject(_key, _cache);
        _event.emit("changed-favourites", FavouritesStore.query());
    }

    var FavouritesStore = {
        load: function(guid) {
            return _cache[guid];
        },
        query: function() {
            var result = [];
            for(var key in _cache) {
                result.push(_cache[key]);
            }
            return result;
        },
        store: function(property) {
            _cache[property.guid] = property;
            onChange();
        },
        remove: function(property) {
            delete _cache[property.guid];

            LocalStorage.writeObject(_key, _cache);
            onChange();
        }
    };

    EventHandler.setOutputHandler(FavouritesStore, _event);

    module.exports = FavouritesStore;
});
