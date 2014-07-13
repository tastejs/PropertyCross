
define(function(require, exports, module) {
    'use strict';
    var Surface    = require('famous/core/Surface');

    var ScrollContainer = require('famous/views/ScrollContainer');

    var ListingEntry = require('widgets/ListingEntry');
    var View         = require('prototypes/View');

    function Favourites() {
        View.apply(this, arguments);

        _createLayout.call(this);
        _setupBindings.call(this);
    }

    Favourites.prototype = Object.create(View.prototype);
    Favourites.prototype.constructor = Favourites;

    Favourites.DEFAULT_OPTIONS = {};

    function _createLayout() {
        this._scrollContainer = new ScrollContainer({
            scrollview: {direction: 1}
        });

        this._items = [];

        this._scrollContainer.sequenceFrom(this._items);

        this.add(this._scrollContainer);
    }

    function _setupBindings() {
        this._modelEvents.on('update-listing', _updateListing.bind(this));
        this._modelEvents.on('bound-model', _modelBound.bind(this));
    }

    function _modelBound(model) {
        _updateListing.call(this, model.listings());
    }

    function _updateListing(listings) {
        //Clear all items
        this._items.splice(0,this._items.length);

        var self = this;

        listings.forEach(function(item) {
            var listing = new ListingEntry({
                imageUrl: item.thumb.url,
                price: item.price,
                size: [undefined, 80],
                title: item.title
            });

            listing.pipe(self._scrollContainer);

            listing.on('click', function(event) {
                self._model.displayListing(item.guid);
            });

            self._items.push(listing);
        });
    }

    module.exports = Favourites;
});
