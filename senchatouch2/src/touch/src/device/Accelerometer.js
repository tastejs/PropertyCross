/**
 * Provides access to the native Accelerometer API when running on a device. There are three implementations of this API:
 *
 * - [PhoneGap](http://docs.phonegap.com/en/2.6.0/cordova_accelerometer_accelerometer.md.html#Accelerometer)
 *
 * This class will automatically select the correct implementation depending on the device your application is running on.
 *
 * ## Examples
 *
 * Getting the current location:
 *
 *     Ext.device.Accelerometer.getCurrentAcceleration({
 *         success: function(acceleration) {
 *                      alert('Acceleration X: ' + acceleration.x + '\n' +
 *                      'Acceleration Y: ' + acceleration.y + '\n' +
 *                      'Acceleration Z: ' + acceleration.z + '\n' +
 *                      'Timestamp: '      + acceleration.timestamp + '\n');
 *          },
 *         failure: function() {
 *             console.log('something went wrong!');
 *         }
 *     });
 *
 * Watching the current acceleration:
 *
 *     Ext.device.Accelerometer.watchAcceleration({
 *         frequency: 500, // Update every 1/2 second
 *         callback: function(acceleration) {
 *                      console.log('Acceleration X: ' + acceleration.x + '\n' +
 *                      'Acceleration Y: ' + acceleration.y + '\n' +
 *                      'Acceleration Z: ' + acceleration.z + '\n' +
 *                      'Timestamp: '      + acceleration.timestamp + '\n');
 *          },
 *         failure: function() {
 *             console.log('something went wrong!');
 *         }
 *     });
 *
 * @mixins Ext.device.accelerometer.Abstract
 *
 * @aside guide native_apis
 */
Ext.define('Ext.device.Accelerometer', {
    singleton: true,

    requires: [
        'Ext.device.accelerometer.Cordova',
        'Ext.device.accelerometer.Simulator'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;
        if (browserEnv.WebView && browserEnv.Cordova) {
            return Ext.create('Ext.device.accelerometer.Cordova');
        }

        return Ext.create('Ext.device.accelerometer.Simulator');
    }
});
