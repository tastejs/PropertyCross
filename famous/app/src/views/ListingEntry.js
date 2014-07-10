
define(function(require, exports, module) {
    'use strict';
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface  = require('famous/surfaces/ImageSurface');

    var RenderNode = require('famous/core/RenderNode');
    var Surface    = require('famous/core/Surface');
    var Transform  = require('famous/core/Transform');

    var FlexibleLayout = require('famous/views/FlexibleLayout');

    var MarginLayout = require('layouts/MarginLayout');

    var View         = require('prototypes/View');

    function ListingEntry() {
        View.apply(this, arguments);

        var modifier = new StateModifier({
            size: this.options.size
        });

        this.node = this.add(modifier);

        _createBacking.call(this);
        _createImage.call(this);
        _createDescription.call(this);
    }

    ListingEntry.prototype = Object.create(View.prototype);
    ListingEntry.prototype.constructor = ListingEntry;

    ListingEntry.DEFAULT_OPTIONS = {
        imageUrl: 'http://s.uk.nestoria.nestimg.com/i/all/all/all/g/cs4.png',
        price: '£0,000',
        size: [undefined, undefined],
        title: 'Property'
    };

    function _createBacking() {
        var surface = new Surface({
            properties: {
                borderBottom: '1px solid #DDD'
            }
        });
        this.node.add(surface);

        var eventHandler = this._eventOutput;

        surface.on('click', function(event) {
            eventHandler.emit('click', event);
        });
    }

    function _createImage() {
        this.imageSize = [this.options.size[1], this.options.size[1]];

        var layout = new MarginLayout({
            margins: [10, 10, 10, 10]
        });

        var surface = new ImageSurface({
            content: this.options.imageUrl,
            properties: {
                pointerEvents: 'none'
            }
        });

        layout.add(surface);

        var modifier = new StateModifier({
            size: this.imageSize
        });

        this.node.add(modifier).add(layout);
    }

    function _createDescription() {
        var imageSize = this.options.size[1];

        var layout = new MarginLayout({
            margins: [this.imageSize[0], 10, 10, 10]
        });

        var priceSurface = new Surface({
            content: this.options.price,
            size: [undefined, 20],
            properties: {
                fontSize: '20px',
                lineHeight: '20px',
                overflow: 'hidden',
                pointerEvents: 'none',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }
        });

        var titleSurface = new Surface({
            content: this.options.title,
            size: [undefined, 20],
            properties: {
                fontSize: '16px',
                lineHeight: '20px',
                overflow: 'hidden',
                pointerEvents: 'none',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }
        });

        var priceModifier = new StateModifier({
            align: [0.5, 0.5],
            origin: [0.5, 1],
            transform: Transform.translate(0, -5, 0)
        });
        var titleModifier = new StateModifier({
            align: [0.5, 0.5],
            origin: [0.5, 0],
            transform: Transform.translate(0, 5, 0)
        });

        layout.add(priceModifier).add(priceSurface);
        layout.add(titleModifier).add(titleSurface);

        this.node.add(layout);
    }

    module.exports = ListingEntry;
});
