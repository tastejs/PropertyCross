/**
 * @private
 */
Ext.define('Ext.event.recognizer.Drag', {
    extend: 'Ext.event.recognizer.SingleTouch',

    isStarted: false,

    startPoint: null,

    previousPoint: null,

    lastPoint: null,

    handledEvents: ['dragstart', 'drag', 'dragend'],

    config: {
        /**
         * @cfg {Number} minDistance
         * The minimum distance of pixels before a touch event becomes a drag event.
         */
        minDistance: 8
    },

    constructor: function() {
        this.callSuper(arguments);

        this.info = {
            touch: null,
            previous: {
                x: 0,
                y: 0
            },
            x: 0,
            y: 0,
            delta: {
                x: 0,
                y: 0
            },
            absDelta: {
                x: 0,
                y: 0
            },
            flick: {
                velocity: {
                    x: 0,
                    y: 0
                }
            },
            direction: {
                x: 0,
                y: 0
            },
            time: 0,
            previousTime: {
                x: 0,
                y: 0
            }
        };
    },

    onTouchStart: function(e) {
        if (this.callSuper(arguments) === false) {
            if (this.isStarted && this.lastMoveEvent !== null) {
                this.onTouchEnd(this.lastMoveEvent);
            }
            return false;
        }

        this.startTime = e.time;
        this.startPoint = e.changedTouches[0].point;
    },

    tryDragStart: function(e) {
        var startPoint = this.startPoint,
            touches = e.changedTouches,
            touch = touches[0],
            point = touch.point,
            minDistance = this.getMinDistance(),
            info = this.info;

        if (Math.abs(point.getDistanceTo(startPoint)) >= minDistance) {
            this.isStarted = true;

            this.lastPoint = this.previousPoint = this.lastPoint = point;
//            this.startPoint = new Ext.util.LineSegment(startPoint, point).getInBetweenPoint(minDistance);

            this.resetInfo('x', e, touch);
            this.resetInfo('y', e, touch);

            info.time = e.time;

            this.fire('dragstart', e, touches, info);
        }
    },

    onTouchMove: function(e) {
        if (!this.isStarted) {
            this.tryDragStart(e);
        }

        if (!this.isStarted) {
            return;
        }

        var touches = e.changedTouches,
            touch = touches[0],
            point = touch.point;

        if (this.lastPoint) {
            this.previousPoint = this.lastPoint;
        }

        this.lastPoint = point;
        this.lastMoveEvent = e;

        this.updateInfo('x', e, touch, true);
        this.updateInfo('y', e, touch, true);

        this.info.time = e.time;

        this.fire('drag', e, touches, this.info);
    },

    onAxisDragEnd: function(axis, info) {
        var duration = info.time - info.previousTime[axis];

        if (duration > 0) {
            info.flick.velocity[axis] = (info[axis] - info.previous[axis]) / duration;
        }
    },

    resetInfo: function(axis, e, touch) {
        var value = this.lastPoint[axis],
            startValue = this.startPoint[axis],
            delta = value - startValue,
            capAxis = axis.toUpperCase(),
            info = this.info;

        info.touch = touch;

        info.delta[axis] = delta;
        info.absDelta[axis] = Math.abs(delta);

        info.previousTime[axis] = this.startTime;
        info.previous[axis] = startValue;
        info[axis] = value;
        info.direction[axis] = 0;

        info['start' + capAxis] = this.startPoint[axis];
        info['previous' + capAxis] = info.previous[axis];
        info['page' + capAxis] = info[axis];
        info['delta' + capAxis] = info.delta[axis];
        info['absDelta' + capAxis] = info.absDelta[axis];
        info['previousDelta' + capAxis] = 0;
        info.startTime = this.startTime;
    },

    updateInfo: function(axis, e, touch, updatePrevious) {
        var time = e.time,
            value = this.lastPoint[axis],
            previousValue = this.previousPoint[axis],
            startValue = this.startPoint[axis],
            delta = value - startValue,
            info = this.info,
            direction = info.direction,
            capAxis = axis.toUpperCase(),
            previousFlick = info.previous[axis],
            previousDelta;

        info.touch = touch;

        previousDelta = info.delta[axis];
        info.delta[axis] = delta;
        info.absDelta[axis] = Math.abs(delta);

        if (updatePrevious && value !== previousFlick && value !== info[axis] && time - info.previousTime[axis] >= 50) {
            info.previous[axis] = info[axis];
            info.previousTime[axis] = info.time;
        }

        info[axis] = value;

        if (value > previousValue) {
            direction[axis] = 1;
        }
        else if (value < previousValue) {
            direction[axis] = -1;
        }

        info['start' + capAxis] = this.startPoint[axis];
        info['previous' + capAxis] = info.previous[axis];
        info['page' + capAxis] = info[axis];
        info['delta' + capAxis] = info.delta[axis];
        info['absDelta' + capAxis] = info.absDelta[axis];
        info['previousDelta' + capAxis] = previousDelta;
        info.startTime = this.startTime;
    },

    onTouchEnd: function(e) {
        if (!this.isStarted) {
            this.tryDragStart(e);
        }

        if (this.isStarted) {
            var touches = e.changedTouches,
                touch = touches[0],
                point = touch.point,
                info = this.info;

            this.isStarted = false;
            this.lastPoint = point;

            this.updateInfo('x', e, touch);
            this.updateInfo('y', e, touch);

            info.time = e.time;

            this.onAxisDragEnd('x', info);
            this.onAxisDragEnd('y', info);

            this.fire('dragend', e, touches, info);

            this.startPoint = null;
            this.previousPoint = null;
            this.lastPoint = null;
            this.lastMoveEvent = null;
        }
    }
});
