/**
 * @private
 */
Ext.define('Ext.util.SizeMonitor', {

    extend: 'Ext.Evented',

    config: {
        element: null,

        detectorCls: Ext.baseCSSPrefix + 'size-change-detector',

        callback: Ext.emptyFn,

        scope: null,

        args: []
    },

    constructor: function(config) {
        this.initConfig(config);

        this.doFireSizeChangeEvent = Ext.Function.bind(this.doFireSizeChangeEvent, this);

        var me = this,
            element = this.getElement().dom,
            cls = this.getDetectorCls(),
            expandDetector = Ext.Element.create({
                classList: [cls, cls + '-expand'],
                children: [{}]
            }, true),
            shrinkDetector = Ext.Element.create({
                classList: [cls, cls + '-shrink'],
                children: [{}]
            }, true),
            expandListener = function(e) {
                me.onDetectorScroll('expand', e);
            },
            shrinkListener = function(e) {
                me.onDetectorScroll('shrink', e);
            };

        element.appendChild(expandDetector);
        element.appendChild(shrinkDetector);

        this.detectors = {
            expand: expandDetector,
            shrink: shrinkDetector
        };

        this.position = {
            expand: {
                left: 0,
                top: 0
            },
            shrink: {
                left: 0,
                top: 0
            }
        };

        this.listeners = {
            expand: expandListener,
            shrink: shrinkListener
        };

        this.refresh();

        expandDetector.addEventListener('scroll', expandListener, true);
        shrinkDetector.addEventListener('scroll', shrinkListener, true);
    },

    applyElement: function(element) {
        if (element) {
            return Ext.get(element);
        }
    },

    updateElement: function(element) {
        element.on('destroy', 'destroy', this);
    },

    refreshPosition: function(name) {
        var detector = this.detectors[name],
            position = this.position[name],
            left, top;

        position.left = left = detector.scrollWidth - detector.offsetWidth;
        position.top = top = detector.scrollHeight - detector.offsetHeight;

        detector.scrollLeft = left;
        detector.scrollTop = top;
    },

    refresh: function() {
        this.refreshPosition('expand');
        this.refreshPosition('shrink');
    },

    onDetectorScroll: function(name) {
        var detector = this.detectors[name],
            position = this.position[name];

        if (detector.scrollLeft !== position.left || detector.scrollTop !== position.top) {
            this.refresh();
            this.fireSizeChangeEvent();
        }
    },

    fireSizeChangeEvent: function() {
        clearTimeout(this.sizeChangeThrottleTimer);

        this.sizeChangeThrottleTimer = setTimeout(this.doFireSizeChangeEvent, 1);
    },

    doFireSizeChangeEvent: function() {
        this.getCallback().apply(this.getScope(), this.getArgs());
    },

    destroyDetector: function(name) {
        var detector = this.detectors[name],
            listener = this.listeners[name];

        detector.removeEventListener('scroll', listener, true);
        Ext.removeNode(detector);
    },

    destroy: function() {
        this.callParent(arguments);

        this.destroyDetector('expand');
        this.destroyDetector('shrink');

        delete this.listeners;
        delete this.detectors;
    }
});
