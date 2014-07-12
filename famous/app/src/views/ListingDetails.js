
define(function(require, exports, module) {
    'use strict';
    var RenderNode = require('famous/core/RenderNode');
    var Surface    = require('famous/core/Surface');

    var StateModifier    = require('famous/modifiers/StateModifier');
    var ImageSurface     = require('famous/surfaces/ImageSurface');
    var SequentialLayout = require('famous/views/SequentialLayout');
    var Transform = require('famous/core/Transform');

    var FavouriteButton = require('widgets/FavouriteButton');
    var RatioLayout     = require('layouts/RatioLayout');
    var View            = require('prototypes/View');

    function ListingDetails() {
        View.apply(this, arguments);

        _createLayout.call(this);

        _createImageBanner.call(this);
        _createFavouriteButton.call(this);
        _createDetails.call(this);

        _setupBindings.call(this);
    }

    ListingDetails.prototype = Object.create(View.prototype);
    ListingDetails.prototype.constructor = ListingDetails;

    ListingDetails.DEFAULT_OPTIONS = {
        imageUrl: 'http://s.uk.nestoria.nestimg.com/i/all/all/all/g/cs4.2.png',
        price: '£0,000',
        rooms: '0 bed, 0 bathrooms',
        size: [undefined, undefined],
        summary: '...',
        title: 'Property'
    };

    function _createLayout() {
        var layout = new SequentialLayout({
            direction: 1
        });

        this.surfaces = [];

        layout.sequenceFrom(this.surfaces);
        this.add(layout);
    }

    function _createImageBanner() {
        this._imageBanner = new ImageSurface({
            content: this.options.imageUrl
        });

        var node = new RatioLayout({
            ratio: [3, 2]
        });

        node.add(this._imageBanner);

        this.surfaces.push(node);
    }

    function _createFavouriteButton() {
        var buttonSize = 56;

        this._favouriteButton = new FavouriteButton({
            backgroundColor: '#ff5722',
            color: '#ccc',
            size: buttonSize
        });

        var self = this;
        this._favouriteButton.on("click", function() {
            self._model.toggleFavourites();
        });

        var node = new RenderNode();

        node.add(new StateModifier({
            align: [1, 0],
            transform: Transform.translate(-buttonSize,0,buttonSize)
        })).add(this._favouriteButton);

        this.surfaces.push(node);
    }
    function _createDetails() {
        this._title = new Surface({
            size: [undefined, 40],
            content: this.options.title,
            properties: {
                fontWeight: 'bold',
                fontSize: '20px',
                lineHeight: '20px',
                overflow: 'hidden',
                padding: '10px',
                pointerEvents: 'none',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }
        });
        this.surfaces.push(this._title);

        this._price = new Surface({
            size: [undefined, 44],
            content: this.options.price,
            properties: {
                fontWeight: 'bold',
                fontSize: '20px',
                lineHeight: '20px',
                overflow: 'hidden',
                padding: '10px',
                pointerEvents: 'none',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }
        });
        this.surfaces.push(this._price);

        this._rooms = new Surface({
            size: [undefined, 30],
            content: this.options.rooms,
            properties: {
                padding: '10px'
            }
        });
        this.surfaces.push(this._rooms);

        this._summary = new Surface({
            content: this.options.summary,
            properties: {
                padding: '10px'
            }
        });
        this.surfaces.push(this._summary);
    }

    function _setupBindings() {
        this._modelEvents.on('bound-model', function(model) {
            var listing = model.listing();

            var rooms = listing.bedrooms + " beds, " + listing.bathrooms + " bathrooms";

            this._imageBanner.setContent(listing.img.url)
            this._title.setContent(listing.title);
            this._price.setContent(listing.price);
            this._rooms.setContent(rooms);
            this._summary.setContent(listing.summary);
            
            this._favouriteButton.setFavourite(model.isFavourite());
        }.bind(this));
    }

    module.exports = ListingDetails;
});
