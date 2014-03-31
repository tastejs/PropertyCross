/**
 *
 *
 * @mixins Ext.device.media.Abstract
 *
 * @aside guide native_apis
 */
Ext.define('Ext.device.Media', {
    singleton: true,

    requires: [
        'Ext.device.Communicator',
        'Ext.device.media.Cordova'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView && browserEnv.Cordova) {
            return Ext.create('Ext.device.media.Cordova');
        }

        return Ext.create('Ext.device.media.Abstract');
    }
});
