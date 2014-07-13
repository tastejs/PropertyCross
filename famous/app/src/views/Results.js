
define(function(require, exports, module) {
    'use strict';
    var Surface    = require('famous/core/Surface');

    var ScrollContainer = require('famous/views/ScrollContainer');

    var ListingEntry  = require('widgets/ListingEntry');
    var LoadMoreEntry = require('widgets/LoadMoreEntry');
    var View          = require('prototypes/View');

    function Results() {
        View.apply(this, arguments);

        _createLayout.call(this);
        _setupBindings.call(this);
    }

    Results.prototype = Object.create(View.prototype);
    Results.prototype.constructor = Results;

    Results.DEFAULT_OPTIONS = {
        size: [undefined, 40]
    };

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
        _updateListing.call(this, {
            listings: model.listings(),
            searchTerm: model.searchTerm(),
            total: 22
        });
    }

    function _updateListing(data) {
        //Clear all items
        this._items.splice(0,this._items.length);

        data.listings.forEach(function(item) {
            var listing = new ListingEntry({
                imageUrl: item.thumb.url,
                price: item.price,
                size: [undefined, 80],
                title: item.title
            });

            listing.pipe(this._scrollContainer);

            listing.on('click', function(event) {
                this._model.displayListing(item.guid);
            }.bind(this));

            this._items.push(listing);
        }, this);

        if (this._items.length === 0 || this._items.length >= data.total) return;

        var loadMoreButton = new LoadMoreEntry({
            count: this._items.length,
            searchTerm: data.searchTerm,
            size: [undefined, 80],
            total: data.total
        });

        loadMoreButton.on("loading-more", function() {
            this._model.loadMore();
        }.bind(this));

        this._items.push(loadMoreButton);
    }

    module.exports = Results;
});
