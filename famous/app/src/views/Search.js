
define(function(require, exports, module) {
    'use strict';
    var Surface          = require('famous/core/Surface');
    var RenderNode       = require('famous/core/RenderNode');
    var StateModifier    = require('famous/modifiers/StateModifier');
    var InputSurface     = require('famous/surfaces/InputSurface');
    var SequentialLayout   = require('famous/views/SequentialLayout');
    var GridLayout       = require('famous/views/GridLayout');
    var RenderController = require('famous/views/RenderController');

    var View         = require('prototypes/View');

    function Search() {
        View.apply(this, arguments);

        _createLayout.call(this);

        _createInstructionalText.call(this);
        _createSearchInput.call(this);
        _createSearchButtons.call(this);
        _createResponseRenderer.call(this);

        this.responseRenderer.show(this.recentSearchView);
    }

    Search.prototype = Object.create(View.prototype);
    Search.prototype.constructor = Search;

    Search.DEFAULT_OPTIONS = {
        contentPadding: 10
    };

    function _createLayout() {
        var layout = new SequentialLayout({
            direction: 1
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

        this.searchButton = new Surface({
            content: 'Go',
            properties: {
                backgroundColor: '#4EE',
                lineHeight: '40px',
                textAlign: 'center'
            }
        });
        this.searchButton.on('click', function() {
            var searchText = this.searchInput.getValue();
            this._model.performTextSearch(searchText);
        }.bind(this));

        buttons.push(this.searchButton);

        this.geoSearchButton = new Surface({
            content: 'My Location',
            properties: {
                backgroundColor: '#b8f',
                lineHeight: '40px',
                textAlign: 'center'
            }
        });
        this.geoSearchButton.on('click', function() {
            var latitude = 51.454513;
            var longitude = -2.587910;

            this._model.performGeoSearch(latitude, longitude);
        }.bind(this));

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

    module.exports = Search;
});
