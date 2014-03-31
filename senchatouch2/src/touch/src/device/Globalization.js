/**
 * Provides access to the native Globalization API
 *
 * - [PhoneGap](http://docs.phonegap.com/en/2.6.0/cordova_globalization_globalization.md.html)
 *
 * Class currently only works with Cordova and does not have a simulated HTML counter part.
 * Please see notes on Cordova Docs for more information.
 *
 * http://docs.phonegap.com/en/2.6.0/cordova_globalization_globalization.md.html
 *
 * @aside guide native_apis
 */
Ext.define('Ext.device.Globalization', {
    singleton: true,

    requires: [
        'Ext.device.globalization.Cordova',
        'Ext.device.globalization.Simulator'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;
        if (browserEnv.WebView) {
            if (browserEnv.Cordova) {
                return Ext.create('Ext.device.globalization.Cordova');
            }
        }

        return Ext.create('Ext.device.globalization.Simulator');
    }
});
