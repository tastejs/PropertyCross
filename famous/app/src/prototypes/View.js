/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var EventHandler = require('famous/core/EventHandler');
    var FamousView = require('famous/core/View');

    /*
     * @name View
     * @constructor
     * @description
     */

    function View() {
        FamousView.apply(this, arguments);

        this._modelEvents = new EventHandler();

        this._model = undefined;
    }

    View.prototype = Object.create(FamousView.prototype);
    View.prototype.constructor = View;

    View.DEFAULT_OPTIONS = {
    };

    View.prototype.bindToModel = function(model) {
        this._model = model;
        this._modelEvents.subscribe(model);
        this._modelEvents.emit('model-bound', model);
    }

    module.exports = View;
});
