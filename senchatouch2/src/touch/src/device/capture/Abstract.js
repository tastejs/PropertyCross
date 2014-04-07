/**
 * @private
 */
Ext.define('Ext.device.capture.Abstract', {
    alternateClassName: 'Ext.device.capture.Simulator',

    /**
     * Start the audio recorder application and return information about captured audio clip file(s).
     *
     *     @example
     *     Ext.device.Capture.captureAudio({
     *         limit: 2, // limit to 2 recordings
     *         maximumDuration: 10, // limit to 10 seconds per recording
     *         success: function(files) {
     *             for (var i = 0; i < files.length; i++) {
     *                 console.log('Captured audio path: ', files[i].fullPath);
     *             };
     *         },
     *         failure: function() {
     *             console.log('Something went wrong!');
     *         }
     *     });
     *
     * @param {Object} config The configuration object to be passed:
     *
     * @param {Number} config.limit The maximum number of recordings allowed (defaults to 1).
     *
     * @param {Number} config.maximumDuration The maximum duration of the capture, in seconds.
     *
     * @param {Number} config.duration The maximum duration of the capture, in seconds.
     *
     * @param {Function} config.success Called if the capture is successful.
     * @param {Array} config.success.files An array of objects containing information about the captured audio.
     *
     * @param {Function} config.failure Called if the capture is unsuccessful.
     */
    captureAudio: Ext.emptyFn,

    /**
     * Start the video recorder application and return information about captured video clip file(s).
     *
     *     @example
     *     Ext.device.Capture.captureVideo({
     *         limit: 2, // limit to 2 recordings
     *         maximumDuration: 10, // limit to 10 seconds per recording
     *         success: function(files) {
     *             for (var i = 0; i < files.length; i++) {
     *                 console.log('Captured video path: ', files[i].fullPath);
     *             };
     *         },
     *         failure: function() {
     *             console.log('Something went wrong!');
     *         }
     *     });
     *
     * @param {Object} config The configuration object to be passed:
     *
     * @param {Number} config.limit The maximum number of recordings allowed (defaults to 1).
     *
     * @param {Number} config.maximumDuration The maximum duration of the capture, in seconds.
     *
     * @param {Number} config.duration The maximum duration of the capture, in seconds.
     *
     * @param {Function} config.success Called if the capture is successful.
     * @param {Array} config.success.files An array of objects containing information about the captured video.
     *
     * @param {Function} config.failure Called if the capture is unsuccessful.
     */
    captureVideo: Ext.emptyFn
});
