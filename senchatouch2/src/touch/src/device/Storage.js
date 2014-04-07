Ext.define('Ext.device.Storage', {
    singleton: true,

    requires: [
        'Ext.device.storage.Cordova',
        'Ext.device.storage.Simulator'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;
        if (browserEnv.WebView) {
            if (browserEnv.Cordova) {
                return Ext.create('Ext.device.storage.Cordova');
            }
        }

        return Ext.create('Ext.device.storage.Simulator');
    }
});
