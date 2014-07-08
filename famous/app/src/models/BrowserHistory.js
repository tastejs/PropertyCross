/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var EventHandler = require('famous/core/EventHandler');

    var _event = new EventHandler();

    var depth = -1;

    var BrowserHistory = {
        back: function() {
            window.history.back();
        },
        pushState: function(data, title, url) {
            depth += 1;

            var state = {
                data: data,
                depth: depth,
                url: url
            };

            window.history.pushState(state, title, url);
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
            depth = -1;

            _event.emit('pop-state', null);
        }
    };

    module.exports = BrowserHistory;
});
