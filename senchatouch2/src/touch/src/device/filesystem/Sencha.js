/**
 * @private
 */
Ext.define('Ext.device.filesystem.Sencha', {
    extend: 'Ext.device.filesystem.Abstract',

    /**
     * Requests a {@link Ext.device.filesystem.FileSystem} instance.
     *
     * @param {Object} config
     * The object which contains the following config options:
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

        Ext.device.Communicator.send({
            command: 'FileSystem#requestFileSystem',
            callbacks: {
                success: function(id) {
                    var fileSystem = Ext.create('Ext.device.filesystem.FileSystem', id);

                    config.success.call(config.scope || this, fileSystem);
                },
                failure: function(error) {
                    if (config.failure) {
                        config.failure.call(config.scope || this, error);
                    }
                }
            },
            scope: config.scope || this
        });
    }
}, function() {
    /**
     * The FileSystem class which is used to represent a file system.
     */
    Ext.define('Ext.device.filesystem.FileSystem', {
        id: 0,
        root: null,

        constructor: function(id) {
            this.id = id;
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
                Ext.device.Communicator.send({
                    command: 'FileSystem#moveTo',
                    path: this.path,
                    fileSystemId: this.fileSystem.id,
                    parentPath: config.parent.path,
                    newName: config.newName,
                    copy: config.copy,
                    callbacks: {
                        success: function(path) {
                            if (config.success) {
                                var entry = me.directory
                                    ? Ext.create('Ext.device.filesystem.DirectoryEntry', path, me.fileSystem)
                                    : Ext.create('Ext.device.filesystem.FileEntry', path, me.fileSystem);

                                config.success.call(config.scope || this, entry);
                            }
                        },
                        failure: function(error) {
                            if (config.failure) {
                                config.failure.call(config.scope || this, error);
                            }
                        }
                    },
                    scope: config.scope || this
                });
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
                Ext.device.Communicator.send({
                    command: 'FileSystem#remove',
                    path: this.path,
                    fileSystemId: this.fileSystem.id,
                    recursively: config.recursively,
                    callbacks: {
                        success: function() {
                            if (config.success) {
                                config.success.call(config.scope || this);
                            }
                        },
                        failure: function(error) {
                            if (config.failure) {
                                config.failure.call(config.scope || this, error);
                            }
                        }
                    },
                    scope: config.scope || this
                });
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
                Ext.device.Communicator.send({
                    command: 'FileSystem#getParent',
                    path: this.path,
                    fileSystemId: this.fileSystem.id,
                    callbacks: {
                        success: function(path) {
                            var entry = me.directory
                                ? Ext.create('Ext.device.filesystem.DirectoryEntry', path, me.fileSystem)
                                : Ext.create('Ext.device.filesystem.FileEntry', path, me.fileSystem);

                            config.success.call(config.scope || this, entry);
                        },
                        failure: function(error) {
                            if (config.failure) {
                                config.failure.call(config.scope || this, error);
                            }
                        }
                    },
                    scope: config.scope || this
                });
            }
        });

        /**
         * The DirectoryEntry class which is used to represent a directory on a file system.
         */
        Ext.define('Ext.device.filesystem.DirectoryEntry', {
            extend: 'Ext.device.filesystem.Entry',

            constructor: function(path, fileSystem) {
                this.callParent([true, path, fileSystem]);
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
                Ext.device.Communicator.send({
                    command: 'FileSystem#readEntries',
                    path: this.path,
                    fileSystemId: this.fileSystem.id,
                    callbacks: {
                        success: function(entryInfos) {
                            var entries = entryInfos.map(function(entryInfo) {
                                return entryInfo.directory
                                    ? Ext.create('Ext.device.filesystem.DirectoryEntry', entryInfo.path, me.fileSystem)
                                    : Ext.create('Ext.device.filesystem.FileEntry', entryInfo.path, me.fileSystem);
                            });

                            config.success.call(config.scope || this, entries);
                        },
                        failure: function(error) {
                            if (config.failure) {
                                config.failure.call(config.scope || this, error);
                            }
                        }
                    },
                    scope: config.scope || this
                });
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

                if (config.options == null) {
                    config.options = {};
                }

                var me = this;
                Ext.device.Communicator.send({
                    command: 'FileSystem#getEntry',
                    path: this.path,
                    fileSystemId: this.fileSystem.id,
                    newPath: config.path,
                    directory: config.directory,
                    create: config.options.create,
                    exclusive: config.options.exclusive,
                    callbacks: {
                        success: function(path) {
                            if (config.success) {
                                var entry = config.directory
                                    ? Ext.create('Ext.device.filesystem.DirectoryEntry', path, me.fileSystem)
                                    : Ext.create('Ext.device.filesystem.FileEntry', path, me.fileSystem);

                                config.success.call(config.scope || this, entry);
                            }
                        },
                        failure: function(error) {
                            if (config.failure) {
                                config.failure.call(config.scope || this, error);
                            }
                        }
                    },
                    scope: config.scope || this
                });
            },

            /**
             * Works the same way as {@link Ext.device.filesystem.DirectoryEntry#getFile},
             * but creates or looks up a directory.
             */
            getDirectory: function(config) {
                this.getFile(Ext.apply(config, {
                    directory: true
                }));
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

            offset: 0,

            constructor: function(path, fileSystem) {
                this.callParent([false, path, fileSystem]);

                this.offset = 0;
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

                var me = this;
                Ext.device.Communicator.send({
                    command: 'FileSystem#seek',
                    path: this.path,
                    fileSystemId: this.fileSystem.id,
                    offset: config.offset,
                    callbacks: {
                        success: function(offset) {
                            me.offset = offset;

                            if (config.success) {
                                config.success.call(config.scope || this);
                            }
                        },
                        failure: function(error) {
                            if (config.failure) {
                                config.failure.call(config.scope || this, error);
                            }
                        }
                    },
                    scope: config.scope || this
                });
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
                Ext.device.Communicator.send({
                    command: 'FileSystem#read',
                    path: this.path,
                    fileSystemId: this.fileSystem.id,
                    offset: this.offset,
                    length: config.length,
                    callbacks: {
                        success: function(result) {
                            me.offset = result.offset;

                            if (config.success) {
                                config.success.call(config.scope || this, result.data);
                            }
                        },
                        failure: function(error) {
                            if (config.failure) {
                                config.failure.call(config.scope || this, error);
                            }
                        }
                    },
                    scope: config.scope || this
                });
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
                    Ext.Logger.error('Ext.device.filesystem.FileEntry#write: You must specify a `data` for the file.');
                    return null;
                }

                var me = this;
                Ext.device.Communicator.send({
                    command: 'FileSystem#write',
                    path: this.path,
                    fileSystemId: this.fileSystem.id,
                    offset: this.offset,
                    data: config.data,
                    callbacks: {
                        success: function(offset) {
                            me.offset = offset;

                            if (config.success) {
                                config.success.call(config.scope || this);
                            }
                        },
                        failure: function(error) {
                            if (config.failure) {
                                config.failure.call(config.scope || this, error);
                            }
                        }
                    },
                    scope: config.scope || this
                });
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
                    Ext.Logger.error('Ext.device.filesystem.FileEntry#truncate: You must specify a `size` of the file.');
                    return null;
                }

                var me = this;
                Ext.device.Communicator.send({
                    command: 'FileSystem#truncate',
                    path: this.path,
                    fileSystemId: this.fileSystem.id,
                    offset: this.offset,
                    size: config.size,
                    callbacks: {
                        success: function(offset) {
                            me.offset = offset;

                            if (config.success) {
                                config.success.call(config.scope || this);
                            }
                        },
                        failure: function(error) {
                            if (config.failure) {
                                config.failure.call(config.scope || this, error);
                            }
                        }
                    },
                    scope: config.scope || this
                });
            }
        });
    });
});
