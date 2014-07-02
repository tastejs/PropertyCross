/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var EventHandler = require('famous/core/EventHandler');

    var _event = new EventHandler();

    var BrowserHistory = {
        back: function() {
            window.history.back();
        },
        pushState: function(data, title, url) {
            window.history.pushState(data, title, url);
        }
    }

    EventHandler.setOutputHandler(BrowserHistory, _event);

    window.onpopstate = function(event) {
        _event.emit('pop-state', {
            location: document.location,
            state:    event.state
        });
    }

    module.exports = BrowserHistory;
});
