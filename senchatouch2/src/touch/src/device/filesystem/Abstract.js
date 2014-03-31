/**
 * @private
 */
Ext.define('Ext.device.filesystem.Abstract', {
    config: {
        fileSystemType: 1,
        fileSystemSize: 0,
        readerType: "text",
        stringEncoding: "UTF8"
    },

    requestFileSystem: function(config) {
        var defaultConfig = Ext.device.filesystem.Abstract.prototype.config;

        config = Ext.applyIf(config, {
            type: defaultConfig.fileSystemType,
            size: defaultConfig.fileSystemSize,
            success: Ext.emptyFn,
            failure: Ext.emptyFn
        });

        return config;
    }
});