Ext.define('Ext.ux.parse.Store', {
    extend: 'Ext.data.Store',
    requires: ['Ext.ux.parse.Model'],
    isParseStore: true,
    config: {
        proxy: "parse"
    }
});