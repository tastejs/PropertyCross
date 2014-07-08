/*global define, describe, it */
define(function(require, exports, module) {
    'use strict';
    var BrowserHistory = require('models/BrowserHistory');

    var originalValues;

    function createHtmlHistoryApiSpy() {
        var spy = {
            depth: 0,
            states: [null]
        };

        function mimicOnPopStateEvent() {
            var depth = this.depth;

            var state = this.states[this.depth];

            window.onpopstate({
                state: state !== null ? state.data : null
            });
        }

        spy.back = jasmine.createSpy('back', function(step) {
            if(step === undefined) step = 1;
            var depth = this.depth - step;

            if(depth >= this.states.length || depth < 0) return;

            this.depth = depth;

            mimicOnPopStateEvent.call(spy);
        }.bind(spy)).and.callThrough();

        spy.go = jasmine.createSpy('go', function(step) {
            if(step === undefined) step = 1;
            var depth = this.depth + step;

            if(depth >= this.states.length || depth < 0) return;

            this.depth = depth;

            mimicOnPopStateEvent.call(spy);
        }.bind(spy)).and.callThrough();

        spy.pushState = jasmine.createSpy('pushState', function(data, title, url) {
            this.depth += 1;
            this.states[this.depth] = {
                data: data,
                title: title,
                url: url
            };
        }.bind(spy)).and.callThrough();

        return spy;
    }

    beforeEach(function() {
        originalValues = {
            history: window.history
        };
        window.history = createHtmlHistoryApiSpy();
    });

    afterEach(function() {
        window.history = originalValues.history;
    });

    describe('Browser History', function() {

        it('should use HTML History API when going back by one state', function() {
            BrowserHistory.back();

            expect(window.history.back).toHaveBeenCalled();
        });

        it('should use HTML History API when pushing a new state', function() {
            BrowserHistory.pushState({ page: 'home' }, 'home', '#');

            expect(window.history.pushState).toHaveBeenCalled();
        });

        describe('responding to the HTML History API navigating backwards', function() {

            beforeEach(function() {
                BrowserHistory.pushState({ page: 'home' }, 'home', '#');
                BrowserHistory.pushState({ page: 'about' }, 'about', '#About');
            });

            it('should emit "pop-state" event', function() {
                var callback = jasmine.createSpy('pop-state');
                BrowserHistory.on('pop-state', callback);

                window.history.back();

                expect(callback).toHaveBeenCalledWith({
                    state: { page: 'home' },
                    url: '#'
                });
            });

            it('should not emit "push-state" event', function() {
                var callback = jasmine.createSpy('push-state');
                BrowserHistory.on('push-state', callback);

                window.history.back();

                expect(callback).not.toHaveBeenCalled();
            });
        });

        describe('responding to the HTML History API navigating forwards', function() {

            beforeEach(function() {

                BrowserHistory.pushState({ page: 'home' }, 'home', '#');
                BrowserHistory.pushState({ page: 'about' }, 'about', '#About');

                window.history.back();
            });

            it('should emit "push-state" event', function() {
                var callback = jasmine.createSpy('push-state');
                BrowserHistory.on('push-state', callback);

                window.history.go();

                expect(callback).toHaveBeenCalledWith({
                    state: { page: 'about' },
                    url: '#About'
                });
            });

            it('should not emit "pop-state" event', function() {
                var callback = jasmine.createSpy('pop-state');
                BrowserHistory.on('pop-state', callback);

                window.history.go();

                expect(callback).not.toHaveBeenCalled();
            });
        });

        describe('responding to the HTML History API navigating back to initial state', function() {

            beforeEach(function() {
                BrowserHistory.pushState({ page: 'home' }, 'home', '#');
                BrowserHistory.pushState({ page: 'about' }, 'about', '#About');
            });

            it('should emit a "pop-state" event with a \'null\' value', function() {
                var callback = jasmine.createSpy('pop-state');
                BrowserHistory.on('pop-state', callback);

                window.history.back(2);

                expect(callback).toHaveBeenCalledWith(null);
            });
        });

        describe('in accordance with the HTML History API specification', function() {

            it('should not emit "push-state" event when pushing a new state', function() {
                var callback = jasmine.createSpy('push-state');
                BrowserHistory.on('push-state', callback);

                BrowserHistory.pushState({ page: 'home' }, 'home', '#');

                expect(callback).not.toHaveBeenCalled();
            });

            it('should not emit "pop-state" event when pushing a new state', function() {
                var callback = jasmine.createSpy('pop-state');
                BrowserHistory.on('pop-state', callback);

                BrowserHistory.pushState({ page: 'home' }, 'home', '#');

                expect(callback).not.toHaveBeenCalled();
            });
        });
    });
});
