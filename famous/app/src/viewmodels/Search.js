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

        var placeName = 'Bristol';

        this._applicationState.navigateToState('results', {
            query: placeName
        });
    }

    Search.prototype.performGeoSearch = function() {
        console.log('Perform Geo Search');

        var location = 'Loc_2.232_-34.33';
        
        this._applicationState.navigateToState('results', {
            query: location
        });
    }

    module.exports = Search;
});
