/**
 * Allows you to use Google Analytics within your Cordova application.
 *
 * For setup information, please read the [plugin documentation](https://github.com/phonegap/phonegap-facebook-plugin).
 * 
 * @mixins Ext.ux.device.analytics.Abstract
 *
 * @aside guide native_apis
 */
Ext.define('Ext.ux.device.Analytics', {
    singleton: true,

    requires: [
        'Ext.device.Communicator',
        'Ext.ux.device.analytics.Cordova'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;
        if (browserEnv.WebView && browserEnv.Cordova) {
            return Ext.create('Ext.ux.device.analytics.Cordova');
        } else {
            return Ext.create('Ext.ux.device.analytics.Abstract');
        }
    }
});
