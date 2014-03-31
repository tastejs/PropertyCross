/**
 * @private
 */
Ext.define('Ext.ux.device.analytics.Cordova', {
    extend: 'Ext.ux.device.analytics.Abstract',

    trackEvent: function(config) {
        if (!this.getAccountID()) {
            return;
        }

        window.plugins.googleAnalyticsPlugin.trackEvent(
            config.category,
            config.action,
            config.label,
            config.value,
            config.nonInteraction
        );
    },

    trackPageview: function(page) {
        if (!this.getAccountID()) {
            return;
        }

        window.plugins.googleAnalyticsPlugin.trackPageview(page);
    }
});
