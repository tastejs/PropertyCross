/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var PageViewModel = require('prototypes/PageViewModel');
    
    /*
     * @name Search
     * @constructor
     * @description
     */

    function Search(applicationStateModel) {
        PageViewModel.apply(this, arguments);
    }

    Search.prototype = Object.create(PageViewModel.prototype);
    Search.prototype.constructor = Search;

    Search.prototype.performTextSearch = function(text) {
        console.log('Perform Text Search');
        this._applicationState.navigateToState('results', {});
    }

    Search.prototype.performGeoSearch = function() {
        console.log('Perform Geo Search');
        this._applicationState.navigateToState('listing', {});
    }

    module.exports = Search;
});
