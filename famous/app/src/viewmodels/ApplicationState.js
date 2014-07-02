/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var ViewModel = require('prototypes/ViewModel');
    var BrowserHistory   = require('models/BrowserHistory');

    /*
     * @name ApplicationState
     * @constructor
     * @description
     */

    function ApplicationState() {
        ViewModel.apply(this, arguments);

        this._previousViews = {};
        this._stateDefinitions = {};
        this._view = null;

        BrowserHistory.on('pop-state', _handleStatePopEvent.bind(this));
    }

    ApplicationState.prototype = Object.create(ViewModel.prototype);
    ApplicationState.prototype.constructor = ApplicationState;

    ApplicationState.prototype.defineState = function(name, options) {
        this._stateDefinitions[name] = options;
        return this;
    };

    ApplicationState.prototype.currentView = function() {
        return this._view;
    }

    ApplicationState.prototype.goBack = function() {
        BrowserHistory.back();
        return true;
    }

    ApplicationState.prototype.navigateToState = function(name, options) {
        var stateDefinition = this._stateDefinitions[name];
        if(stateDefinition === undefined) return false;

        var url = '#' + stateDefinition.url;

        BrowserHistory.pushState(options, name, url);

        _createAndShowState.call(this, stateDefinition, options);

        this._previousViews[url] = this._view;

        return true;
    }

    ApplicationState.prototype.setCurrentView = function(view, goBack) {
        this._view = view;

        this._eventOutput.emit('state-navigation', {
            view: view,
            goBack: goBack
        });
    }

    function _createAndShowState(stateDefinition, options) {
        var PageViewModel = stateDefinition.viewmodel;
        var View = stateDefinition.view;

        var view = new View();
        view.bindToModel(new PageViewModel(this, options));

        this.setCurrentView(view);
    }

    function _handleStatePopEvent(data) {
        var url = data.location.hash;
        var view = this._previousViews[url];

        this.setCurrentView(view, true);
    }

    module.exports = ApplicationState;
});
