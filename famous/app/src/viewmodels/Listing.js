/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var PageViewModel = require('prototypes/PageViewModel');
    
    /*
     * @name Listing
     * @constructor
     * @description
     */

    function Listing(applicationStateModel) {
        PageViewModel.apply(this, arguments);
    }

    Listing.prototype = Object.create(PageViewModel.prototype);
    Listing.prototype.constructor = Listing;

    module.exports = Listing;
});
