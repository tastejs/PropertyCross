/**
 * @private
 */
Ext.define('Ext.device.storage.HTML5.HTML5', {
    extend: 'Ext.device.storage.Abstract',
    requires: ['Ext.device.storage.HTML5.Database'],
    dbCache: {},

    openDatabase: function(config) {
        config = this.callParent(arguments);
        if (!this.dbCache[config.name] || config.noCache) {
            this.dbCache[config.name] = Ext.create('Ext.device.storage.HTML5.Database', config);
        }
        return this.dbCache[config.name];
    },

    numKeys: function() {
        return window.localStorage.length;
    },

    getKey: function(index) {
        return window.localStorage.key(index);
    },

    getItem: function(key) {
        return window.localStorage.getItem(key);
    },

    setItem: function(key, value) {
        return window.localStorage.setItem(key, value);
    },

    removeItem: function(key) {
        return window.localStorage.removeItem(key);
    },

    clear: function() {
        return window.localStorage.clear();
    }
});