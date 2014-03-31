/**
 * @private
 */
Ext.define('Ext.device.geolocation.Cordova', {
    alternateClassName: 'Ext.device.geolocation.PhoneGap',
    extend: 'Ext.device.geolocation.Abstract',
    activeWatchID: null,
    getCurrentPosition: function(config) {
        config = this.callParent(arguments);
        navigator.geolocation.getCurrentPosition(config.success, config.failure, config);
        return config;
    },

    watchPosition: function(config) {
        config = this.callParent(arguments);
        if (this.activeWatchID) {
            this.clearWatch();
        }
        this.activeWatchID = navigator.geolocation.watchPosition(config.callback, config.failure, config);
        return config;
    },

    clearWatch: function() {
        if (this.activeWatchID) {
            navigator.geolocation.clearWatch(this.activeWatchID);
            this.activeWatchID = null;
        }
    }
});
