/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var EventHandler = require('famous/core/EventHandler');

    /*
     * @name ViewModel
     * @constructor
     * @description
     */

    function ViewModel() {
        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    module.exports = ViewModel;
});
