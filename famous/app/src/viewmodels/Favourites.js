/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var PageViewModel = require('prototypes/PageViewModel');
    
    /*
     * @name Favourites
     * @constructor
     * @description
     */

    function Favourites(applicationStateModel) {
        PageViewModel.apply(this, arguments);
    }

    Favourites.prototype = Object.create(PageViewModel.prototype);
    Favourites.prototype.constructor = Favourites;

    module.exports = Favourites;
});
