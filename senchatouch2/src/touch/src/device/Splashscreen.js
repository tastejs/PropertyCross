/**
 * Provides access to the native Splashscreen API
 *
 * - [PhoneGap](http://docs.phonegap.com/en/2.6.0/cordova_splashscreen_splashscreen.md.html#Splashscreen)
 *
 * Class currently only works with Cordova and does not have a simulated HTML counter part.
 * Please see notes on Cordova Docs for proper Native project code changes that
 * will need to be made to use this plugin.
 *
 * http://docs.phonegap.com/en/2.6.0/cordova_splashscreen_splashscreen.md.html#Splashscreen
 *
 * @aside guide native_apis
 */
Ext.define('Ext.device.Splashscreen', {
    singleton: true,

    requires: [
        'Ext.device.splashscreen.Cordova',
        'Ext.device.splashscreen.Simulator'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;
        if (browserEnv.WebView) {
            if (browserEnv.Cordova) {
                return Ext.create('Ext.device.splashscreen.Cordova');
            }
        }

        return Ext.create('Ext.device.splashscreen.Simulator');
    }
});
