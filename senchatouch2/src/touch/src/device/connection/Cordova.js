/**
 * @private
 */
Ext.define('Ext.device.connection.Cordova', {
    alternateClassName: 'Ext.device.connection.PhoneGap',
    extend: 'Ext.device.connection.Abstract',

    constructor: function() {
        var me = this;
        
        document.addEventListener('online', function() {
            me.fireEvent('online', me);
        });

        document.addEventListener('offline', function() {
            me.fireEvent('offline', me);
        });
    },

    syncOnline: function() {
        var type = navigator.connection.type;
        this._type = type;
        this._online = type != Connection.NONE;
    },

    getOnline: function() {
        this.syncOnline();
        return this._online;
    },

    getType: function() {
        this.syncOnline();
        return this._type;
    }
});
