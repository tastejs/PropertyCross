/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var ViewModel = require('prototypes/ViewModel');
    
    /*
     * @name ApplicationState
     * @constructor
     * @description
     */

    function ApplicationState() {
        ViewModel.apply(this, arguments);

        this.navigatedPages = [];
        this.states = {};
    }

    ApplicationState.prototype = Object.create(ViewModel.prototype);
    ApplicationState.prototype.constructor = ApplicationState;

    ApplicationState.prototype.defineState = function(options) {
        this.states[options.name] = options;
        return this;
    };

    ApplicationState.prototype.currentView = function() {
        var view = undefined;
        if(this.navigatedPages.length > 0) {
            view = this.navigatedPages[this.navigatedPages.length - 1].view;
        }
        return view;
    }

    ApplicationState.prototype.navigateToState = function(name, options) {
        var nextState = this.states[name];
        if(nextState === undefined) return false;

        var nextView = new (nextState.view)();
        var nextModel = new (nextState.model)(this);

        nextView.bindToModel(nextModel);

        this.navigatedPages.push({
            view: nextView,
            model: nextModel
        });

        this._eventOutput.emit('state-navigation', { view: nextView } );
        return true;
    }

    ApplicationState.prototype.goBack = function() {
        return true;
    }

    module.exports = ApplicationState;
});
