
define(function(require, exports, module) {
    'use strict';
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var HeaderFooter  = require('famous/views/HeaderFooterLayout');
    var Lightbox      = require('famous/views/Lightbox');

    var HeaderView = require('views/ApplicationHeader');
    var View       = require('prototypes/View');

    function ApplicationState() {
        View.apply(this, arguments);

        _createLayout.call(this);
        _setupBindings.call(this);

        this.lightboxes.header.show(new HeaderView({
            headerSize: 40,
            backgroundColor: '#ff5722',
            color: 'white'
        }), { duration: 0 });
    }

    ApplicationState.prototype = Object.create(View.prototype);
    ApplicationState.prototype.constructor = ApplicationState;

    ApplicationState.DEFAULT_OPTIONS = {
        lightboxOpts: {
            inOpacity: 0.1,
            outOpacity: 0.1,
            inOrigin: [1, 0],
            outOrigin: [-1, 0],
            showOrigin: [0, 0],
            inTransform: Transform.translate(0, 0, 10),
            outTransform: Transform.translate(0, 0, -10),
            inTransition: { duration: 500, curve: 'easeOut' },
            outTransition: { duration: 500, curve: 'easeOut' },
            overlap: true
        }
    };

    function _createLayout() {
        this.layout = new HeaderFooter();

        this.lightboxes = {
            header: new Lightbox(this.options.lightboxOpts),
            content: new Lightbox(this.options.lightboxOpts),
            footer: new Lightbox(this.options.lightboxOpts)
        };

        this.modifiers = {
            header: new StateModifier({ size: [undefined, 40] }),
            footer: new StateModifier({ size: [undefined, 0] })
        };

        this.layout.header.add(this.modifiers.header).add(this.lightboxes.header);
        this.layout.content.add(this.lightboxes.content);
        this.layout.footer.add(this.modifiers.footer).add(this.lightboxes.footer);

        this.add(this.layout);
    }

    function _setupBindings() {
        this._modelEvents.on('state-navigation', _stateNavigation.bind(this));
        this._modelEvents.on('bound-model', _modelBound.bind(this));
    }

    function _modelBound(model) {
        _navigateToState.call(this, model.currentView());
    }

    function _stateNavigation(data) {
        _navigateToState.call(this, data.view);
    }

    function _navigateToState(view) {
        if(view === undefined) return;

        var container = this.lightboxes.content;
        
        if (container._showing) {
            container.show(view);
        } else {
            container.show(view, { duration : 0 });
        }
        
    }

    module.exports = ApplicationState;
});
