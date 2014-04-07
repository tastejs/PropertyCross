/**
 * @private
 */
Ext.define('Ext.device.browser.Simulator', {
    open: function(config) {
        window.open(config.url, '_blank');
    },

    close: Ext.emptyFn
});
