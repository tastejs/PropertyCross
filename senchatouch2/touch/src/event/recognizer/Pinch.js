/**
 * A event recognizer which knows when you pinch.
 *
 * @private
 */
Ext.define('Ext.event.recognizer.Pinch', {
    extend: 'Ext.event.recognizer.MultiTouch',

    requiredTouchesCount: 2,

    handledEvents: ['pinchstart', 'pinch', 'pinchend'],

    /**
     * @member Ext.dom.Element
     * @event pinchstart
     * Fired once when a pinch has started.
     * @param {Ext.event.Event} event The {@link Ext.event.Event} event encapsulating the DOM event.
     * @param {HTMLElement} node The target of the event.
     * @param {Object} options The options object passed to Ext.mixin.Observable.addListener.
     */

    /**
     * @member Ext.dom.Element
     * @event pinch
     * Fires continuously when there is pinching (the touch must move for this to be fired).
     * @param {Ext.event.Event} event The {@link Ext.event.Event} event encapsulating the DOM event.
     * @param {HTMLElement} node The target of the event.
     * @param {Object} options The options object passed to Ext.mixin.Observable.addListener.
     */

    /**
     * @member Ext.dom.Element
     * @event pinchend
     * Fires when a pinch has ended.
     * @param {Ext.event.Event} event The {@link Ext.event.Event} event encapsulating the DOM event.
     * @param {HTMLElement} node The target of the event.
     * @param {Object} options The options object passed to Ext.mixin.Observable.addListener.
     */

    /**
     * @property {Number} scale
     * The scape of a pinch event.
     *
     * **This is only available when the event type is `pinch`**
     * @member Ext.event.Event
     */

    startDistance: 0,

    lastTouches: null,

    onTouchMove: function(e) {
        if (!this.isTracking) {
            return;
        }

        var touches = Array.prototype.slice.call(e.touches),
            firstPoint, secondPoint, distance;

        firstPoint = touches[0].point;
        secondPoint = touches[1].point;

        distance = firstPoint.getDistanceTo(secondPoint);

        if (distance === 0) {
            return;
        }

        if (!this.isStarted) {

            this.isStarted = true;

            this.startDistance = distance;

            this.fire('pinchstart', e, touches, {
                touches: touches,
                distance: distance,
                scale: 1
            });
        }
        else {
            this.fire('pinch', e, touches, {
                touches: touches,
                distance: distance,
                scale: distance / this.startDistance
            });
        }

        this.lastTouches = touches;
    },

    fireEnd: function(e) {
        this.fire('pinchend', e, this.lastTouches);
    },

    fail: function() {
        return this.callParent(arguments);
    }
});