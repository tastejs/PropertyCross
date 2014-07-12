/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var PageViewModel  = require('prototypes/PageViewModel');
    var FavouritesStore = require('models/FavouritesStore');
    
    /*
     * @name Favourites
     * @constructor
     * @description
     */

    function Favourites(applicationStateModel) {
        PageViewModel.apply(this, arguments);
        
        this._title = "Favourites";

        this._listings = FavouritesStore.query();

        FavouritesStore.on("changed-favourites", _favouritesChanged.bind(this));
    }

    Favourites.prototype = Object.create(PageViewModel.prototype);
    Favourites.prototype.constructor = Favourites;

    Favourites.prototype.listings = function() {
        return this._listings;
    };

    Favourites.prototype.displayListing = function(listingGuid) {
        this._applicationState.navigateToState('listing', {
            guid: listingGuid
        });
    };

    function _favouritesChanged(favourites) {
        this._listings = favourites;

        this._eventOutput.emit("update-listing", this._listings);
    }

    module.exports = Favourites;
});
