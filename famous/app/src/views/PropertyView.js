
define(function(require, exports, module) {
    'use strict';

    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface  = require('famous/surfaces/ImageSurface');

    var RenderNode = require('famous/core/RenderNode');
    var Surface    = require('famous/core/Surface');
    var Transform  = require('famous/core/Transform');
    var View       = require('famous/core/View');

    var FlexibleLayout = require('famous/views/FlexibleLayout');

    var MarginLayout = require('layouts/MarginLayout');

    function PropertyView() {
        View.apply(this, arguments);

        var modifier = new StateModifier({
            size: this.options.size
        });

        this.node = this.add(modifier);

        _createBacking.call(this);
        _createImage.call(this);
        _createDescription.call(this);
    }

    PropertyView.prototype = Object.create(View.prototype);
    PropertyView.prototype.constructor = PropertyView;

    PropertyView.DEFAULT_OPTIONS = {
        price: '£140,000',
        title: 'Brambling Mews, Morley',
        imageUrl: 'http://3.l.uk.nestoria.nestimg.com/lis/4/a/1/07189369db21930fc53e4f176b91f1056deaa.1.jpg',
        size: [undefined, undefined]
    };

    function _createBacking() {
        var surface = new Surface({
            properties: {
                borderBottom: '1px solid #DDD'
            }
        });
        this.node.add(surface);
    }

    function _createImage() {
        this.imageSize = [this.options.size[1], this.options.size[1]];

        var layout = new MarginLayout({
            margins: [10, 10, 10, 10]
        });

        var surface = new ImageSurface({
            content: this.options.imageUrl
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
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }
        });

        var titleSurface = new Surface({
            content: this.options.title,
            size: [undefined, 16],
            properties: {
                fontSize: '16px',
                lineHeight: '16px',
                overflow: 'hidden',
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

    module.exports = PropertyView;
});
