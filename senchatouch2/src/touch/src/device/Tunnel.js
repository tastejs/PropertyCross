Ext.define('Ext.device.Tunnel', {
    singleton: true,

    requires: [
        'Ext.device.tunnel.Simulator',
        'Ext.device.tunnel.Sencha'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;

        if (browserEnv.Sencha) {
            return Ext.create('Ext.device.tunnel.Sencha');
        }

        return Ext.create('Ext.device.tunnel.Simulator');
    }
});
