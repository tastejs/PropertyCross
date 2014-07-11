/*global define, describe, it */
define(function(require, exports, module) {
    'use strict';
    var ApplicationStateView      = require('views/ApplicationState');
    var ApplicationStateViewModel = require('viewmodels/ApplicationState');
    var BrowserHistory            = require('models/BrowserHistory');
    var PageViewModel             = require('prototypes/PageViewModel');
    var View                      = require('prototypes/View');

    var EventHandler = require('famous/core/EventHandler');

    var CustomMatchers = require('utils/CustomMatchers');

    var model, view;

    function TestView() {
        View.call(this, arguments);
    }

    TestView.prototype = Object.create(View.prototype);
    TestView.prototype.constructor = TestView;

    function TestPageViewModel() {
        PageViewModel.call(this, arguments);
    }

    TestPageViewModel.prototype = Object.create(PageViewModel.prototype);
    TestPageViewModel.prototype.constructor = TestPageViewModel;

//    describe('Application State view', function() {
//        it('should ...', function() {
//        });
//    });

    describe('Application State view model', function() {

        var fakeEvents;

        beforeEach(function() {
            jasmine.addMatchers(CustomMatchers);

            fakeEvents = new EventHandler();

            spyOn(BrowserHistory, 'pushState');
            spyOn(BrowserHistory, 'back');
            spyOn(BrowserHistory, 'on').and.callFake(function(type, fn) {
                fakeEvents.on(type, fn);
            });

            model = new ApplicationStateViewModel();

            view = new ApplicationStateView();
            view.bindToModel(model);

            model.defineState('home', {
                url:       '',
                view:      TestView,
                viewmodel: TestPageViewModel
            }).defineState('about', {
                url:       'About',
                view:      TestView,
                viewmodel: TestPageViewModel
            });
        });

        describe('on navigation to a state', function() {

            it('should indicate success if state is defined in model', function() {
                expect(model.navigateToState('home')).toBeTruthy();
            });

            it('should indicate failure if state is not defined in model', function() {
                expect(model.navigateToState('nonexistant')).toBeFalsy();
            });

            it('should push new state to Browser History', function() {

                model.navigateToState('home', { page: 'home' });

                expect(BrowserHistory.pushState).toHaveBeenCalledWith({ page: 'home' }, 'home', '#');
            });

            it('should update its current view', function() {
                model.navigateToState('home');

                var currentView = model.currentView();
                expect(currentView).toBeInstanceOf(TestView);
            });

        });

        describe('on navigation back to the previous state', function() {

            var startingView;

            beforeEach(function() {
                model.navigateToState('home', { page: 'home' });

                startingView = model.currentView();

                BrowserHistory.back.and.callFake(function() {
                    fakeEvents.emit('pop-state', {
                        url: '#',
                        state: { page: 'home' }
                    });
                });
            });

            it('should pop state to Browser History', function() {
                model.goBack();

                expect(BrowserHistory.back).toHaveBeenCalled();
            });

            it('should trigger \'state-navigation\' event', function(done) {

                function callbackFromStateNavigation(data) {
                    expect(data.goingBack).toBeTruthy();
                    expect(data.view).toBe(startingView);
                    done();
                }

                model.navigateToState('about', { page: 'about' });
                model.on('state-navigation', callbackFromStateNavigation);

                model.goBack();
            });
        });

        describe('on forward navigation by the browser', function() {

            var startingView;
            var navigateForward;

            beforeEach(function() {
                model.navigateToState('home', { page: 'home' });
                model.navigateToState('about', { page: 'about' });

                startingView = model.currentView();

                model.goBack();
                    fakeEvents.emit('pop-state', {
                        url: '#',
                        state: { page: 'home' }
                    });

                navigateForward = function() {
                    fakeEvents.emit('push-state', {
                        url: '#About',
                        state: { page: 'about' }
                    });
                };
            });

            it('should trigger \'state-navigation\' event', function(done) {

                function callbackFromStateNavigation(data) {
                    expect(data.goBack).toBeFalsy();
                    expect(data.view).toBe(startingView);
                    done();
                }

                model.on('state-navigation', callbackFromStateNavigation);

                navigateForward();
            });
        });

        it('can chain state definitions', function() {
            var resultOfCall = model.defineState('firststate', {});

            expect(resultOfCall).toBeDefined('Should return an object');
            expect(resultOfCall.defineState).toBeDefined('Should return an object that creates state definitions');
        });
    });
});
