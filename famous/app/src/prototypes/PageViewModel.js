/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var ViewModel = require('prototypes/ViewModel');

    /*
     * @name PageViewModel
     * @constructor
     * @description
     */

    function PageViewModel(applicationStateModel) {
        ViewModel.apply(this, arguments);

        this._applicationState = applicationStateModel;
    }

    PageViewModel.prototype = Object.create(ViewModel.prototype);
    PageViewModel.prototype.constructor = PageViewModel;

    PageViewModel.prototype.getTitle = function() {
        return this._title;
    }

    module.exports = PageViewModel;
});
