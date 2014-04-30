/**
 * @private
 */
Ext.define('Ext.device.filesystem.Chrome', {
    extend: 'Ext.device.filesystem.HTML5',
    /**
     * Requests access to the Local File System
     *
     *      var me = this;
     *      var fs = Ext.create("Ext.device.File", {});
     *      fs.requestFileSystem({
     *          type: window.PERSISTENT,
     *          size: 1024 * 1024,
     *          success: function(fileSystem) {
     *              me.fs = fileSystem;
     *          },
     *          failure: function(err) {
     *              console.log("FileSystem Failure: " + err.code);
     *          }
     *      });
     *
     *
     * @param {Object} config An object which contains the follow options
     * @param {Number} config.type
     * window.TEMPORARY (0) or window.PERSISTENT (1)
     *
     * @param {Number} config.size
     * Storage space, in Bytes, needed by the application
     *
     * @param {Function} config.success
     * The function called when the filesystem is returned successfully
     *
     * @param {FileSystem} config.success.fs
     *
     * @param {Function} config.failure
     * The function called when the filesystem request causes and error
     *
     * @param {FileError} config.failure.error
     *
     */
    requestFileSystem: function(config) {
        var me = this;
        config = Ext.device.filesystem.Abstract.prototype.requestFileSystem(config);

        var successCallback = function(fs) {
            var fileSystem = Ext.create('Ext.device.filesystem.FileSystem', fs);
            config.success.call(config.scope || me, fileSystem);
        };

        if (config.type == window.PERSISTENT) {
            if(navigator.webkitPersistentStorage) {
                navigator.webkitPersistentStorage.requestQuota(config.size, function(grantedBytes) {
                    window.webkitRequestFileSystem(
                        config.type,
                        grantedBytes,
                        successCallback,
                        config.failure
                    );
                })
            }else {
                window.webkitStorageInfo.requestQuota(window.PERSISTENT, config.size, function(grantedBytes) {
                    window.webkitRequestFileSystem(
                        config.type,
                        grantedBytes,
                        successCallback,
                        config.failure
                    );
                })
            }
        } else {
            window.webkitRequestFileSystem(
                config.type,
                config.size,
                successCallback,
                config.failure
            );
        }
    }
});
