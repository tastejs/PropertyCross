/**
 * Allows you to interact with the Twitter API on iOS devices from within your Cordova application.
 *
 * For setup information, please read the [plugin guide](https://github.com/phonegap/phonegap-plugins/tree/master/iOS/Twitter).
 * 
 * @mixins Ext.ux.device.twitter.Abstract
 *
 * @aside guide native_apis
 */
Ext.define('Ext.ux.device.Twitter', {
    singleton: true,

    requires: [
        'Ext.device.Communicator',
        'Ext.ux.device.twitter.Cordova'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;
        if (browserEnv.WebView && browserEnv.Cordova) {
            return Ext.create('Ext.ux.device.twitter.Cordova');
        } else {
            return Ext.create('Ext.ux.device.twitter.Abstract');
        }
    }
});
