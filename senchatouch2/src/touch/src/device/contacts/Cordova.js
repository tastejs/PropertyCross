/**
 * @private
 */
Ext.define('Ext.device.contacts.Cordova', {
    alternateClassName: 'Ext.device.contacts.PhoneGap',
    extend: 'Ext.device.contacts.Abstract',

    getContacts: function (config) {
        if (!config) {
            Ext.Logger.warn('Ext.device.Contacts#getContacts: You must specify a `config` object.');
            return false;
        }

        if (!config.success) {
            Ext.Logger.warn('Ext.device.Contacts#getContacts: You must specify a `success` method.');
            return false;
        }

        if (!config.fields) {
            config.fields = ["*"];
        }

        if (!Ext.isArray(config.fields)) {
            config.fields = [config.fields];
        }

        if (Ext.isEmpty(config.multiple)) {
            config.multiple = true;
        }

        navigator.contacts.find(config.fields, config.success, config.failure, config);
    }
});
