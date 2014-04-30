/**
 * @private
 */
Ext.define('Ext.device.filesystem.HTML5', {
    extend: 'Ext.device.filesystem.Abstract',
    /**
     * Requests a {@link Ext.device.filesystem.FileSystem} instance.
     *
     *      var me = this;
     *      var fs = Ext.create("Ext.device.FileSystem", {});
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
     * @param {Object} config
     * The object which contains the following config options:
     *
     * @param {Number} config.type
     * window.TEMPORARY (0) or window.PERSISTENT (1)
     *
     * @param {Number} config.size
     * Storage space, in Bytes, needed by the application
     *
     * @param {Function} config.success This is required.
     * The callback to be called when the file system has been successfully created.
     *
     * @param {Ext.device.filesystem.FileSystem} config.success.fileSystem
     * The created file system.
     *
     * @param {Function} config.failure This is optional.
     * The callback to be called when an error occurred.
     *
     * @param {Object} config.failure.error
     * The occurred error.
     *
     * @param {Object} config.scope
     * The scope object
     */
    requestFileSystem: function(config) {
        if (!config.success) {
            Ext.Logger.error('Ext.device.filesystem#requestFileSystem: You must specify a `success` callback.');
            return null;
        }

        var me = this;
        var successCallback = function(fs) {
            var fileSystem = Ext.create('Ext.device.filesystem.FileSystem', fs);
            config.success.call(config.scope || me, fileSystem);
        };

        window.requestFileSystem(
            config.type,
            config.size,
            successCallback,
            config.failure || Ext.emptyFn
        );
    }
}, function() {
    /**
     * The FileSystem class which is used to represent a file system.
     */
    Ext.define('Ext.device.filesystem.FileSystem', {
        fs: null,
        root: null,

        constructor: function(fs) {
            this.fs = fs;
            this.root = Ext.create('Ext.device.filesystem.DirectoryEntry', '/', this);
        },

        /**
         * Returns a {@link Ext.device.filesystem.DirectoryEntry} instance for the root of the file system.
         *
         * @return {Ext.device.filesystem.DirectoryEntry}
         * The file system root directory.
         */
        getRoot: function() {
            return this.root;
        }
    }, function() {
        /**
         * The Entry class which is used to represent entries in a file system,
         * each of which may be a {@link Ext.device.filesystem.FileEntry} or a {@link Ext.device.filesystem.DirectoryEntry}.
         *
         * This is an abstract class.
         * @abstract
         */
        Ext.define('Ext.device.filesystem.Entry', {
            directory: false,
            path: 0,
            fileSystem: null,
            entry: null,

            constructor: function(directory, path, fileSystem) {
                this.directory = directory;
                this.path = path;
                this.fileSystem = fileSystem;
            },

            /**
             * Returns whether the entry is a file.
             *
             * @return {Boolean}
             * The entry is a file.
             */
            isFile: function() {
                return !this.directory;
            },

            /**
             * Returns whether the entry is a directory.
             *
             * @return {Boolean}
             * The entry is a directory.
             */
            isDirectory: function() {
                return this.directory;
            },

            /**
             * Returns the name of the entry, excluding the path leading to it.
             *
             * @return {String}
             * The entry name.
             */
            getName: function() {
                var components = this.path.split('/');
                for (var i = components.length - 1; i >= 0; --i) {
                    if (components[i].length > 0) {
                        return components[i];
                    }
                }

                return '/';
            },

            /**
             * Returns the full absolute path from the root to the entry.
             *
             * @return {String}
             * The entry full path.
             */
            getFullPath: function() {
                return this.path;
            },

            /**
             * Returns the file system on which the entry resides.
             *
             * @return {Ext.device.filesystem.FileSystem}
             * The entry file system.
             */
            getFileSystem: function() {
                return this.fileSystem;
            },

            getEntry: function() {
                return null;
            },

            /**
             * Moves the entry to a different location on the file system.
             *
             * @param {Object} config
             * The object which contains the following config options:
             *
             * @param {Ext.device.filesystem.DirectoryEntry} config.parent This is required.
             * The directory to which to move the entry.
             *
             * @param {String} config.newName This is optional.
             * The new name of the entry to move. Defaults to the entry's current name if unspecified.
             *
             * @param {Function} config.success This is optional.
             * The callback to be called when the entry has been successfully moved.
             *
             * @param {Ext.device.filesystem.Entry} config.success.entry
             * The entry for the new location.
             *
             * @param {Function} config.failure This is optional.
             * The callback to be called when an error occurred.
             *
             * @param {Object} config.failure.error
             * The occurred error.
             *
             * @param {Object} config.scope
             * The scope object
             */
            moveTo: function(config) {
                if (config.parent == null) {
                    Ext.Logger.error('Ext.device.filesystem.Entry#moveTo: You must specify a new `parent` of the entry.');
                    return null;
                }

                var me = this;

                this.getEntry(
                    {
                        options: config.options || {},
                        success: function(sourceEntry) {
                            config.parent.getEntry(
                                {
                                    options: config.options || {},
                                    success: function(destinationEntry) {
                                        if (config.copy) {
                                            sourceEntry.copyTo(destinationEntry, config.newName, function(entry) {
                                                config.success.call(
                                                    config.scope || me,
                                                    entry.isDirectory ? Ext.create('Ext.device.filesystem.DirectoryEntry', entry.fullPath, me.fileSystem) : Ext.create('Ext.device.filesystem.FileEntry', entry.fullPath, me.fileSystem)
                                                );
                                            }, config.failure);
                                        } else {
                                            sourceEntry.moveTo(destinationEntry, config.newName, function(entry) {
                                                config.success.call(
                                                    config.scope || me,
                                                    entry.isDirectory ? Ext.create('Ext.device.filesystem.DirectoryEntry', entry.fullPath, me.fileSystem) : Ext.create('Ext.device.filesystem.FileEntry', entry.fullPath, me.fileSystem)
                                                );
                                            }, config.failure);
                                        }
                                    },
                                    failure: config.failure
                                }
                            );
                        },
                        failure: config.failure
                    }
                );
            },

            /**
             * Works the same way as {@link Ext.device.filesystem.Entry#moveTo}, but copies the entry.
             */
            copyTo: function(config) {
                this.moveTo(Ext.apply(config, {
                    copy: true
                }));
            },

            /**
             * Removes the entry from the file system.
             *
             * @param {Object} config
             * The object which contains the following config options:
             *
             * @param {Boolean} config.recursively This is optional
             * Deletes a directory and all of its contents
             *
             * @param {Function} config.success This is optional.
             * The callback to be called when the entry has been successfully removed.
             *
             * @param {Function} config.failure This is optional.
             * The callback to be called when an error occurred.
             *
             * @param {Object} config.failure.error
             * The occurred error.
             *
             * @param {Object} config.scope
             * The scope object
             */
            remove: function(config) {
                this.getEntry(
                    {
                        success: function(entry) {
                            if (config.recursively && this.directory) {
                                entry.removeRecursively(config.success, config.failure)
                            } else {
                                entry.remove(config.success, config.failure)
                            }
                        },
                        failure: config.failure
                    }
                )
            },

            /**
             * Looks up the parent directory containing the entry.
             *
             * @param {Object} config
             * The object which contains the following config options:
             *
             * @param {Function} config.success This is required.
             * The callback to be called when the parent directory has been successfully selected.
             *
             * @param {Ext.device.filesystem.DirectoryEntry} config.success.entry
             * The parent directory of the entry.
             *
             * @param {Function} config.failure This is optional.
             * The callback to be called when an error occurred.
             *
             * @param {Object} config.failure.error
             * The occurred error.
             *
             * @param {Object} config.scope
             * The scope object
             */
            getParent: function(config) {
                if (!config.success) {
                    Ext.Logger.error('Ext.device.filesystem.Entry#getParent: You must specify a `success` callback.');
                    return null;
                }

                var me = this;
                this.getEntry(
                    {
                        options: config.options || {},
                        success: function(entry) {
                            entry.getParent(
                                function(parentEntry) {
                                    config.success.call(
                                        config.scope || me,
                                        parentEntry.isDirectory
                                            ? Ext.create('Ext.device.filesystem.DirectoryEntry', parentEntry.fullPath, me.fileSystem)
                                            : Ext.create('Ext.device.filesystem.FileEntry', parentEntry.fullPath, me.fileSystem)
                                    )
                                },
                                config.failure
                            )

                        },
                        failure: config.failure
                    }
                )
            }
        });

        /**
         * The DirectoryEntry class which is used to represent a directory on a file system.
         */
        Ext.define('Ext.device.filesystem.DirectoryEntry', {
            extend: 'Ext.device.filesystem.Entry',
            cachedDirectory: null,

            constructor: function(path, fileSystem) {
                this.callParent([true, path, fileSystem]);
            },

            /**
             * Requests a Directory from the Local File System
             *
             * @param {Object} config
             * 
             * @param {Object} config.options
             * File creation options {create:true, exclusive:false}
             *
             * @param {Boolean} config.options.create
             * Indicates if the directory should be created if it doesn't exist
             *
             * @param {Boolean} config.options.exclusive
             * Used with the create option only indicates whether a creation causes an error if the directory already exists
             *
             * @param {Function} config.success
             * The function called when the Directory is returned successfully
             *
             * @param {Ext.device.filesystem.DirectoryEntry} config.success.directory
             * DirectoryEntry Object
             *
             * @param {Function} config.failure
             * The function called when the Directory request causes an error
             *
             * @param {FileError} config.failure.error
             */
            getEntry: function(config) {
                var me = this;
                var callback = config.success;

                if ((config.options && config.options.create) && this.path) {
                    var folders = this.path.split("/");
                    if (folders[0] == '.' || folders[0] == '') {
                        folders = folders.slice(1);
                    }

                    var recursiveCreation = function(dirEntry) {
                        if (folders.length) {
                            dirEntry.getDirectory(folders.shift(), config.options, recursiveCreation, config.failure);
                        } else {
                            callback(dirEntry);
                        }
                    };

                    recursiveCreation(this.fileSystem.fs.root);
                } else {
                    this.fileSystem.fs.root.getDirectory(this.path, config.options,
                        function(directory) {
                            config.success.call(config.scope || me, directory);
                        },
                        config.failure
                    );
                }
            },

            /**
             * Lists all the entries in the directory.
             *
             * @param {Object} config
             * The object which contains the following config options:
             *
             * @param {Function} config.success This is required.
             * The callback to be called when the entries has been successfully read.
             *
             * @param {Ext.device.filesystem.Entry[]} config.success.entries
             * The array of entries of the directory.
             *
             * @param {Function} config.failure This is optional.
             * The callback to be called when an error occurred.
             *
             * @param {Object} config.failure.error
             * The occurred error.
             *
             * @param {Object} config.scope
             * The scope object
             */
            readEntries: function(config) {
                if (!config.success) {
                    Ext.Logger.error('Ext.device.filesystem.DirectoryEntry#readEntries: You must specify a `success` callback.');
                    return null;
                }

                var me = this;
                this.getEntry(
                    {
                        success: function(dirEntry) {
                            var directoryReader = dirEntry.createReader();
                            directoryReader.readEntries(
                                function(entryInfos) {
                                    var entries = [],
                                        i = 0,
                                        len = entryInfos.length;

                                    for (; i < len; i++) {
                                        entryInfo = entryInfos[i];
                                        entries[i] = entryInfo.isDirectory
                                            ? Ext.create('Ext.device.filesystem.DirectoryEntry', entryInfo.fullPath, me.fileSystem)
                                            : Ext.create('Ext.device.filesystem.FileEntry', entryInfo.fullPath, me.fileSystem);
                                    }
                                    config.success.call(config.scope || this, entries);
                                },
                                function(error) {
                                    if (config.failure) {
                                        config.failure.call(config.scope || this, error);
                                    }
                                }
                            );
                        },
                        failure: config.failure
                    }
                );
            },

            /**
             * Creates or looks up a file.
             *
             * @param {Object} config
             * The object which contains the following config options:
             *
             * @param {String} config.path This is required.
             * The absolute path or relative path from the entry to the file to create or select.
             *
             * @param {Object} config.options This is optional.
             * The object which contains the following options:
             *
             * @param {Boolean} config.options.create This is optional.
             * Indicates whether to create a file, if path does not exist.
             *
             * @param {Boolean} config.options.exclusive This is optional. Used with 'create', by itself has no effect.
             * Indicates that method should fail, if path already exists.
             *
             * @param {Function} config.success This is optional.
             * The callback to be called when the file has been successfully created or selected.
             *
             * @param {Ext.device.filesystem.Entry} config.success.entry
             * The created or selected file.
             *
             * @param {Function} config.failure This is optional.
             * The callback to be called when an error occurred.
             *
             * @param {Object} config.failure.error
             * The occurred error.
             *
             * @param {Object} config.scope
             * The scope object
             */
            getFile: function(config) {
                if (config.path == null) {
                    Ext.Logger.error('Ext.device.filesystem.DirectoryEntry#getFile: You must specify a `path` of the file.');
                    return null;
                }

                var me = this;
                var fullPath = this.path + config.path;
                var fileEntry = Ext.create('Ext.device.filesystem.FileEntry', fullPath, this.fileSystem);
                fileEntry.getEntry(
                    {
                        success: function() {
                            config.success.call(config.scope || me, fileEntry);
                        },
                        options: config.options || {},
                        failure: config.failure
                    }
                )
            },

            /**
             * Works the same way as {@link Ext.device.filesystem.DirectoryEntry#getFile},
             * but creates or looks up a directory.
             */
            getDirectory: function(config) {
                if (config.path == null) {
                    Ext.Logger.error('Ext.device.filesystem.DirectoryEntry#getFile: You must specify a `path` of the file.');
                    return null;
                }

                var me = this;
                var fullPath = this.path + config.path;
                var directoryEntry = Ext.create('Ext.device.filesystem.DirectoryEntry', fullPath, this.fileSystem);
                directoryEntry.getEntry(
                    {
                        success: function() {
                            config.success.call(config.scope || me, directoryEntry);
                        },
                        options: config.options || {},
                        failure: config.failure
                    }
                )
            },

            /**
             * Works the same way as {@link Ext.device.filesystem.Entry#remove},
             * but removes the directory and all of its contents, if any.
             */
            removeRecursively: function(config) {
                this.remove(Ext.apply(config, {
                    recursively: true
                }));
            }
        });

        /**
         * The FileEntry class which is used to represent a file on a file system.
         */
        Ext.define('Ext.device.filesystem.FileEntry', {
            extend: 'Ext.device.filesystem.Entry',

            length: 0,
            offset: 0,

            constructor: function(path, fileSystem) {
                this.callParent([false, path, fileSystem]);
                this.offset = 0;
                this.length = 0;
            },

            /**
             * Requests a File Handle from the Local File System
             *
             * @param {Object} config
             * 
             * @param {String} config.file
             * Filename optionally including path in string format '/tmp/debug.txt' or a File Object
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
             * The function called when the filesystem is returned successfully
             *
             * @param {FileSystem} config.success.entry
             *
             * @param {Function} config.failure
             * The function called when the filesystem request causes and error
             *
             * @param {FileError} config.failure.error
             *
             */
            getEntry: function(config) {
                var me = this;
                var originalConfig = Ext.applyIf({}, config);
                if (this.fileSystem) {
                    var failure = function(evt) {
                        if ((config.options && config.options.create) && Ext.isString(this.path)) {
                            var folders = this.path.split("/");
                            if (folders[0] == '.' || folders[0] == '') {
                                folders = folders.slice(1);
                            }

                            if (folders.length > 1 && !config.recursive === true) {
                                folders.pop();

                                var dirEntry = Ext.create('Ext.device.filesystem.DirectoryEntry', folders.join("/"), me.fileSystem);
                                dirEntry.getEntry(
                                    {
                                        options: config.options,
                                        success: function() {
                                            originalConfig.recursive = true;
                                            me.getEntry(originalConfig);
                                        },
                                        failure: config.failure
                                    }
                                );
                            } else {
                                if (config.failure) {
                                    config.failure.call(config.scope || me, evt);
                                }
                            }
                        } else {
                            if (config.failure) {
                                config.failure.call(config.scope || me, evt);
                            }
                        }
                    };

                    this.fileSystem.fs.root.getFile(this.path, config.options || null,
                        function(fileEntry) {
                            fileEntry.file(
                                function(file) {
                                    me.length = file.size;
                                    originalConfig.success.call(config.scope || me, fileEntry);
                                },
                                function(error) {
                                    failure.call(config.scope || me, error);
                                }
                            );
                        },
                        function(error) {
                            failure.call(config.scope || me, error);
                        }
                    );
                } else {
                    config.failure({code: -1, message: "FileSystem not Initialized"});
                }
            },

            /**
             * Returns the byte offset into the file at which the next read/write will occur.
             *
             * @return {Number}
             * The file offset.
             */
            getOffset: function() {
                return this.offset;
            },

            /**
             * Sets the byte offset into the file at which the next read/write will occur.
             *
             * @param {Object} config
             * The object which contains the following config options:
             *
             * @param {Number} config.offset This is required.
             * The file offset to set. If negative, the offset back from the end of the file.
             *
             * @param {Function} config.success This is optional.
             * The callback to be called when the file offset has been successfully set.
             *
             * @param {Function} config.failure This is optional.
             * The callback to be called when an error occurred.
             *
             * @param {Object} config.failure.error
             * The occurred error.
             *
             * @param {Object} config.scope
             * The scope object
             */
            seek: function(config) {
                if (config.offset == null) {
                    Ext.Logger.error('Ext.device.filesystem.FileEntry#seek: You must specify an `offset` in the file.');
                    return null;
                }

                this.offset = config.offset || 0;

                if (config.success) {
                    config.success.call(config.scope || this);
                }
            },

            /**
             * Reads the data from the file starting at the file offset.
             *
             * @param {Object} config
             * The object which contains the following config options:
             *
             * @param {Number} config.length This is optional.
             * The length of bytes to read from the file. Defaults to the file's current size if unspecified.
             *
             * @param {String} config.encoding
             * Optional encoding type used only for reading as Text
             *
             * @param {String} config.type
             * Type of reading to use options are "text" (default), "dataURL", "binaryString" and "arrayBuffer"
             *
             * @param {Object} config.reader
             * Optional config params to be applied to a File Reader
             *
             * @param {Function} config.reader.onloadstart
             * @param {Function} config.reader.onloadprogress
             * @param {Function} config.reader.onload
             * @param {Function} config.reader.onabort
             * @param {Function} config.reader.onerror
             * @param {Function} config.reader.onloadend
             *
             * @param {Function} config.success This is optional.
             * The callback to be called when the data has been successfully read.
             *
             * @param {Object} config.success.data
             * The read data.
             *
             * @param {Function} config.failure This is optional.
             * The callback to be called when an error occurred.
             *
             * @param {Object} config.failure.error
             * The occurred error.
             *
             * @param {Object} config.scope
             * The scope object
             */
            read: function(config) {
                var me = this;
                this.getEntry(
                    {
                        success: function(fileEntry) {
                            fileEntry.file(
                                function(file) {
                                    if (Ext.isNumber(config.length)) {
                                        if (Ext.isFunction(file.slice)) {
                                            file = file.slice(me.offset, config.length);
                                        } else {
                                            if (config.failure) {
                                                config.failure.call(config.scope || me, {code: -2, message: "File missing slice functionality"});
                                            }
                                            return;
                                        }
                                    }

                                    var reader = new FileReader();
                                    reader.onloadend = function(evt) {
                                        config.success.call(config.scope || me, evt.target.result);
                                    };

                                    reader.onerror = function(error) {
                                        config.failure.call(config.scope || me, error);
                                    };

                                    if (config.reader) {
                                        reader = Ext.applyIf(reader, config.reader);
                                    }

                                    config.encoding = config.encoding || "UTF8";

                                    switch (config.type) {
                                        default:
                                        case "text":
                                            reader.readAsText(file, config.encoding);
                                            break;
                                        case "dataURL":
                                            reader.readAsDataURL(file);
                                            break;
                                        case "binaryString":
                                            reader.readAsBinaryString(file);
                                            break;
                                        case "arrayBuffer":
                                            reader.readAsArrayBuffer(file);
                                            break;
                                    }
                                },
                                function(error) {
                                    config.failure.call(config.scope || me, error)
                                }
                            );
                        },
                        failure: function(error) {
                            config.failure.call(config.scope || me, error)
                        }
                    }
                )
            },

            /**
             * Writes the data to the file starting at the file offset.
             *
             * @param {Object} config
             * The object which contains the following config options:
             *
             * @param {Object} config.data This is required.
             * The data to write to the file.
             *
             * @param {Boolean} config.append This is optional.
             * Append to the end of the file
             *
             * @param {Object} config.writer
             * Optional config params to be applied to a File Reader
             *
             * @param {Function} config.writer.onwritestart
             * @param {Function} config.writer.onprogress
             * @param {Function} config.writer.onwrite
             * @param {Function} config.writer.onabort
             * @param {Function} config.writer.onerror
             * @param {Function} config.writer.onwriteend
             *
             * @param {Function} config.success This is optional.
             * The callback to be called when the data has been successfully written.
             *
             * @param {Function} config.failure This is optional.
             * The callback to be called when an error occurred.
             *
             * @param {Object} config.failure.error
             * The occurred error.
             *
             * @param {Object} config.scope
             * The scope object
             */
            write: function(config) {
                if (config.data == null) {
                    Ext.Logger.error('Ext.device.filesystem.FileEntry#write: You must specify `data` to write into the file.');
                    return null;
                }

                var me = this;
                this.getEntry(
                    {
                        options: config.options || {},
                        success: function(fileEntry) {
                            fileEntry.createWriter(
                                function(writer) {
                                    writer.onwriteend = function(evt) {
                                        me.length = evt.target.length;
                                        config.success.call(config.scope || me, evt.result);
                                    };

                                    writer.onerror = function(error) {
                                        config.failure.call(config.scope || me, error);
                                    };

                                    if (config.writer) {
                                        writer = Ext.applyIf(writer, config.writer);
                                    }

                                    if (me.offset) {
                                        writer.seek(me.offset);
                                    } else if (config.append) {
                                        writer.seek(me.length);
                                    }

                                    me.writeData (writer, config.data);
                                },
                                function(error) {
                                    config.failure.call(config.scope || me, error)
                                }
                            )
                        },
                        failure: function(error) {
                            config.failure.call(config.scope || me, error)
                        }
                    }
                )
            },

            writeData: function(writer, data) {
                writer.write(new Blob([data]));
            },

            /**
             * Truncates or extends the file to the specified size in bytes.
             * If the file is extended, the added bytes are null bytes.
             *
             * @param {Object} config
             * The object which contains the following config options:
             *
             * @param {Number} config.size This is required.
             * The new file size.
             *
             * @param {Function} config.success This is optional.
             * The callback to be called when the file size has been successfully changed.
             *
             * @param {Function} config.failure This is optional.
             * The callback to be called when an error occurred.
             *
             * @param {Object} config.failure.error
             * The occurred error.
             *
             * @param {Object} config.scope
             * The scope object
             */
            truncate: function(config) {
                if (config.size == null) {
                    Ext.Logger.error('Ext.device.filesystem.FileEntry#write: You must specify a `size` of the file.');
                    return null;
                }

                var me = this;
                //noinspection JSValidateTypes
                this.getEntry(
                    {
                        success: function(fileEntry) {
                            fileEntry.createWriter(
                                function(writer) {
                                    writer.truncate(config.size);
                                    config.success.call(config.scope || me, me);
                                },
                                function(error) {
                                    config.failure.call(config.scope || me, error)
                                }
                            )
                        },
                        failure: function(error) {
                            config.failure.call(config.scope || me, error)
                        }
                    }
                )
            }
        });
    });
});