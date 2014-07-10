/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var PropertyStore = require('models/PropertyStore');

    var PageViewModel = require('prototypes/PageViewModel');

    /*
     * @name ListingDetails
     * @constructor
     * @description
     */

    function ListingDetails(applicationStateModel, state) {
        PageViewModel.apply(this, arguments);

        this._listing = PropertyStore.load(state.guid);
    }

    ListingDetails.prototype = Object.create(PageViewModel.prototype);
    ListingDetails.prototype.constructor = ListingDetails;

    ListingDetails.prototype.listing = function() {
        return this._listing;
    };

    module.exports = ListingDetails;
});
