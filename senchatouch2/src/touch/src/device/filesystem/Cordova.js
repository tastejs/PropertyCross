/**
 * Cordova File APi Abstraction
 *
 * For more documentation see
 * http://docs.phonegap.com/en/2.7.0/cordova_file_file.md.html#File
 */
Ext.define('Ext.device.filesystem.Cordova', {
    alternateClassName: 'Ext.device.filesystem.PhoneGap',
    extend: 'Ext.device.filesystem.HTML5',
    constructor: function() {
        Ext.override(Ext.device.filesystem.Entry,
            {
                /**
                 *
                 * @param {Object} config
                 *
                 * @param {Object} config.metadata
                 * Metadata to add to the file or directory
                 *
                 * @param {Object} config.options
                 * File creation options {create:true, exclusive:false}
                 *
                 * @param {Boolean} config.options.create
                 * Indicates if the file should be created if it doesn't exist
                 *
                 * @param {Boolean} config.options.exclusive
                 * Used with the create option only indicates whether a creation causes an error if the file already exists
                 *
                 * @param {Function} config.success
                 * The function called when the File's Metadata is written successfully
                 *
                 * @param {Function} config.failure
                 * The function called when the File request causes an error
                 *
                 * @param {FileError} config.failure.error
                 *
                 */
                writeMetadata: function(config) {
                    var me = this;

                    this.getEntry(
                        {
                            options: config.options,
                            success: function(entry) {
                                entry.setMetadata(
                                    function() {
                                        config.success.call(config.scope || me);
                                    },
                                    function(error) {
                                        config.failure.call(config.scope || me, error);
                                    },
                                    config.metadata
                                );
                            },
                            failure: function(error) {
                                config.failure.call(config.scope || me, error)
                            }
                        }
                    );
                },

                /**
                 * 
                 * @param {Object} config
                 *
                 * @param {Object} config.options
                 * File creation options {create:true, exclusive:false}
                 *
                 * @param {Boolean} config.options.create
                 * Indicates if the file should be created if it doesn't exist
                 *
                 * @param {Boolean} config.options.exclusive
                 * Used with the create option only indicates whether a creation causes an error if the file already exists
                 *
                 * @param {Function} config.success
                 * The function called when the File's Metadata is written successfully
                 *
                 * @param {Function} config.failure
                 * The function called when the File request causes an error
                 *
                 * @param {FileError} config.failure.error
                 *
                 */
                readMetadata: function(config) {
                    var me = this;

                    this.getEntry(
                        {
                            options: config.options,
                            success: function(entry) {
                                entry.getMetadata(
                                    function(metadata) {
                                        config.success.call(config.scope || me, metadata);
                                    },
                                    function(error) {
                                        config.failure.call(config.scope || me, error);
                                    }
                                );
                            },
                            failure: function(error) {
                                config.failure.call(config.scope || me, error)
                            }
                        }
                    );
                }
            }
        );

        Ext.override(Ext.device.filesystem.FileEntry, {
            writeData: function(writer, data) {
                writer.write(data.toString());
            },
            /**
             * Send a file to a server
             *
             * @param {Object} config
             * 
             * @param {String} config.url
             * URL of server to receive the file
             *
             * @param {Boolean} config.trustAllHosts
             * (Optional) If true it will accept all security certificates. Defaults to false
             *
             * @param {String} config.fileKey
             * Name of the form element. Defaults to "file"
             *
             * @param {String} config.fileName
             * Name of the file on the server
             *
             * @param {String} config.mimeType
             * mime type of the data being uploaded. defaults to "image/jpeg"
             *
             * @param {Object} config.params
             * (Optional) set of key/value pairs to be passed along with the request
             *
             * @param {Boolean} config.chunkMode
             * Should the data be uploaded in a chunked streaming mode. defaults to true
             *
             * @param {Object} config.headers
             * Map of header name => header values. Multiple values should be specified an array of values
             * var headers={'headerParam':'headerValue'};
             *
             * @param {Function} config.success
             * The function called when the File is uploaded successfully
             *
             * @param {Function} config.success.metadata
             *
             * @param {Function} config.failure
             * The function called when the File upload fails
             *
             * @param {FileError} config.failure.error
             *
             * @returns {FileTransfer}
             */
            upload: function(config) {
                var options = new FileUploadOptions();
                options.fileKey = config.fileKey || "file";
                options.fileName = this.path.substr(this.path.lastIndexOf('/') + 1);
                options.mimeType = config.mimeType || "image/jpeg";
                options.params = config.params || {};
                options.headers = config.headers || {};
                options.chunkMode = config.chunkMode || true;

                var fileTransfer = new FileTransfer();
                fileTransfer.upload(this.path, encodeURI(config.url), config.success, config.failure, options, config.trustAllHosts || false);
                return fileTransfer;
            },

            /**
             * Downloads a file from the server saving it into the Local File System
             *
             * @param {Object} config
             *
             * @param {String} config.source
             * URL of file to download
             *
             * @param {Boolean} config.trustAllHosts
             * if true it will accept all security certificates. Defaults to false
             *
             * @param {Object} config.options
             * Header parameters (Auth, etc)
             * 
             *     {
             *         headers: {
             *             "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
             *         }
             *     }
             *
             * @param {Function} config.success
             * The function called when the File is downloaded successfully
             *
             * @param {Function} config.success.entry
             * File Entry object of the downloaded file
             *
             * @param {Function} config.failure
             * The function called when the File download fails
             *
             * @param {FileError} config.failure.error
             *
             * @returns {FileTransfer}
             */
            download: function(config) {
                var fileTransfer = new FileTransfer();
                fileTransfer.download(
                    encodeURI(config.source),
                    this.path,
                    config.success,
                    config.failure,
                    config.trustAllHosts || false,
                    config.options || {}
                );

                return fileTransfer;
            }
        });
    }
});
