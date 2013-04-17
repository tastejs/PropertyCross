/**
 * A simple event recogniser which knows when you tap.
 *
 * @private
 */
Ext.define('Ext.event.recognizer.Tap', {
    extend: 'Ext.event.recognizer.SingleTouch',

    handledEvents: ['tap', 'tapcancel'],

    config: {
        /**
         * @cfg {Number} moveDistance
         * The maximimum distance in pixels a touchstart event can travel and still be considered a tap event.
         */

        moveDistance: 8
    },

    onTouchStart: function(e) {
        if (this.callSuper(arguments) === false) {
            return false;
        }

        this.startPoint = e.changedTouches[0].point;
    },

    onTouchMove: function(e) {
        var touch = e.changedTouches[0],
            point = touch.point;

        if (Math.abs(point.getDistanceTo(this.startPoint)) >= this.getMoveDistance()) {
            this.fire('tapcancel', e, [touch], {
                touch: touch
            });
            return this.fail(this.self.TOUCH_MOVED);
        }
    },

    onTouchEnd: function(e) {
        var touch = e.changedTouches[0];

        this.fire('tap', e, [touch], {
            touch: touch
        });
    }
});