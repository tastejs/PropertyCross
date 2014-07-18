
define(function(require, exports, module) {
    'use strict';
    var StateModifier = require('famous/modifiers/StateModifier');
    var Surface    = require('famous/core/Surface');
    var Transform  = require('famous/core/Transform');

    var MarginLayout = require('layouts/MarginLayout');

    var View         = require('famous/core/View');

    function RecentSearchEntry() {
        View.apply(this, arguments);

        var modifier = new StateModifier({
            size: this.options.size
        });

        this.node = this.add(modifier);

        _createBacking.call(this);
        _createTitle.call(this);
        _createCount.call(this);
    }

    RecentSearchEntry.prototype = Object.create(View.prototype);
    RecentSearchEntry.prototype.constructor = RecentSearchEntry;

    RecentSearchEntry.DEFAULT_OPTIONS = {
        count: 0,
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

        var eventHandler = this._eventOutput;

        surface.on('click', function() {
            eventHandler.emit('select-recentsearch', {
                query: this.options.query,
                title: this.options.title,
                count: this.options.count
            });
        }.bind(this));
    }

    function _createTitle() {
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

        var layout = new MarginLayout({
            margins: [10, 10, 60, 10]
        });

        layout.add(title);
        this.node.add(layout);
    }

    function _createCount() {
        var title = new Surface({
            content: this.options.count,
            size: [undefined, 20],
            properties: {
                color: '#888',
                fontSize: '14px',
                lineHeight: '20px',
                overflow: 'hidden',
                pointerEvents: 'none',
                textAlign: 'center',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }
        });

        var layout = new StateModifier({
            size: [40, 20],
            origin: [1, 0.5],
            transform: Transform.translate(-10, 0, 0)
        });

        this.node.add(layout).add(title);
    }

    module.exports = RecentSearchEntry;
});
