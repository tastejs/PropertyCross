/**
 * Provides an API to navigate file system hierarchies.
 *
 * @mixins Ext.device.filesystem.Sencha
 *
 * @aside guide native_apis
 */
Ext.define('Ext.device.FileSystem', {
    singleton: true,

    requires: [
        'Ext.device.Communicator',
        'Ext.device.filesystem.Cordova',
        'Ext.device.filesystem.Chrome',
        'Ext.device.filesystem.Simulator',
        'Ext.device.filesystem.Sencha'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;
        if (browserEnv.WebView) {
            if (browserEnv.Cordova) {
                return Ext.create('Ext.device.filesystem.Cordova');
            } else if (browserEnv.Sencha) {
                return Ext.create('Ext.device.filesystem.Sencha');
            }
        } else if (browserEnv.Chrome) {
            return Ext.create('Ext.device.filesystem.Chrome');
        }

        return Ext.create('Ext.device.filesystem.Simulator');
    }
});
