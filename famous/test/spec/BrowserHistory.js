/*global define, describe, it */
define(function(require, exports, module) {
    'use strict';
    var BrowserHistory = require('models/BrowserHistory');

    describe('Browser History', function() {
        it('should use HTML History API when going back by one state', function() {
            spyOn(window.history, 'back');

            BrowserHistory.back();

            expect(window.history.back).toHaveBeenCalled();
        });

        it('should use HTML History API when pushing a new state', function() {
            spyOn(window.history, 'pushState');

            BrowserHistory.pushState('data', 'state-title', 'state-url');

            expect(window.history.pushState).toHaveBeenCalled();
        });

        it('should emit "pop-state" event in response to HTML History API', function() {
            var callback = { response: function() {} };
            spyOn(callback, 'response');

            BrowserHistory.on('pop-state', callback.response);

            window.onpopstate({
                state: 'data'
            });

            expect(callback.response).toHaveBeenCalled();
        });
    });
});
