/**
 * @private
 */
Ext.define("Ext.device.storage.HTML5.SQLStatement", {
    extend: 'Ext.Base',

    sql:null,
    arguments:null,
    success:Ext.emptyFn,
    failure:Ext.emptyFn,

    constructor: function(config){
        this.sql        = config.sql;
        this.arguments  = config.arguments;
        this.success    = config.success;
        this.failure    = config.failure;
    }
});