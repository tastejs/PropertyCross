/**
 * @private
 * Touch event.
 */
Ext.define('Ext.event.Touch', {
    extend: 'Ext.event.Dom',

    requires: [
        'Ext.util.Point'
    ],

    constructor: function(event, info, map, list) {
        var touches = [],
            touch, i, ln, identifier;

        if (info) {
            this.set(info);
        }

        this.changedTouches = this.cloneTouches(event.changedTouches, map);

        for (i = 0, ln = list.length; i < ln; i++) {
            identifier = list[i];
            touches.push(map[identifier]);
        }

        this.touches = touches;
        this.targetTouches = touches.slice();

        touch = this.changedTouches[0];

        this.callSuper([event]);

        this.target = this.delegatedTarget = touch.target;
        this.pageX = touch.pageX;
        this.pageY = touch.pageY;
    },

    cloneTouches: function(touches, map) {
        var clonedTouches = [],
            i, ln, touch, identifier;

        for (i = 0,ln = touches.length; i < ln; i++) {
            touch = touches[i];
            identifier = touch.identifier;
            clonedTouches[i] = map[identifier];
        }

        return clonedTouches;
    }
});
