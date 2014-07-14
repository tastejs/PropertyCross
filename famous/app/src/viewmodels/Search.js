/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var PageViewModel = require('prototypes/PageViewModel');

    var PropertySearch    = require('models/PropertySearch');
    var Geolocation       = require('models/Geolocation');
    var RecentSearchStore = require('models/RecentSearchStore');
    
    /*
     * @name Search
     * @constructor
     * @description
     */

    function Search(applicationStateModel) {
        PageViewModel.apply(this, arguments);

        this._title = "PropertyCross";

        RecentSearchStore.on("changed-recentsearches", function(recentSearches) {
            this._eventOutput.emit("update-recentsearches", recentSearches);
        }.bind(this));
    }

    Search.prototype = Object.create(PageViewModel.prototype);
    Search.prototype.constructor = Search;

    Search.prototype.performTextSearch = function(text) {
        _beforeSearch.call(this);

        PropertySearch.textBasedSearch(text).then(
            _onSuccessfulPropertySearch.bind(this),
            _onFailedPropertySearch.bind(this)).done();
    };

    Search.prototype.performGeoSearch = function() {
        _beforeSearch.call(this);

        Geolocation.getCurrentPosition().then(function(location) {
            PropertySearch.coordinateBasedSearch(
                location.latitude, location.longitude).then(
                _onSuccessfulPropertySearch.bind(this),
                _onFailedPropertySearch.bind(this)).done();
        }.bind(this), function(error) {
            this._eventOutput.emit("show-message", {
                message: error
            });
        }.bind(this));
    };

    Search.prototype.performRecentSearch = function(query) {
        _beforeSearch.call(this);

        PropertySearch.queryProperties(query, 1).then(
            _onSuccessfulPropertySearch.bind(this),
            _onFailedPropertySearch.bind(this)).done();
    };

    Search.prototype.performLocationSearch = function(query) {
        _beforeSearch.call(this);

        PropertySearch.queryProperties(query, 1).then(
            _onSuccessfulPropertySearch.bind(this),
            _onFailedPropertySearch.bind(this)).done();
    };

    Search.prototype.goToFavourites = function() {
        this._applicationState.navigateToState('favourites', {});
    };

    Search.prototype.recentSearches = function() {
        return RecentSearchStore.query();
    };

    function _beforeSearch() {
        this._eventOutput.emit("show-recentsearch");
    }

    function _onSuccessfulPropertySearch(searchResult) {
        if(searchResult.state === "unambiguous") {
            var search = {
                query: searchResult.location.place_name,
                title: searchResult.location.title,
                total: searchResult.total
            };

            if(search.total === null) {
                this._eventOutput.emit("show-message", {
                    message: "There were no properties found for the given location."
                });
            } else {
            RecentSearchStore.store(search);

            this._applicationState.navigateToState('results', search);
            }
        } else if(searchResult.state === "ambiguous") {
            this._eventOutput.emit("show-locations", searchResult.locations);
        } else {
            this._eventOutput.emit("show-message", {
                message: "The location given was not recognised."
            });
        }
    }

    function _onFailedPropertySearch(searchResult) {
        this._eventOutput.emit("show-message", {
            message: "An error occurred while searching. " +
            "Please check your network connection and try again."
        });
    }

    module.exports = Search;
});
