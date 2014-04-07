/**
 * @private
 */
Ext.define('Ext.device.compass.Abstract', {
    config: {
        /**
         * @cfg {Number} frequency The default frequency to get the current heading when using {@link Ext.device.Compass#watchHeading}.
         */
        frequency: 100
    },

    getHeadingAvailable: function(config) {
        // <debug>
        if (!config.callback) {
            Ext.Logger.warn('You need to specify a `callback` function for #getHeadingAvailable');
        }
        // </debug>

        return config;
    },

    getCurrentHeading: function(config) {
        // <debug>
        if (!config.success) {
            Ext.Logger.warn('You need to specify a `success` function for #getCurrentHeading');
        }
        // </debug>

        return config;
    },

    watchHeading: function(config) {
        var defaultConfig = Ext.device.compass.Abstract.prototype.config;

        config = Ext.applyIf(config, {
            frequency: defaultConfig.frequency
        });

        // <debug>
        if (!config.callback) {
            Ext.Logger.warn('You need to specify a `callback` function for #watchHeading');
        }
        // </debug>

        return config;
    },

    clearWatch: Ext.emptyFn
});
