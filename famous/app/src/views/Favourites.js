
define(function(require, exports, module) {
    'use strict';
    var RenderNode = require('famous/core/RenderNode');
    var Surface    = require('famous/core/Surface');

    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var ScrollView     = require('famous/views/ScrollView');

    var ListingEntry = require('views/ListingEntry');
    var View         = require('prototypes/View');

    function Favourites() {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createList.call(this);
    }

    Favourites.prototype = Object.create(View.prototype);
    Favourites.prototype.constructor = Favourites;

    Favourites.DEFAULT_OPTIONS = {};

    function _createLayout() {
        var layout = new FlexibleLayout({
            direction: 1,
            ratios: [1]
        });

        this.surfaces = [];

        layout.sequenceFrom(this.surfaces);

        this.add(layout);
    }

    function _createList() {
        var renderNode = new RenderNode();
        var scrollview = new ScrollView();

        var items = [];

        scrollview.sequenceFrom(items);

        for (var i = 0; i < 100; i++) {
            var listing = new ListingEntry({
                size: [undefined, 80]
            });

            listing.pipe(scrollview);

            items.push(listing);
        }

        renderNode.add(scrollview);

        this.surfaces.push(renderNode);
    }

    module.exports = Favourites;
});
