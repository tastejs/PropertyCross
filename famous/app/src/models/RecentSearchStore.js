/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var LocalStorage = require('models/LocalStorage');

    var EventHandler = require('famous/core/EventHandler');

    var _event = new EventHandler();
    var _key = "RecentSearch";
    var _cache = LocalStorage.readObject(_key);

    function onChange() {
        LocalStorage.writeObject(_key, _cache);
        _event.emit("changed-recentsearches", RecentSearchStore.query());
    }

    function sorter(a, b) {
        return b.timestamp - a.timestamp;
    }

    var RecentSearchStore = {
        query: function() {
            var result = [];
            for(var key in _cache) {
                result.push(_cache[key]);
            }
            return result.sort(sorter).map(function(item) { return item.recentSearch });
        },
        store: function(recentSearch) {
            var timestamp = (new Date()).valueOf()
            _cache[recentSearch.query] = {
                recentSearch: recentSearch,
                timestamp: timestamp
            };
            onChange();
        },
        remove: function(recentSearch) {
            delete _cache[recentSearch.query];

            LocalStorage.writeObject(_key, _cache);
            onChange();
        }
    };

    EventHandler.setOutputHandler(RecentSearchStore, _event);

    module.exports = RecentSearchStore;
});
