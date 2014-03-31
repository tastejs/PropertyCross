/**
 * @private
 */
Ext.define('Ext.device.browser.Window', {
    extend: 'Ext.Evented',

    open: function(config) {
        var me = this;

        this._window = window.open(config.url, config.showToolbar ? '_blank' : '_self', config.options || null);

        // Add events
        this._window.addEventListener('loadstart', function() {
            me.fireEvent('loadstart', me);
        });

        this._window.addEventListener('loadstop', function() {
            me.fireEvent('loadstop', me);
        });

        this._window.addEventListener('loaderror', function() {
            me.fireEvent('loaderror', me);
        });

        this._window.addEventListener('exit', function() {
            me.fireEvent('close', me);
        });
    },

    close: function() {
        if (!this._window) {
            return;
        }

        this._window.close();
    }
});
