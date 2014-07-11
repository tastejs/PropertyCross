/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var EventHandler = require('famous/core/EventHandler');

    var _event = new EventHandler();

    var depth = 0;

    var BrowserHistory = {
        back: function() {
            window.history.back();
        },
        canGoBack: function() {
            return depth > 0;
        },
        noState: function() {
            return !history.state;
        },
        pushState: function(data, title, url) {
            depth += 1;

            var state = {
                data: data,
                depth: depth,
                url: url
            };

            window.history.pushState(state, title, url);
        },
        replaceState: function(data, title, url) {
            var state = {
                data: data,
                depth: depth,
                url: url
            };

            window.history.replaceState(state, title, url);
        },
        reset: function() {
            depth = 0;
            window.history.replaceState(null, '');
        }
    };

    EventHandler.setOutputHandler(BrowserHistory, _event);

    window.onpopstate = function(event) {
        var state = event.state;
        var previousDepth = depth;

        if(state !== null) {
            depth = state.depth;

            _event.emit(depth < previousDepth ? 'pop-state' : 'push-state', {
                url: state.url,
                state: state.data
            });
        } else {
            depth = 0;

            _event.emit('pop-state', null);
        }
    };

    module.exports = BrowserHistory;
});
