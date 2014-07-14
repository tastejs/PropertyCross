
define(function(require, exports, module) {
    'use strict';
    var StateModifier = require('famous/modifiers/StateModifier');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');

    var MarginLayout = require('layouts/MarginLayout');

    var View         = require('famous/core/View');

    function LocationEntry() {
        View.apply(this, arguments);

        var modifier = new StateModifier({
            size: this.options.size
        });

        this.node = this.add(modifier);
        this._loading = false;

        _createBacking.call(this);
        _createTitle.call(this);
    }

    LocationEntry.prototype = Object.create(View.prototype);
    LocationEntry.prototype.constructor = LocationEntry;

    LocationEntry.DEFAULT_OPTIONS = {
        query: 'query',
        size: [undefined, undefined],
        title: 'title'
    };

    function _createBacking() {
        var surface = new Surface({
            properties: {
                borderBottom: '1px solid #DDD'
            }
        });
        this.node.add(surface);

        var self = this;
        var eventHandler = this._eventOutput;

        surface.on('click', function(event) {
            eventHandler.emit('select-location', {
                query: self.options.query,
                title: self.options.title
            });
        });
    }

    function _createTitle() {

        var layout = new MarginLayout({
            margins: [10, 10, 10, 10]
        });

        var title = new Surface({
            content: this.options.title,
            size: [undefined, 20],
            properties: {
                fontSize: '16px',
                lineHeight: '20px',
                overflow: 'hidden',
                pointerEvents: 'none',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }
        });

        layout.add(title);

        this.node.add(layout);
    }

    module.exports = LocationEntry;
});
