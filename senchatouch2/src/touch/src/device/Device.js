/**
 * Provides a cross device way to get information about the device your application is running on. There are 3 different implementations:
 *
 * - Sencha Packager
 * - [Cordova](http://cordova.apache.org/docs/en/2.5.0/cordova_device_device.md.html#Device)
 * - Simulator
 *
 * ## Examples
 *
 * #### Device Information
 *
 * Getting the device information:
 *
 *     Ext.application({
 *         name: 'Sencha',
 *
 *         // Remember that the Ext.device.Device class *must* be required
 *         requires: ['Ext.device.Device'],
 *
 *         launch: function() {
 *             alert([
 *                 'Device name: ' + Ext.device.Device.name,
 *                 'Device platform: ' + Ext.device.Device.platform,
 *                 'Device UUID: ' + Ext.device.Device.uuid
 *             ].join('\n'));
 *         }
 *     });
 *
 * ### Custom Scheme URL
 *
 * Using custom scheme URL to application your application from other applications:
 *
 *     Ext.application({
 *         name: 'Sencha',
 *         requires: ['Ext.device.Device'],
 *         launch: function() {
 *             if (Ext.device.Device.scheme) {
 *                 // the application was opened via another application. Do something:
 *                 alert('Applicaton pened via another application: ' + Ext.device.Device.scheme.url);
 *             }
 *
 *             // Listen for future changes
 *             Ext.device.Device.on('schemeupdate', function(device, scheme) {
 *                 // the application was launched, closed, and then launched another from another application
 *                 // this means onReady wont be called again ('cause the application is already running in the 
 *                 // background) - but this event will be fired
 *                 alert('Applicated reopened via another application: ' + scheme.url);
 *             }, this);
 *         }
 *     });
 *
 * Of course, you must add the custom scheme URL you would like to use when packaging your application.
 * You can do this by setting the `URLScheme` property inside your `package.json` file (Sencha Native Packager configuration file):
 *
 *     {
 *         ...
 *         "URLScheme": "sencha",
 *         ...
 *     }
 *
 * You can change the available URL scheme.
 *
 * You can then test it by packaging and installing the application onto a device/iOS Simulator, opening Safari and typing: `sencha:testing`.
 * The application will launch and it will `alert` the URL you specified.
 *
 * **PLEASE NOTE: This currently only works with the Sencha Native Packager. If you attempt to listen to this event when packaged with
 * PhoneGap or simply in the browser, it will not function.**
 *
 * @mixins Ext.device.device.Abstract
 *
 * @aside guide native_apis
 */
Ext.define('Ext.device.Device', {
    singleton: true,

    requires: [
        'Ext.device.Communicator',
        'Ext.device.device.Cordova',
        'Ext.device.device.Sencha',
        'Ext.device.device.Simulator'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;
        if (browserEnv.WebView) {
            if (browserEnv.Cordova) {
                return Ext.create('Ext.device.device.Cordova');
            } else if (browserEnv.Sencha) {
                return Ext.create('Ext.device.device.Sencha');
            }
        }

        return Ext.create('Ext.device.device.Simulator');
    }
});
