
define(function(require, exports, module) {
    'use strict';
    var StateModifier = require('famous/modifiers/StateModifier');
    var Surface       = require('famous/core/Surface');

    var View          = require('prototypes/View');

    function ApplicationHeader() {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createBackground.call(this);

    }

    ApplicationHeader.prototype = Object.create(View.prototype);
    ApplicationHeader.prototype.constructor = ApplicationHeader;

    ApplicationHeader.DEFAULT_OPTIONS = {
        headerSize: 50,
        backgroundColor: 'white',
        color: 'black'
    };

    function _createLayout() {
        this.layoutNode = this.add(new StateModifier({
            size: [undefined, this.options.headerSize]
        }));
    }

    function _createBackground() {

        var surface = new Surface({
            content: 'PropertyCross',
            properties: {
                backgroundColor: this.options.backgroundColor,
                color: this.options.color,
                fontSize: '20px',
                lineHeight: this.options.headerSize + 'px',
                textAlign: 'center'
            }
        });
        
        this.layoutNode.add(surface);
    }

    module.exports = ApplicationHeader;
});
