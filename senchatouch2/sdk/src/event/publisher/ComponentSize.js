/**
 * @private
 */
Ext.define('Ext.event.publisher.ComponentSize', {

    extend: 'Ext.event.publisher.Publisher',

    requires: [
        'Ext.ComponentManager',
        'Ext.util.SizeMonitor'
    ],

    targetType: 'component',

    handledEvents: ['resize'],

    constructor: function() {
        this.callParent(arguments);

        this.sizeMonitors = {};
    },

    subscribe: function(target) {
        var match = target.match(this.idSelectorRegex),
            subscribers = this.subscribers,
            sizeMonitors = this.sizeMonitors,
            dispatcher = this.dispatcher,
            targetType = this.targetType,
            component;

        if (!match) {
            return false;
        }

        if (!subscribers.hasOwnProperty(target)) {
            subscribers[target] = 0;

            dispatcher.addListener(targetType, target, 'painted', 'onComponentPainted', this, null, 'before');

            component = Ext.ComponentManager.get(match[1]);

            //<debug error>
            if (!component) {
                Ext.Logger.error("Adding a listener to the 'resize' event of a non-existing component");
            }
            //</debug>

            sizeMonitors[target] = new Ext.util.SizeMonitor({
                element: component.element,
                callback: this.onComponentSizeChange,
                scope: this,
                args: [this, target]
            });
        }

        subscribers[target]++;
        return true;
    },

    unsubscribe: function(target, eventName, all) {
        var match = target.match(this.idSelectorRegex),
            subscribers = this.subscribers,
            dispatcher = this.dispatcher,
            targetType = this.targetType,
            sizeMonitors = this.sizeMonitors;

        if (!match) {
            return false;
        }

        if (!subscribers.hasOwnProperty(target) || (!all && --subscribers[target] > 0)) {
            return true;
        }

        sizeMonitors[target].destroy();
        delete sizeMonitors[target];

        dispatcher.removeListener(targetType, target, 'painted', 'onComponentPainted', this, 'before');

        delete subscribers[target];
        return true;
    },

    onComponentPainted: function(component) {
        var observableId = component.getObservableId(),
            sizeMonitor = this.sizeMonitors[observableId];

        sizeMonitor.refresh();
    },

    onComponentSizeChange: function(component, observableId) {
        this.dispatcher.doDispatchEvent(this.targetType, observableId, 'resize', [component]);
    }
});
