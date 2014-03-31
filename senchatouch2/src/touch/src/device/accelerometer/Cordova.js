/**
 * @private
 */
Ext.define('Ext.device.accelerometer.Cordova', {
    alternateClassName: 'Ext.device.accelerometer.PhoneGap',
    extend: 'Ext.device.accelerometer.Abstract',
    activeWatchID: null,
    getCurrentAcceleration: function(config) {
        config = this.callParent(arguments);
        navigator.accelerometer.getCurrentAcceleration(config.success, config.failure);
        return config;
    },

    watchAcceleration: function(config) {
        config = this.callParent(arguments);
        if (this.activeWatchID) {
            this.clearWatch();
        }
        this.activeWatchID = navigator.accelerometer.watchAcceleration(config.callback, config.failure, config);
        return config;
    },

    clearWatch: function() {
        if (this.activeWatchID) {
            navigator.accelerometer.clearWatch(this.activeWatchID);
            this.activeWatchID = null;
        }
    }
});
