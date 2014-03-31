/**
 * Provides an API for storing data in databases that can be queried using an SQL.
 *
 * @mixins Ext.device.sqlite.Sencha
 *
 * @aside guide native_apis
 */
Ext.define('Ext.device.SQLite', {
    singleton: true,

    requires: [
        'Ext.device.Communicator',
        'Ext.device.sqlite.Sencha'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;
        if(browserEnv.Sencha) {
            return Ext.create('Ext.device.sqlite.Sencha');
        }

        return {};
    }
});
