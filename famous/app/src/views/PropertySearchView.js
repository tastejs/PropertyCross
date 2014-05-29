
define(function(require, exports, module) {
    'use strict';
    var Surface          = require('famous/core/Surface');
    var View             = require('famous/core/View');
    var RenderNode       = require('famous/core/RenderNode');
    var StateModifier    = require('famous/modifiers/StateModifier');
    var InputSurface     = require('famous/surfaces/InputSurface');
    var FlexibleLayout   = require('famous/views/FlexibleLayout');
    var GridLayout       = require('famous/views/GridLayout');
    var RenderController = require('famous/views/RenderController');

    var RecentSearchView = require('views/RecentSearchView');

    function PropertySearchView() {
        View.apply(this, arguments);

        _createLayout.call(this);

        _createInstructionalText.call(this);
        _createSearchInput.call(this);
        _createSearchButtons.call(this);
        _createResponseRenderer.call(this);

        this.recentSearchView = new RecentSearchView({});

        this.responseRenderer.show(this.recentSearchView);
    }

    PropertySearchView.prototype = Object.create(View.prototype);
    PropertySearchView.prototype.constructor = PropertySearchView;

    PropertySearchView.DEFAULT_OPTIONS = {
        contentPadding: 10
    };

    function _createLayout() {
        var layout = new FlexibleLayout({
            direction: 1,
            ratios: [true, true, true, 1]
        });

        this.surfaces = [];

        layout.sequenceFrom(this.surfaces);

        this.add(layout);
    }

    function _createInstructionalText() {
        var surface = new Surface({
            size: [undefined, 100],
            content: 'Use the form below to search for houses to buy. '
                + 'You can search by place-name, postcode, or click \'My location\', '
                + 'to search in your current location!',
            properties: {
                padding: this.options.contentPadding + 'px'
            }
        });

        this.surfaces.push(surface);
    }

    function _createSearchInput() {
        this.searchInput = new InputSurface({
            size: [undefined, 40],
            placeholder: 'Search',
            type: 'search',
            properties: {
                border: '1px solid #C8C8C8',
                borderWidth: '1px 0',
                padding: this.options.contentPadding + 'px'
            }
        });

        this.surfaces.push(this.searchInput);
    }

    function _createSearchButtons() {
        var layout = new GridLayout({
            dimensions: [2,1]
        });

        var buttons = [];

        layout.sequenceFrom(buttons);

        this.searchButton = new InputSurface({
            value: 'Go',
            type: 'button'
        });

        buttons.push(this.searchButton);

        this.geoSearchButton = new InputSurface({
            value: 'My Location',
            type: 'button'
        });

        buttons.push(this.geoSearchButton);

        var layoutNode = new RenderNode();

        var modifier = new StateModifier({
            size: [undefined, 40]
        });

        layoutNode.add(modifier).add(layout);

        this.surfaces.push(layoutNode);
    }

    function _createResponseRenderer() {
        this.responseRenderer = new RenderController();

        this.surfaces.push(this.responseRenderer);
    }

    module.exports = PropertySearchView;
});
