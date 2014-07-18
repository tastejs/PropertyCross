
define(function(require, exports, module) {
    'use strict';
    var Modifier         = require('famous/core/Modifier');
    var RenderNode       = require('famous/core/RenderNode');
    var SequentialLayout = require('famous/views/SequentialLayout');
    var StateModifier    = require('famous/modifiers/StateModifier');
    var Surface          = require('famous/core/Surface');
    var Transform        = require('famous/core/Transform');
    var Transitionable   = require('famous/transitions/Transitionable');

    var MarginLayout = require('layouts/MarginLayout');
    var View         = require('prototypes/View');

    function ErrorNotifier() {
        View.apply(this, arguments);

        _createLayout.call(this);

        this._modelEvents.on('display-user-notification', _displayUserNotification.bind(this));
    }

    ErrorNotifier.prototype = Object.create(View.prototype);
    ErrorNotifier.prototype.constructor = ErrorNotifier;

    ErrorNotifier.DEFAULT_OPTIONS = {
        backgroundColor: 'rgba(66, 66, 66, 0.80)',
        borderRadius: '10px',
        titleColor: 'white',
        detailsColor: '#d8d8d8',
        displayDuration: 5000,
        transitionDuration: 500,
        size: [undefined, 30]
    };

    function _createLayout() {
        var layout = new SequentialLayout({
            direction: 1
        });

        this._surfaces = [];

        layout.sequenceFrom(this._surfaces);

        var modifier = new StateModifier({ origin: [0.5, 1] });
        this.add(modifier).add(layout);
    }

    function _createUserNotificationNode() {
        var state = new Transitionable(0);

        var modifier = new Modifier({
            opacity:   _notificationOpacity.bind(this, state),
            origin:    [0.5, 0],
            size:      _notificationSize.bind(this, state),
            transform: _notificationTranformations.bind(this, state)
        });

        var node = new RenderNode();

        var enterLeaveTransition = {
            duration: this.options.transitionDuration,
            curve: 'easeInOut'
        };

        state.set(1, enterLeaveTransition)
            .set(1, {
                duration: this.options.displayDuration
            })
            .set(0, enterLeaveTransition, _destroyNotification.bind(this, node));

        this._surfaces.unshift(node);

        return node.add(modifier);

    }

    function _displayUserNotification(data) {
        var node = _createUserNotificationNode.call(this);

        var background = new Surface({
            size: this.options.size,
            properties: {
                backgroundColor: this.options.backgroundColor,
                borderRadius: this.options.borderRadius
            }
        });
        node.add(background);

        var contentNode = node.add(new StateModifier({
            transform: Transform.translate(0, 0, 1)
        }));

        var title = new Surface({
            content: data.title,
            properties: {
                color: this.options.titleColor,
                fontSize: '14px',
                lineHeight: this.options.size[1] + 'px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }
        });

        var details = new Surface({
            content: data.details,
            properties: {
                color: this.options.detailsColor,
                fontSize: '12px',
                lineHeight: this.options.size[1] + 'px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }
        });

        var modifiers = {
            title: new StateModifier({
                size: [150, undefined],
                transform: Transform.translate(0, 0, 1)
            }),
            details: new StateModifier({
                transform: Transform.translate(0, 0, 1)
            })
        };

        var margins = {
            title: new MarginLayout({
                margins: [10, 0, 0, 0]
            }),
            details: new MarginLayout({
                margins: [160, 0, 0, 0]
            })
        };
        margins.title.add(title);
        margins.details.add(details);

        contentNode.add(modifiers.title).add(margins.title);
        contentNode.add(modifiers.details).add(margins.details);
    }

    function _notificationSize(state) {
        return [undefined, this.options.size[1] * state.get() + 1];
    }

    function _notificationOpacity(state) {
        return state.get();
    }

    function _notificationTranformations(state) {
        var scaleFactor = 0.9 + 0.1 * state.get();
        var scale = Transform.scale(scaleFactor, scaleFactor, 1);

        return Transform.thenMove(scale, [0, 0, 10]);
    }

    function _destroyNotification(item) {
        var index = this._surfaces.indexOf(item);

        if (index > -1) {
            this._surfaces.splice(index, 1);
        }
    }

    module.exports = ErrorNotifier;
});
