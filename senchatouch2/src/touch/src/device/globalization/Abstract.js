/**
 * @private
 */
Ext.define('Ext.device.globalization.Abstract', {
    mixins: ['Ext.mixin.Observable'],

    config: {
        formatLength: 'full',
        selector: 'date and time',
        dateType: 'wide',
        items: 'months',
        numberType: 'decimal',
        currencyCode: "USD"
    },

    getPreferredLanguage: function(config) {
        // <debug>
        if (!config.success) {
            Ext.Logger.warn('You need to specify a `success` function for #getPreferredLanguage');
        }
        // </debug>

        return config;
    },
    getLocaleName: function(config) {
        // <debug>
        if (!config.success) {
            Ext.Logger.warn('You need to specify a `success` function for #getLocaleName');
        }
        // </debug>

        return config;
    },
    dateToString: function(config) {
        var defaultConfig = Ext.device.globalization.Abstract.prototype.config;

        config = Ext.applyIf(config, {
            date: new Date(),
            formatLength: defaultConfig.formatLength,
            selector: defaultConfig.selector
        });

        // <debug>
        if (!config.success) {
            Ext.Logger.warn('You need to specify a `success` function for #dateToString');
        }
        // </debug>

        return config;
    },
    stringToDate: function(config) {
        var defaultConfig = Ext.device.globalization.Abstract.prototype.config;

        config = Ext.applyIf(config, {
            dateString: Ext.util.Format.date(new Date(), 'm/d/Y'),
            formatLength: defaultConfig.formatLength,
            selector: defaultConfig.selector
        });

        // <debug>
        if (!config.success) {
            Ext.Logger.warn('You need to specify a `success` function for #stringToDate');
        }
        // </debug>

        return config;
    },
    getDatePattern: function(config) {
        var defaultConfig = Ext.device.globalization.Abstract.prototype.config;

        config = Ext.applyIf(config, {
            formatLength: defaultConfig.formatLength,
            selector: defaultConfig.selector
        });

        // <debug>
        if (!config.success) {
            Ext.Logger.warn('You need to specify a `success` function for #getDatePattern');
        }
        // </debug>

        return config;
    },
    getDateNames: function(config) {
        var defaultConfig = Ext.device.globalization.Abstract.prototype.config;

        config = Ext.applyIf(config, {
            type: defaultConfig.dateType,
            items: defaultConfig.items
        });

        // <debug>
        if (!config.success) {
            Ext.Logger.warn('You need to specify a `success` function for #getDateNames');
        }
        // </debug>

        return config;
    },
    isDayLightSavingsTime: function(config) {
        config = Ext.applyIf(config, {
            date: new Date()
        });

        // <debug>
        if (!config.success) {
            Ext.Logger.warn('You need to specify a `success` function for #isDayLightSavingsTime');
        }
        // </debug>

        return config;
    },
    getFirstDayOfWeek: function(config) {
        // <debug>
        if (!config.success) {
            Ext.Logger.warn('You need to specify a `success` function for #getFirstDayOfWeek');
        }
        // </debug>

        return config;
    },
    numberToString: function(config) {
        var defaultConfig = Ext.device.globalization.Abstract.prototype.config;

        config = Ext.applyIf(config, {
            number: defaultConfig.number,
            type: defaultConfig.numberType
        });

        // <debug>
        if (!config.number) {
            Ext.Logger.warn('You need to specify a `number` for #numberToString');
        }

        if (!config.success) {
            Ext.Logger.warn('You need to specify a `success` function for #numberToString');
        }
        // </debug>

        return config;
    },
    stringToNumber: function(config) {
        var defaultConfig = Ext.device.globalization.Abstract.prototype.config;

        config = Ext.applyIf(config, {
            type: defaultConfig.numberType
        });

        // <debug>
        if (!config.number) {
            Ext.Logger.warn('You need to specify a `string` for #stringToNumber');
        }

        if (!config.success) {
            Ext.Logger.warn('You need to specify a `success` function for #stringToNumber');
        }
        // </debug>

        return config;
    },
    getNumberPattern: function(config) {
        var defaultConfig = Ext.device.globalization.Abstract.prototype.config;

        config = Ext.applyIf(config, {
            type: defaultConfig.numberType
        });

        if (!config.success) {
            Ext.Logger.warn('You need to specify a `success` function for #getNumberPattern');
        }
        // </debug>

        return config;
    },
    getCurrencyPattern: function(config) {
        var defaultConfig = Ext.device.globalization.Abstract.prototype.config;

        config = Ext.applyIf(config, {
            currencyCode: defaultConfig.currencyCode
        });

        if (!config.success) {
            Ext.Logger.warn('You need to specify a `success` function for #getCurrency');
        }
        // </debug>

        return config;
    }
});
