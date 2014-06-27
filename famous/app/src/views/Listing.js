
define(function(require, exports, module) {
    'use strict';
    var RenderNode = require('famous/core/RenderNode');
    var Surface    = require('famous/core/Surface');

    var StateModifier  = require('famous/modifiers/StateModifier');
    var ImageSurface   = require('famous/surfaces/ImageSurface');
    var FlexibleLayout = require('famous/views/FlexibleLayout');

    var View         = require('prototypes/View');

    function Listing() {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createPriceLabel.call(this);
        _createTitleLabel.call(this);
        _createImage.call(this);
        _createRoomsLabel.call(this);
        _createDescriptionLabel.call(this);
    }

    Listing.prototype = Object.create(View.prototype);
    Listing.prototype.constructor = Listing;

    Listing.DEFAULT_OPTIONS = {
        price: '£140,000',
        title: 'Brambling Mews, Morley',
        imageUrl: 'http://3.l.uk.nestoria.nestimg.com/lis/4/a/1/07189369db21930fc53e4f176b91f1056deaa.1.jpg',
        rooms: '1 bed, 2 bathrooms',
        description: 'Situated in the heart of woodlesford is this character property which...'
    };

    function _createLayout() {
        var layout = new FlexibleLayout({
            direction: 1,
            ratios: [true, true, true, true, 1]
        });

        this.surfaces = [];

        layout.sequenceFrom(this.surfaces);

        this.add(layout);
    }

    function _createPriceLabel() {
        var surface = new Surface({
            size: [undefined, 44],
            content: this.options.price,
            properties: {
                fontSize: '24px',
                fontWeight: 'bold',
                lineHeight: '24px',
                padding: '10px'
            }
        });

        this.surfaces.push(surface);
    }

    function _createTitleLabel() {
        var surface = new Surface({
            size: [undefined, 40],
            content: this.options.title,
            properties: {
                fontSize: '20px',
                fontWeight: 'bold',
                lineHeight: '20px',
                padding: '10px'
            }
        });

        this.surfaces.push(surface);
    }

    function _createImage() {
        var surface = new ImageSurface({
            size: [true, 150],
            content: this.options.imageUrl
        });

        var modifier = new StateModifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5]
        });

        var node = new RenderNode();

        node.add(modifier).add(surface);

        this.surfaces.push(node);
    }

    function _createRoomsLabel() {
        var surface = new Surface({
            size: [undefined, 30],
            content: this.options.rooms,
            properties: {
                padding: '10px'
            }
        });

        this.surfaces.push(surface);
    }

    function _createDescriptionLabel() {
        var surface = new Surface({
            content: this.options.description,
            properties: {
                padding: '10px'
            }
        });

        this.surfaces.push(surface);
    }

    module.exports = Listing;
});
