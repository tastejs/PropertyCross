/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var BrowserHistory  = require('models/BrowserHistory');
    var HeaderView      = require('views/ApplicationHeader');
    var HeaderViewModel = require('viewmodels/ApplicationHeader');
    var ViewModel       = require('prototypes/ViewModel');

    /*
     * @name ApplicationState
     * @constructor
     * @description
     */

    function ApplicationState(userNotifier) {
        ViewModel.apply(this, arguments);

        this._userNotifier = userNotifier;

        this._previousViews = {};
        this._stateDefinitions = {};
        this._view = null;

        this._headerView = new HeaderView({
            headerSize: 40,
            backgroundColor: '#ff5722',
            color: 'white'
        });
        this._headerView.bindToModel(new HeaderViewModel(this));

        BrowserHistory.reset();
        BrowserHistory.on('pop-state', _handlePopState.bind(this));
        BrowserHistory.on('push-state', _handlePushState.bind(this));
    }

    ApplicationState.prototype = Object.create(ViewModel.prototype);
    ApplicationState.prototype.constructor = ApplicationState;

    ApplicationState.prototype.defineState = function(name, options) {
        this._stateDefinitions[name] = options;
        return this;
    };

    ApplicationState.prototype.displayUserNotification = function(title, details) {
        if (this._userNotifier !== undefined) {
            return this._userNotifier.displayUserNotification(title, details);
        }
        return false;
    };

    ApplicationState.prototype.currentView = function() {
        return this._view;
    };

    ApplicationState.prototype.goBack = function() {
        BrowserHistory.back();
    };

    ApplicationState.prototype.navigateToState = function(name, options) {
        var stateDefinition = this._stateDefinitions[name];
        if (stateDefinition === undefined) {
            return false;
        }

        var PageViewModel = stateDefinition.viewmodel;
        var View = stateDefinition.view;

        var view = new View();
        view.bindToModel(new PageViewModel(this, options));

        var url = '#' + stateDefinition.url;
        if (BrowserHistory.noState()) {
            BrowserHistory.replaceState(options, name, url);
        }
        else {
            BrowserHistory.pushState(options, name, url);
        }

        this.setCurrentView(view, false);

        this._previousViews[url] = this._view;

        return true;
    };

    ApplicationState.prototype.setCurrentView = function(view, goingBack) {
        this._view = view;

        this._eventOutput.emit('state-navigation', {
            goingBack: goingBack,
            view: view
        });
    };

    ApplicationState.prototype.updateHeading = function() {
        this._eventOutput.emit('update-heading', this._view);
    };

    function _handlePopState(data) {
        if (data !== null) {
            var view = this._previousViews[data.url];

            this.setCurrentView(view, true);
        }
    }

    function _handlePushState(data) {
        var view = this._previousViews[data.url];

        this.setCurrentView(view, false);
    }

    module.exports = ApplicationState;
});
