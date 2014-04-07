/**
 * @private
 */
Ext.define('Ext.device.compass.Cordova', {
    alternateClassName: 'Ext.device.compass.PhoneGap',
    extend: 'Ext.device.compass.Abstract',
    activeWatchID: null,
    getHeadingAvailable:function(config) {
        var callback = function(result) {
            if(result.hasOwnProperty("code")) {
                config.callback.call(config.scope || this, false);
            } else{
                config.callback.call(config.scope || this, true);
            }
        };

        this.getCurrentHeading({success: callback, failure: callback});
    },
    getCurrentHeading: function(config) {
        config = this.callParent(arguments);
        navigator.compass.getCurrentHeading(config.success, config.failure);
        return config;
    },

    watchHeading: function(config) {
        config = this.callParent(arguments);
        if (this.activeWatchID) {
            this.clearWatch();
        }
        this.activeWatchID = navigator.compass.watchHeading(config.callback, config.failure, config);
        return config;
    },

    clearWatch: function() {
        if (this.activeWatchID) {
            navigator.compass.clearWatch(this.activeWatchID);
            this.activeWatchID = null;
        }
    }
});
