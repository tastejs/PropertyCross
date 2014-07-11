/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var EventHandler = require('famous/core/EventHandler');
    var FamousView = require('famous/core/View');
    var Entity = require('famous/core/Entity');

    /*
     * @name View
     * @constructor
     * @description
     */

    function View() {
        FamousView.apply(this, arguments);
        this.id = Entity.register(this);

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
        this._modelEvents.emit('bound-model', model);
    }

    View.prototype.getModel = function() {
        return this._model;
    }

    View.prototype.render = function render() {
        return this.id;
    };

    View.prototype.commit = function commit(context) {
        var parentSize = context.size;
        var parentTransform = context.transform;
        var parentOpacity = context.opacity;
        var parentOrigin = context.origin;

        var result = [{
            target: this._node.render()
        }];

        return {
            transform: parentTransform,
            size: parentSize,
            opacity: parentOpacity,
            target: result
        };
    };

    module.exports = View;
});
