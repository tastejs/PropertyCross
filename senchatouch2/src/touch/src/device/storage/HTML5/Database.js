/**
 * @private
 */
Ext.define('Ext.device.storage.HTML5.Database', {
    requires: ["Ext.device.storage.HTML5.SQLStatement"],
    db: null,

    constructor: function(config) {
        this.db = window.openDatabase(config.name, config.version, config.displayName, config.size);
    },

    getVersion: function() {
        if (this.db) {
            return this.db.version;
        }
        // <debug>
        Ext.Logger.warn('Database has not been opened before calling function #getVersion');
        // </debug>

        return null;
    },

    /**
     * @param {String/String[]/Object/Object[]/SQLStatement/SQLStatement[]} sql SQL Command to run with optional arguments and callbacks
     * @param {Function} success callback for successful transaction
     * @param {Function} failure callback for failed transaction
     */
    transaction: function(sql, success, failure) {
        if (!this.db) {
            // <debug>
            Ext.Logger.warn('Database has not been opened before calling function #transaction');
            // </debug>
            return;
        }

        if (!Ext.isArray(sql)) {
            sql = [sql];
        }


        var txFn = function(tx) {
            Ext.each(sql, function(sqlStatement) {
                if (Ext.isString(sqlStatement)) {
                    tx.executeSql(sqlStatement);
                }else if(Ext.isObject(sqlStatement)) {
                    tx.executeSql(sqlStatement.sql, sqlStatement.arguments, sqlStatement.success, sqlStatement.failure);
                }
            });
        };
        this.db.transaction(txFn, failure, success);
    }
});
