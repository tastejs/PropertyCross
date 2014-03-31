/**
 * @private
 */
Ext.define('Ext.device.sqlite.Sencha', {
    /**
     * Returns a {@link Ext.device.sqlite.Database} instance.
     * If the database with specified name does not exist, it will be created.
     * If the creationCallback is provided,
     * the database is created with the empty string as its version regardless of the specified version.
     *
     * @param {Object} config
     * The object which contains the following config options:
     *
     * @param {String} config.name This is required.
     * The name of the database to open.
     *
     * @param {String} config.version This is required.
     * The version of the database to open.
     *
     * @param {String} config.displayName This is required.
     * The display name of the database to open.
     *
     * @param {Number} config.estimatedSize This is required.
     * The estimated size of the database to open.
     *
     * @param {Function} config.creationCallback This is optional.
     * The callback to be called when the database has been created.
     *
     * @param {Ext.device.sqlite.Database} config.creationCallback.database
     * The created database with the empty string as its version regardless of the specified version.
     *
     * @param {Object} config.scope This is optional.
     * The scope object.
     *
     * @return {Ext.device.sqlite.Database}
     * The opened database, null if an error occured.
     */
    openDatabase: function(config) {
        if (config.name == null) {
            Ext.Logger.error('Ext.device.SQLite#openDatabase: You must specify a `name` of the database.');
            return null;
        }

        if (config.version == null) {
            Ext.Logger.error('Ext.device.SQLite#openDatabase: You must specify a `version` of the database.');
            return null;
        }

        if (config.displayName == null) {
            Ext.Logger.error('Ext.device.SQLite#openDatabase: You must specify a `displayName` of the database.');
            return null;
        }

        if (config.estimatedSize == null) {
            Ext.Logger.error('Ext.device.SQLite#openDatabase: You must specify a `estimatedSize` of the database.');
            return null;
        }

        var database = null;

        var result = Ext.device.Communicator.send({
            command: 'SQLite#openDatabase',
            sync: true,
            name: config.name,
            version: config.version,
            displayName: config.displayName,
            estimatedSize: config.estimatedSize,
            callbacks: {
                // `creationCallback != null` is checked for internal logic in native plugin code
                creationCallback: !config.creationCallback ? null : function() {
                    config.creationCallback.call(config.scope || this, database);
                }
            },
            scope: config.scope || this
        });

        if (result) {
            if (result.error) {
                Ext.Logger.error(result.error);
                return null;
            }

            database = Ext.create('Ext.device.sqlite.Database', result.id, result.version);

            return database;
        }

        return null;
    }
}, function() {
    /**
     * The Database class which is used to perform transactions.
     */
    Ext.define('Ext.device.sqlite.Database', {
        id: 0,
        version: null,

        constructor: function(id, version) {
            this.id = id;
            this.version = version;
        },

        /**
         * Returns the current version of the database.
         *
         * @return {String}
         * The database current version.
         */
        getVersion: function() {
            return Ext.device.Communicator.send({
                command: 'SQLite#getVersion',
                sync: true,
                databaseId: this.id
            });
        },

        /**
         * Performs a {@link Ext.device.sqlite.SQLTransaction} instance in a read/write mode.
         *
         * @param {Object} config
         * The object which contains the following config options:
         *
         * @param {Function} config.callback This is required.
         * The callback to be called when the transaction has been created.
         *
         * @param {Ext.device.sqlite.SQLTransaction} config.callback.transaction
         * The created transaction.
         *
         * @param {Function} config.success This is optional.
         * The callback to be called when the transaction has been successfully commited.
         *
         * @param {Function} config.failure This is optional.
         * The callback to be called when an error occurred and the transaction has been rolled back.
         *
         * @param {Object} config.failure.error
         * The occurred error.
         *
         * @param {Object} config.scope
         * The scope object
         */
        transaction: function(config) {
            if (!config.callback) {
                Ext.Logger.error('Ext.device.sqlite.Database#transaction: You must specify a `callback` callback.');
                return null;
            }

            var me = this;
            Ext.device.Communicator.send({
                command: 'SQLite#createTransaction',
                databaseId: this.id,
                readOnly: config.readOnly,
                callbacks: {
                    success: function(id) {
                        var exception = null;
                        var error = null;
                        var transaction = Ext.create('Ext.device.sqlite.SQLTransaction', id);

                        error = Ext.device.Communicator.send({
                            command: 'SQLite#beginTransaction',
                            sync: true,
                            transactionId: transaction.id
                        });

                        if (!error && config.preflight) {
                            error = config.preflight.call(config.scope || this);
                        }

                        if (!error) {
                            try {
                                transaction.active = true;
                                config.callback.call(config.scope || this, transaction); // may throw exception
                            } catch (e) {
                                exception = e;
                            } finally {
                                transaction.active = false;
                            }
                        }

                        var statements = transaction.statements;

                        while (!(exception || error) && statements.length > 0) {
                            var statement = statements.shift();
                            var result = Ext.device.Communicator.send({
                                command: 'SQLite#executeStatement',
                                sync: true,
                                transactionId: transaction.id,
                                databaseId: me.id,
                                version: me.version,
                                sqlStatement: statement.sqlStatement,
                                arguments: JSON.stringify(statement.arguments)
                            });

                            if (result) {
                                if (result.error) {
                                    error = result.error;
                                } else if (statement.callback) {
                                    var resultSet = Ext.create('Ext.device.sqlite.SQLResultSet', result);

                                    try {
                                        transaction.active = true;
                                        statement.callback.call(statement.scope || this, transaction, resultSet); // may throw exception
                                    } catch (e) {
                                        exception = e;
                                    } finally {
                                        transaction.active = false;
                                    }
                                }
                            }

                            if (error && statement.failure) {
                                try {
                                    transaction.active = true;
                                    if (!statement.failure.call(statement.scope || this, transaction, error)) { // may throw exception
                                        error = null;
                                    }
                                } catch (e) {
                                    exception = e;
                                } finally {
                                    transaction.active = false;
                                }
                            }
                        }

                        if (!(exception || error)) {
                            error = Ext.device.Communicator.send({
                                command: 'SQLite#commitTransaction',
                                sync: true,
                                transactionId: transaction.id
                            });

                            if (!error) {
                                if (config.postflight) {
                                    config.postflight.call(config.scope || this);
                                }

                                if (config.success) {
                                    config.success.call(config.scope || this);
                                }
                            }
                        }

                        if (exception || error) {
                            statements.splice(0, statements.length);

                            Ext.device.Communicator.send({
                                command: 'SQLite#rollbackTransaction',
                                sync: true,
                                transactionId: transaction.id
                            });

                            if (exception) {
                                throw exception;
                            } else if (config.failure) {
                                config.failure.call(config.scope || this, error);
                            }
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
         * Works the same way as {@link Ext.device.sqlite.Database#transaction},
         * but performs a {@link Ext.device.sqlite.SQLTransaction} instance in a read-only mode.
         */
        readTransaction: function(config) {
            this.transaction(Ext.apply(config, {
                readOnly: true
            }));
        },

        /**
         * Verifies and changes the version of the database at the same time
         * as doing a schema update with a {@link Ext.device.sqlite.SQLTransaction} instance.
         *
         * @param {Object} config
         * The object which contains the following config options:
         *
         * @param {String} config.oldVersion This is required.
         * The current version of the database.
         *
         * @param {String} config.newVersion This is required.
         * The new version of the database.
         *
         * @param {Function} config.callback This is optional.
         * The callback to be called when the transaction has been created.
         *
         * @param {Ext.device.sqlite.SQLTransaction} config.callback.transaction
         * The created transaction.
         *
         * @param {Function} config.success This is optional.
         * The callback to be called when the transaction has been successfully commited.
         *
         * @param {Function} config.failure This is optional.
         * The callback to be called when an error occurred and the transaction has been rolled back.
         *
         * @param {Object} config.failure.error
         * The occurred error.
         *
         * @param {Object} config.scope
         * The scope object
         */
        changeVersion: function(config) {
            if (config.oldVersion == null) {
                Ext.Logger.error('Ext.device.SQLite#changeVersion: You must specify an `oldVersion` of the database.');
                return null;
            }

            if (config.newVersion == null) {
                Ext.Logger.error('Ext.device.SQLite#changeVersion: You must specify a `newVersion` of the database.');
                return null;
            }

            this.transaction(Ext.apply(config, {
                preflight: function() {
                    return config.oldVersion == this.getVersion() ? null : 'Unable to change version: version mismatch';
                },
                postflight: function() {
                    var result = Ext.device.Communicator.send({
                        command: 'SQLite#setVersion',
                        sync: true,
                        databaseId: this.id,
                        version: config.newVersion
                    });

                    if (result) {
                        this.version = config.newVersion;
                    }
                }
            }));
        }
    }, function() {
        /**
         * The SQLTransaction class which is used to execute SQL statements.
         */
        Ext.define('Ext.device.sqlite.SQLTransaction', {
            id: 0,
            active: false,
            statements: null,

            constructor: function(id) {
                this.id = id;
                this.statements = new Array();
            },

            /**
             * Executes an SQL statement.
             *
             * @param {Object} config
             * The object which contains the following config options:
             *
             * @param {String} config.sqlStatement This is required.
             * The SQL statement to execute.
             *
             * @param {Array} config.arguments This is optional.
             * The arguments array to bind each '?' placeholder in the SQL statement.
             *
             * @param {Function} config.callback This is optional.
             * The callback to be called when the SQL statement succeeded.
             *
             * @param {Ext.device.sqlite.SQLTransaction} config.callback.transaction
             * The transaction of the SQL statement.
             *
             * @param {Ext.device.sqlite.SQLTransaction} config.callback.resultSet
             * The result of the SQL statement.
             *
             * @param {Function} config.failure This is optional.
             * The callback to be called when an error occurred.
             * If the callback returns false, next SQL statement will be executed.
             *
             * @param {Ext.device.sqlite.SQLTransaction} config.failure.transaction
             * The transaction of the SQL statement.
             *
             * @param {Object} config.failure.error
             * The occurred error.
             *
             * @param {Object} config.scope
             * The scope object
             */
            executeSql: function(config) {
                if (!this.active) {
                    Ext.Logger.error('Ext.device.sqlite.SQLTransaction#executeSql: An attempt was made to use a SQLTransaction that is no longer usable.');
                    return null;
                }

                if (config.sqlStatement == null) {
                    Ext.Logger.error('Ext.device.sqlite.SQLTransaction#executeSql: You must specify a `sqlStatement` for the transaction.');
                    return null;
                }

                this.statements.push({
                    sqlStatement: config.sqlStatement,
                    arguments: config.arguments,
                    callback: config.callback,
                    failure: config.failure,
                    scope: config.scope
                });
            }
        }, function() {
            /**
             * The SQLResultSet class which is used to represent SQL statements results.
             */
            Ext.define('Ext.device.sqlite.SQLResultSet', {
                insertId: 0,
                rowsAffected: 0,
                rows: null,

                constructor: function(data) {
                    this.insertId = data.insertId;
                    this.rowsAffected = data.rowsAffected;
                    this.rows = Ext.create('Ext.device.sqlite.SQLResultSetRowList', data);
                },

                /**
                 * Returns the row ID of the last row that the SQL statement inserted into the database,
                 * if the statement inserted any rows.
                 * If the statement did not insert a row, throws an exception.
                 *
                 * @return {Number}
                 * The inserted row ID.
                 */
                getInsertId: function() {
                    if (this.insertId != 0) {
                        return this.insertId;
                    } else {
                        Ext.Logger.error('Ext.device.sqlite.SQLResultSet#getInsertId: An SQLTransaction did not insert a row.');
                        return null;
                    }
                },

                /**
                 * Returns the number of rows that were changed by the SQL statement.
                 * If the statement did not change any rows, returns zero.
                 *
                 * @return {Number}
                 * The number of rows affected.
                 */
                getRowsAffected: function() {
                    return this.rowsAffected;
                },

                /**
                 * Returns a {@link Ext.device.sqlite.SQLResultSetRowList} instance representing rows returned by the SQL statement.
                 *
                 * @return {Ext.device.sqlite.SQLResultSetRowList}
                 * The rows.
                 */
                getRows: function() {
                    return this.rows;
                }
            }, function() {
                /**
                 * The SQLResultSetRowList class which is used to represent rows returned by SQL statements.
                 */
                Ext.define('Ext.device.sqlite.SQLResultSetRowList', {
                    names: null,
                    rows: null,

                    constructor: function(data) {
                        this.names = data.names;
                        this.rows = data.rows;
                    },

                    /**
                     * Returns the number of rows returned by the SQL statement.
                     *
                     * @return {Number}
                     * The number of rows.
                     */
                    getLength: function() {
                        return this.rows.length;
                    },

                    /**
                     * Returns a row at specified index returned by the SQL statement.
                     * If there is no such row, returns null.
                     *
                     * @param {Number} index This is required.
                     * The index of a row.
                     *
                     * @return {Object}
                     * The row.
                     */
                    item: function(index) {
                        if (index < this.getLength()) {
                            var item = {};
                            var row = this.rows[index];
                            this.names.forEach(function(name, index) {
                                item[name] = row[index];
                            });

                            return item;
                        }

                        return null;
                    }
                });
            });
        });
    });
});
