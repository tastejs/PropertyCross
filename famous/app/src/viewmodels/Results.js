/*globals define*/
define(function(require, exports, module) {
    'use strict';

    var PageViewModel = require('prototypes/PageViewModel');
    var PropertySearch = require('models/PropertySearch');
    
    /*
     * @name Results
     * @constructor
     * @description
     */

    function Results(applicationStateModel, state) {
        PageViewModel.apply(this, arguments);

        this._listings = [];
        this._query = state.query;
        this._searchTerm = state.title;
        this._page = 1;

        this.loadMore();
    }

    Results.prototype = Object.create(PageViewModel.prototype);
    Results.prototype.constructor = Results;

    Results.prototype.listings = function() {
        return this._listings;
    };

    Results.prototype.searchTerm = function() {
        return this._searchTerm;
    };

    Results.prototype.displayListing = function(listingGuid) {
        this._applicationState.navigateToState('listing', {
            guid: listingGuid
        });
    };

    Results.prototype.loadMore = function() {
        PropertySearch.queryProperties(this._query, this._page).then(
            _processQueryResults.bind(this),
            _processQueryResults.bind(this)).done();
        this._page += 1;
    };

    function _processQueryResults(queryResults) {
        queryResults.listings.forEach(function(item) {
            this._listings.push(item);
        }, this);

        console.log("this._listings", this._listings);
        this._title = this._listings.length + " of " + queryResults.total + " matches";
        this._applicationState.updateHeading();

        this._eventOutput.emit("update-listing", {
            searchTerm: this._searchTerm,
            listings: this._listings,
            total: queryResults.total
        });
    }

    module.exports = Results;
});
