/**
 * A simple event recogniser which knows when you double tap.
 *
 * @private
 */
Ext.define('Ext.event.recognizer.DoubleTap', {

    extend: 'Ext.event.recognizer.SingleTouch',

    config: {
        maxDuration: 300
    },

    handledEvents: ['singletap', 'doubletap'],

    /**
     * @member Ext.dom.Element
     * @event singletap
     * Fires when there is a single tap.
     * @param {Ext.event.Event} event The {@link Ext.event.Event} event encapsulating the DOM event.
     * @param {HTMLElement} node The target of the event.
     * @param {Object} options The options object passed to Ext.mixin.Observable.addListener.
     */

    /**
     * @member Ext.dom.Element
     * @event doubletap
     * Fires when there is a double tap.
     * @param {Ext.event.Event} event The {@link Ext.event.Event} event encapsulating the DOM event.
     * @param {HTMLElement} node The target of the event.
     * @param {Object} options The options object passed to Ext.mixin.Observable.addListener.
     */

    singleTapTimer: null,

    onTouchStart: function(e) {
        if (this.callParent(arguments) === false) {
            return false;
        }

        this.startTime = e.time;
        clearTimeout(this.singleTapTimer);
    },

    onTouchMove: function() {
        return this.fail(this.self.TOUCH_MOVED);
    },

    onEnd: function(e) {
        var me = this,
            maxDuration = this.getMaxDuration(),
            touch = e.changedTouches[0],
            time = e.time,
            lastTapTime = this.lastTapTime,
            duration;

        this.lastTapTime = time;

        if (lastTapTime) {
            duration = time - lastTapTime;

            if (duration <= maxDuration) {
                this.lastTapTime = 0;

                this.fire('doubletap', e, [touch], {
                    touch: touch,
                    duration: duration
                });

                return;
            }
        }

        if (time - this.startTime > maxDuration) {
            this.fireSingleTap(e, touch);
        }
        else {
            this.singleTapTimer = setTimeout(function() {
                me.fireSingleTap(e, touch);
            }, maxDuration);
        }
    },

    fireSingleTap: function(e, touch) {
        this.fire('singletap', e, [touch], {
            touch: touch
        });
    }
});
