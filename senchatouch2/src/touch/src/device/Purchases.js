/**
 *
 *
 * @mixins Ext.device.purchases.Sencha
 *
 * @aside guide native_apis
 */
Ext.define('Ext.device.Purchases', {
    singleton: true,

    requires: [
        'Ext.device.Communicator',
        'Ext.device.purchases.Sencha'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView && browserEnv.Sencha) {
            return Ext.create('Ext.device.purchases.Sencha');
        }

        return {};
    }
});
