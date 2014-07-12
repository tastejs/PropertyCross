/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var Easing        = require('famous/transitions/Easing');
    var Flipper       = require('famous/views/Flipper');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Surface       = require('famous/core/Surface');
    var View          = require('famous/core/View');

    var _filledStar = '\u2605';
    var _hollowStar = '\u2606';

    function FavouriteButton() {
        View.apply(this, arguments);

        _createButton.call(this);
        _createAnimator.call(this);
    }

    FavouriteButton.prototype = Object.create(View.prototype);
    FavouriteButton.prototype.constructor = FavouriteButton;

    FavouriteButton.DEFAULT_OPTIONS = {
        backgroundColor: '#b8f',
        color: '#555',
        size: 40
    };

    FavouriteButton.prototype.setFavourite = function(value) {
        if(this._flipper.flipped !== value) {
            this._flipper.flip({ duration: 0 });
        }
    }

    function _createButton() {
        var diameter = this.options.size;
        var radius = Math.round(diameter);
        var fontSize = Math.round(3 * diameter / 4);

        var defaultProperties = {
            backgroundColor: this.options.backgroundColor,
            borderRadius: radius + 'px',
            color: this.options.color,
            cursor: 'default',
            fontSize: fontSize + 'px',
            lineHeight: diameter + 'px',
            textAlign: 'center'
        };

        var favouriteButton = new Surface({
            content: _filledStar,
            size: [diameter, diameter],
            properties: defaultProperties
        });

        var unfavouriteButton = new Surface({
            content: _hollowStar,
            size: [diameter, diameter],
            properties: defaultProperties
        });

        this._buttons = {
            favourite: favouriteButton,
            unfavourite: unfavouriteButton
        };

        this._buttons.favourite.on("click", _buttonClicked.bind(this));
        this._buttons.unfavourite.on("click", _buttonClicked.bind(this));
    }

    function _createAnimator() {
        this._flipper = new Flipper({
            direction: Flipper.DIRECTION_Y
        });

        this._flipper.setBack(this._buttons.favourite);
        this._flipper.setFront(this._buttons.unfavourite);
        
        this.add(new StateModifier({
            origin: [0.5, 0.5]
        })).add(this._flipper);
    }

    function _buttonClicked(event) {
        this._flipper.flip({
            curve: Easing.outBounce,
            duration: 1000
        });
        this._eventOutput.emit("click", event);
    }

    module.exports = FavouriteButton;
});
