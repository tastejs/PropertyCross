/**
 * Provides a cross device way to get information about the device your application is running on. There are 3 different implementations:
 *
 * - Sencha Packager
 * - (PhoneGap)[http://docs.phonegap.com/en/1.4.1/phonegap_device_device.md.html]
 * - Simulator
 *
 * @mixins Ext.device.device.Abstract
 *
 * @aside guide native_apis
 */
Ext.define('Ext.device.Device', {
    singleton: true,

    requires: [
        'Ext.device.Communicator',
        'Ext.device.device.PhoneGap',
        'Ext.device.device.Sencha',
        'Ext.device.device.Simulator'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView) {
            if (browserEnv.PhoneGap) {
                return Ext.create('Ext.device.device.PhoneGap');
            }
            else {
                return Ext.create('Ext.device.device.Sencha');
            }
        }
        else {
            return Ext.create('Ext.device.device.Simulator');
        }
    }
});
