(function() {
    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'],
        ln = vendors.length,
        i, vendor, method;

    for (i = 0; i < ln && !window.requestAnimationFrame; ++i) {
        vendor = vendors[i];
        window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendor + 'CancelAnimationFrame'] || window[vendor + 'CancelRequestAnimationFrame'];
    }

    if (!window.Ext) {
        window.Ext = {};
    }
    Ext.performance = {};

    if (window.performance && window.performance.now) {
        Ext.performance.now = function() {
            return window.performance.now();
        }
    }
    else {
        Ext.performance.now = function() {
            return Date.now();
        }
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = Ext.performance.now(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    else {
        Ext.trueRequestAnimationFrames = true;
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());

(function(global) {

/**
 * @private
 */
Ext.define('Ext.AnimationQueue', {
    singleton: true,

    constructor: function() {
        var bind = Ext.Function.bind;

        this.queue = [];
        this.taskQueue = [];
        this.runningQueue = [];
        this.idleQueue = [];
        this.isRunning = false;
        this.isIdle = true;

        this.run = bind(this.run, this);
        this.whenIdle = bind(this.whenIdle, this);
        this.processIdleQueueItem = bind(this.processIdleQueueItem, this);
        this.processTaskQueueItem = bind(this.processTaskQueueItem, this);
    },

    /**
     *
     * @param fn
     * @param [scope]
     * @param [args]
     */
    start: function(fn, scope, args) {
        this.queue.push(arguments);

        if (!this.isRunning) {
            if (this.hasOwnProperty('idleTimer')) {
                clearTimeout(this.idleTimer);
                delete this.idleTimer;
            }

            if (this.hasOwnProperty('idleQueueTimer')) {
                clearTimeout(this.idleQueueTimer);
                delete this.idleQueueTimer;
            }

            this.isIdle = false;
            this.isRunning = true;
            //<debug>
            this.startCountTime = Ext.performance.now();
            this.count = 0;
            //</debug>
            this.doStart();
        }
    },

    run: function() {
        if (!this.isRunning) {
            return;
        }

        var queue = this.runningQueue,
            i, ln;

        this.frameStartTime = Ext.performance.now();

        queue.push.apply(queue, this.queue);

        for (i = 0, ln = queue.length; i < ln; i++) {
            this.invoke(queue[i]);
        }

        queue.length = 0;

        //<debug>
        var now = this.frameStartTime,
            startCountTime = this.startCountTime,
            elapse = now - startCountTime,
            count = ++this.count;

        if (elapse >= 200) {
            this.onFpsChanged(count * 1000 / elapse, count, elapse);
            this.startCountTime = now;
            this.count = 0;
        }
        //</debug>

        this.doIterate();
    },

    //<debug>
    onFpsChanged: Ext.emptyFn,

    onStop: Ext.emptyFn,
    //</debug>

    doStart: function() {
        this.animationFrameId = requestAnimationFrame(this.run);
    },

    doIterate: function() {
        this.animationFrameId = requestAnimationFrame(this.run);
    },

    doStop: function() {
        cancelAnimationFrame(this.animationFrameId);
    },

    /**
     *
     * @param fn
     * @param [scope]
     * @param [args]
     */
    stop: function(fn, scope, args) {
        if (!this.isRunning) {
            return;
        }

        var queue = this.queue,
            ln = queue.length,
            i, item;

        for (i = 0; i < ln; i++) {
            item = queue[i];
            if (item[0] === fn && item[1] === scope && item[2] === args) {
                queue.splice(i, 1);
                i--;
                ln--;
            }
        }

        if (ln === 0) {
            this.doStop();
            //<debug>
            this.onStop();
            //</debug>
            this.isRunning = false;

            this.idleTimer = setTimeout(this.whenIdle, 100);
        }
    },

    onIdle: function(fn, scope, args) {
        var listeners = this.idleQueue,
            i, ln, listener;

        for (i = 0, ln = listeners.length; i < ln; i++) {
            listener = listeners[i];
            if (fn === listener[0] && scope === listener[1] && args === listener[2]) {
                return;
            }
        }

        listeners.push(arguments);

        if (this.isIdle) {
            this.processIdleQueue();
        }
    },

    unIdle: function(fn, scope, args) {
        var listeners = this.idleQueue,
            i, ln, listener;

        for (i = 0, ln = listeners.length; i < ln; i++) {
            listener = listeners[i];
            if (fn === listener[0] && scope === listener[1] && args === listener[2]) {
                listeners.splice(i, 1);
                return true;
            }
        }

        return false;
    },

    queueTask: function(fn, scope, args) {
        this.taskQueue.push(arguments);
        this.processTaskQueue();
    },

    dequeueTask: function(fn, scope, args) {
        var listeners = this.taskQueue,
            i, ln, listener;

        for (i = 0, ln = listeners.length; i < ln; i++) {
            listener = listeners[i];
            if (fn === listener[0] && scope === listener[1] && args === listener[2]) {
                listeners.splice(i, 1);
                i--;
                ln--;
            }
        }
    },

    invoke: function(listener) {
        var fn = listener[0],
            scope = listener[1],
            args = listener[2];

        fn = (typeof fn == 'string' ? scope[fn] : fn);

        if (Ext.isArray(args)) {
            fn.apply(scope, args);
        }
        else {
            fn.call(scope, args);
        }
    },

    whenIdle: function() {
        this.isIdle = true;
        this.processIdleQueue();
    },

    processIdleQueue: function() {
        if (!this.hasOwnProperty('idleQueueTimer')) {
            this.idleQueueTimer = setTimeout(this.processIdleQueueItem, 1);
        }
    },

    processIdleQueueItem: function() {
        delete this.idleQueueTimer;

        if (!this.isIdle) {
            return;
        }

        var listeners = this.idleQueue,
            listener;

        if (listeners.length > 0) {
            listener = listeners.shift();
            this.invoke(listener);
            this.processIdleQueue();
        }
    },

    processTaskQueue: function() {
        if (!this.hasOwnProperty('taskQueueTimer')) {
            this.taskQueueTimer = setTimeout(this.processTaskQueueItem, 15);
        }
    },

    processTaskQueueItem: function() {
        delete this.taskQueueTimer;

        var listeners = this.taskQueue,
            listener;

        if (listeners.length > 0) {
            listener = listeners.shift();
            this.invoke(listener);
            this.processTaskQueue();
        }
    },

    showFps: function() {
        if (!Ext.trueRequestAnimationFrames) {
            alert("This browser does not support requestAnimationFrame. The FPS listed will not be accurate");
        }
        Ext.onReady(function() {
            Ext.Viewport.add([{
                    xtype: 'component',
                    bottom: 50,
                    left: 0,
                    width: 50,
                    height: 20,
                    html: 'Average',
                    style: 'background-color: black; color: white; text-align: center; line-height: 20px; font-size: 8px;'
                },
                {
                    id: '__averageFps',
                    xtype: 'component',
                    bottom: 0,
                    left: 0,
                    width: 50,
                    height: 50,
                    html: '0',
                    style: 'background-color: red; color: white; text-align: center; line-height: 50px;'
                },
                {
                    xtype: 'component',
                    bottom: 50,
                    left: 50,
                    width: 50,
                    height: 20,
                    html: 'Min (Last 1k)',
                    style: 'background-color: black; color: white; text-align: center; line-height: 20px; font-size: 8px;'
                },
                {
                    id: '__minFps',
                    xtype: 'component',
                    bottom: 0,
                    left: 50,
                    width: 50,
                    height: 50,
                    html: '0',
                    style: 'background-color: orange; color: white; text-align: center; line-height: 50px;'
                },
                {
                    xtype: 'component',
                    bottom: 50,
                    left: 100,
                    width: 50,
                    height: 20,
                    html: 'Max (Last 1k)',
                    style: 'background-color: black; color: white; text-align: center; line-height: 20px; font-size: 8px;'
                },
                {
                    id: '__maxFps',
                    xtype: 'component',
                    bottom: 0,
                    left: 100,
                    width: 50,
                    height: 50,
                    html: '0',
                    style: 'background-color: yellow; color: black; text-align: center; line-height: 50px;'
                },
                {
                    xtype: 'component',
                    bottom: 50,
                    left: 150,
                    width: 50,
                    height: 20,
                    html: 'Current',
                    style: 'background-color: black; color: white; text-align: center; line-height: 20px; font-size: 8px;'
                },
                {
                    id: '__currentFps',
                    xtype: 'component',
                    bottom: 0,
                    left: 150,
                    width: 50,
                    height: 50,
                    html: '0',
                    style: 'background-color: green; color: white; text-align: center; line-height: 50px;'
                }
            ]);
            Ext.AnimationQueue.resetFps();
        });

    },

    resetFps: function() {
        var currentFps = Ext.getCmp('__currentFps'),
            averageFps = Ext.getCmp('__averageFps'),
            minFps = Ext.getCmp('__minFps'),
            maxFps = Ext.getCmp('__maxFps'),
            min = 1000,
            max = 0,
            count = 0,
            sum = 0;

        Ext.AnimationQueue.onFpsChanged = function(fps) {
            count++;

            if (!(count % 10)) {
                min = 1000;
                max = 0;
            }

            sum += fps;
            min = Math.min(min, fps);
            max = Math.max(max, fps);
            currentFps.setHtml(Math.round(fps));
            averageFps.setHtml(Math.round(sum / count));
            minFps.setHtml(Math.round(min));
            maxFps.setHtml(Math.round(max));
        };
    }
}, function() {
    /*
        Global FPS indicator. Add ?showfps to use in any application. Note that this REQUIRES true requestAnimationFrame
        to be accurate.
     */
    //<debug>
    var paramsString = window.location.search.substr(1),
        paramsArray = paramsString.split("&");

    if (paramsArray.indexOf("showfps") !== -1) {
        Ext.AnimationQueue.showFps();
    }
    //</debug>

});

})(this);
