/**
 * @private
 * Interfaces with Cordova PushPlugin: https://github.com/phonegap-build/PushPlugin
 */
Ext.define('Ext.device.push.Cordova', {
    extend : 'Ext.device.push.Abstract',

    statics : {
        /**
         * @private
         * A collection of callback methods that can be globally called by the Cordova PushPlugin
         */
        callbacks : {}
    },

    setPushConfig : function (config) {
        var methodName = Ext.id(null, 'callback');

        //Cordova's PushPlugin needs a static method to call when notifications are received
        Ext.device.push.Cordova.callbacks[methodName] = config.callbacks.received;

        return {
            "badge"    : (config.callbacks.type === Ext.device.Push.BADGE) ? "true" : "false",
            "sound"    : (config.callbacks.type === Ext.device.Push.SOUND) ? "true" : "false",
            "alert"    : (config.callbacks.type === Ext.device.Push.ALERT) ? "true" : "false",
            "ecb"      : 'Ext.device.push.Cordova.callbacks.' + methodName,
            "senderID" : config.senderID
        };
    },

    register : function () {
        var config = arguments[0];

        config.callbacks = this.callParent(arguments);

        var pushConfig = this.setPushConfig(config),
            plugin = window.plugins.pushNotification;

        plugin.register(
            config.callbacks.success,
            config.callbacks.failure,
            pushConfig
        );

    }
});