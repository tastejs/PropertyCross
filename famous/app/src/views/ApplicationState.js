
define(function(require, exports, module) {
    'use strict';
    var HeaderFooter     = require('famous/views/HeaderFooterLayout');
    var Transform        = require('famous/core/Transform');
    var RenderController = require('famous/views/RenderController');
    var StateModifier    = require('famous/modifiers/StateModifier');

    var View       = require('prototypes/View');

    function ApplicationState() {
        View.apply(this, arguments);

        _createLayout.call(this);
        _setupBindings.call(this);

        this._view = null;
    }

    ApplicationState.prototype = Object.create(View.prototype);
    ApplicationState.prototype.constructor = ApplicationState;

    ApplicationState.DEFAULT_OPTIONS = {
        contollerOpts: {
            inTransition: { duration: 500, curve: 'easeOut' },
            outTransition: { duration: 500, curve: 'easeOut' },
            overlap: true
        }
    };

    function _createLayout() {
        this.layout = new HeaderFooter();

        this.controller = new RenderController(this.options.contollerOpts);

        var opacityMap = function(progress) { return progress; };

        this.controller.inOpacityFrom(opacityMap);
        this.controller.outOpacityFrom(opacityMap);

        this.layout.content.add(this.controller);

        this.add(this.layout);
    }

    function _setupBindings() {
        this._modelEvents.on('state-navigation', _stateNavigation.bind(this));
        this._modelEvents.on('bound-model', _modelBound.bind(this));
    }

    function _modelBound(model) {
        this.layout.header.add(model._headerView);
        _navigateToState.call(this, model.currentView(), false);
    }

    function _stateNavigation(data) {
        _navigateToState.call(this, data.view, data.goingBack);
    }

    function _navigateToState(view, navigationBackwards) {
        if(view === undefined || view === this._view) return;

        var leftEnterExit = function(progress) {
            return [progress - 1, 0];
        };

        var rightEnterExit = function(progress) {
            return [1 - progress, 0];
        };

        if(navigationBackwards) {
            this.controller.inOriginFrom(leftEnterExit);
            this.controller.outOriginFrom(rightEnterExit);
        } else {
            this.controller.inOriginFrom(rightEnterExit);
            this.controller.outOriginFrom(leftEnterExit);
        }
        
        if (this._view === null) {
            this.controller.show(view, { duration : 0 });
        } else {
            this.controller.hide();
            this.controller.show(view);
        }

        this._view = view;
    }

    module.exports = ApplicationState;
});