/**
 * @private
 */
Ext.define('Ext.device.globalization.Cordova', {
    alternateClassName: 'Ext.device.globalization.PhoneGap',

    extend: 'Ext.device.globalization.Abstract',

    getPreferredLanguage: function(config) {
        config = this.callParent(arguments);
        navigator.globalization.getPreferredLanguage(config.success, config.error);
    },
    getLocaleName: function(config) {
        config = this.callParent(arguments);
        navigator.globalization.getLocaleName(config.success, config.error);
    },
    dateToString: function(config) {
        config = this.callParent(arguments);
        navigator.globalization.dateToString(config.date, config.success, config.error, config);
    },
    stringToDate:function(config) {
        config = this.callParent(arguments);
        navigator.globalization.stringToDate(config.dateString, config.success, config.error, config);
    },
    getDatePattern: function(config) {
        config = this.callParent(arguments);
        navigator.globalization.getDatePattern(config.success, config.error, config);
    },
    getDateNames: function(config) {
        config = this.callParent(arguments);
        navigator.globalization.getDateNames(config.success, config.error, config);
    },
    isDayLightSavingsTime: function(config) {
        config = this.callParent(arguments);
        navigator.globalization.isDayLightSavingsTime(config.date, config.success, config.error, config);
    },
    getFirstDayOfWeek:function(config) {
        config = this.callParent(arguments);
        navigator.globalization.getFirstDayOfWeek(config.success, config.error);
    },
    numberToString: function(config) {
        config = this.callParent(arguments);
        navigator.globalization.numberToString(config.number, config.success, config.error, config);
    },
    stringToNumber: function(config) {
        config = this.callParent(arguments);
        navigator.globalization.stringToNumber(config.string, config.success, config.error, config);
    },
    getNumberPattern: function(config) {
        config = this.callParent(arguments);
        navigator.globalization.getNumberPattern(config.success, config.error, config);
    },
    getCurrencyPattern: function(config) {
        config = this.callParent(arguments);
        navigator.globalization.getCurrencyPattern(config.currencyCode, config.success, config.error);
    }
});
