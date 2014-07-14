/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var PageViewModel = require('prototypes/PageViewModel');

    var PropertySearch = require('models/PropertySearch');
    var Geolocation    = require('models/Geolocation');
    
    /*
     * @name Search
     * @constructor
     * @description
     */

    function Search(applicationStateModel) {
        PageViewModel.apply(this, arguments);

        this._title = "PropertyCross";
    }

    Search.prototype = Object.create(PageViewModel.prototype);
    Search.prototype.constructor = Search;

    Search.prototype.performTextSearch = function(text) {
        PropertySearch.textBasedSearch(text).then(
            _onSuccessfulPropertySearch.bind(this),
            _onFailedPropertySearch.bind(this)).done();
    };

    Search.prototype.performGeoSearch = function() {
        Geolocation.getCurrentPosition().then(function(location) {
            PropertySearch.coordinateBasedSearch(
                location.latitude, location.longitude).then(
                _onSuccessfulPropertySearch.bind(this),
                _onFailedPropertySearch.bind(this)).done();
        }.bind(this));
    };

    Search.prototype.goToFavourites = function() {
        this._applicationState.navigateToState('favourites', {});
    }

    function _onSuccessfulPropertySearch(searchResult) {
        if(searchResult.state === "unambiguous") {
            this._applicationState.navigateToState('results', {
                query: searchResult.location.place_name,
                title: searchResult.location.title
            });
        } else if(searchResult.state === "ambiguous") {
            console.log("ambiguous result");
        }
    }

    function _onFailedPropertySearch(searchResult) {
        console.log('fail search', searchResult);
    }

    module.exports = Search;
});
