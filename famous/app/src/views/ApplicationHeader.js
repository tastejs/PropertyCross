
define(function(require, exports, module) {
    'use strict';
    var StateModifier = require('famous/modifiers/StateModifier');
    var Surface       = require('famous/core/Surface');

    var View             = require('prototypes/View');
    var VisibilityLayout = require('layouts/VisibilityLayout');

    function ApplicationHeader() {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createBackground.call(this);
        _createBackButton.call(this);

        this._modelEvents.on('update-ui', _updateUI.bind(this));
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

        this._title = new Surface({
            properties: {
                backgroundColor: this.options.backgroundColor,
                color: this.options.color,
                fontSize: '20px',
                lineHeight: this.options.headerSize + 'px',
                textAlign: 'center'
            }
        });
        
        this.layoutNode.add(this._title);
    }

    function _createBackButton() {
        
        this.backButton = new Surface({
            content: 'Back',
            size: [60, undefined],
            properties: {
                backgroundColor: this.options.backgroundColor,
                color: this.options.color,
                lineHeight: this.options.headerSize + 'px',
                textAlign: 'center'
            }
        });

        var self = this;
        this.backButton.on("click", function() {
            self._model.goBack();
        });

        this.buttonModifier = new VisibilityLayout();
        this.buttonModifier.add(this.backButton);

        this.layoutNode.add(this.buttonModifier);
    }

    function _updateUI(data) {
        this._title.setContent(data.title || "");
        data.canGoBack ? this.buttonModifier.show() : this.buttonModifier.hide();
    }

    module.exports = ApplicationHeader;
});
