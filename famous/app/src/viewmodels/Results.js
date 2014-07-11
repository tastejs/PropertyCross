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

        PropertySearch.queryProperties(state.query, 1).then(
            _processQueryResults.bind(this),
            _processQueryResults.bind(this)).done();
    }

    Results.prototype = Object.create(PageViewModel.prototype);
    Results.prototype.constructor = Results;

    Results.prototype.listings = function() {
        return this._listings;
    };

    Results.prototype.displayListing = function(listingGuid) {
        this._applicationState.navigateToState('listing', {
            guid: listingGuid
        });
    };

    function _processQueryResults(queryResults) {
        queryResults.listings.forEach(function(item) {
            this.push(item);
        }, this._listings);

        this._title = this._listings.length + " of " + queryResults.total + " matches";
        this._applicationState.updateHeading();

        this._eventOutput.emit("update-listing", this._listings);
    }

    module.exports = Results;
});
