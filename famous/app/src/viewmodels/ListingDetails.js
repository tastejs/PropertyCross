/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var PropertyStore = require('models/PropertyStore');
    var FavouritesStore = require('models/FavouritesStore');

    var PageViewModel = require('prototypes/PageViewModel');

    /*
     * @name ListingDetails
     * @constructor
     * @description
     */

    function ListingDetails(applicationStateModel, state) {
        PageViewModel.apply(this, arguments);

        this._title = 'Property Details';

        this._listing = PropertyStore.load(state.guid);
        this._isFavourite = !!FavouritesStore.load(state.guid);
    }

    ListingDetails.prototype = Object.create(PageViewModel.prototype);
    ListingDetails.prototype.constructor = ListingDetails;

    ListingDetails.prototype.listing = function() {
        return this._listing;
    };
    ListingDetails.prototype.isFavourite = function() {
        return this._isFavourite;
    };

    ListingDetails.prototype.toggleFavourites = function() {
        this._isFavourite = !this._isFavourite;
        if (this._isFavourite) {
            FavouritesStore.store(this._listing);
        }
        else {
            FavouritesStore.remove(this._listing);
        }
    };

    module.exports = ListingDetails;
});
