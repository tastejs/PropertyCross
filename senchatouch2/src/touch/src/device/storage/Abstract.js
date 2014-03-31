/**
 * @private
 */
Ext.define('Ext.device.storage.Abstract', {

    config: {
        databaseName: "Sencha",
        databaseVersion: '1.0',
        databaseDisplayName: 'Sencha Database',
        databaseSize: 5 * 1024 * 1024
    },

    openDatabase: function(config) {
        var defaultConfig = Ext.device.storage.Abstract.prototype.config;

        config = Ext.applyIf(config, {
            name: defaultConfig.databaseName,
            version: defaultConfig.databaseVersion,
            displayName: defaultConfig.databaseDisplayName,
            size: defaultConfig.databaseSize
        });

        return config;
    },

    numKeys: Ext.emptyFn,
    getKey: Ext.emptyFn,
    getItem: Ext.emptyFn,
    setItem: Ext.emptyFn,
    removeItem: Ext.emptyFn,
    clear: Ext.emptyFn
});
