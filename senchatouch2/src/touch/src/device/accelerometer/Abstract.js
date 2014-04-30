/**
 * @private
 */
Ext.define('Ext.device.accelerometer.Abstract', {
    config: {
        /**
         * @cfg {Number} frequency The default frequency to get the current acceleration when using {@link Ext.device.Accelerometer#watchAcceleration}.
         */
        frequency: 10000
    },

    getCurrentAcceleration: function(config) {
        // <debug>
        if (!config.success) {
            Ext.Logger.warn('You need to specify a `success` function for #getCurrentAcceleration');
        }
        // </debug>

        return config;
    },

    watchAcceleration: function(config) {
        var defaultConfig = Ext.device.accelerometer.Abstract.prototype.config;

        config = Ext.applyIf(config, {
            frequency: defaultConfig.frequency
        });

        // <debug>
        if (!config.callback) {
            Ext.Logger.warn('You need to specify a `callback` function for #watchAcceleration');
        }
        // </debug>

        return config;
    },

    clearWatch: Ext.emptyFn
});
