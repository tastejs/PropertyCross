/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var PageViewModel = require('prototypes/PageViewModel');
    
    /*
     * @name Results
     * @constructor
     * @description
     */

    function Results(applicationStateModel) {
        PageViewModel.apply(this, arguments);
    }

    Results.prototype = Object.create(PageViewModel.prototype);
    Results.prototype.constructor = Results;

    module.exports = Results;
});
