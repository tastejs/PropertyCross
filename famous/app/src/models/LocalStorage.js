/*globals define*/
define(function(require, exports, module) {
    'use strict';

    var localStorage = window.localStorage;
    var json = window.JSON;

    
    var LocalStorage = {
        readObject: function(key) {
            var stringRepresentation = localStorage.getItem(key) || "{}";
            return json.parse(stringRepresentation);
        },
        writeObject: function(key, data) {
            var stringRepresentation = json.stringify(data);
            localStorage.setItem(key, stringRepresentation);
        }
    };

    module.exports = LocalStorage;
});
