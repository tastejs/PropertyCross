/**
 * @private
 */
Ext.define('Ext.device.capture.Cordova', {
    captureAudio: function(config) {
        // <debug>
        if (!config.success) {
            Ext.Logger.warn('You need to specify a `success` function for #captureAudio');
        }
        // </debug>

        var options = {
            limit: config.limit,
            duration: config.maximumDuration
        };

        navigator.device.capture.captureAudio(config.success, config.failure, options);
    },

    captureVideo: function(config) {
        // <debug>
        if (!config.success) {
            Ext.Logger.warn('You need to specify a `success` function for #captureVideo');
        }
        // </debug>

        var options = {
            limit: config.limit,
            duration: config.maximumDuration
        };

        navigator.device.capture.captureVideo(config.success, config.failure, options);
    }
});
