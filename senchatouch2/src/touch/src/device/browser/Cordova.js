/**
 * @private
 */
Ext.define('Ext.device.browser.Cordova', {
    extend: 'Ext.device.browser.Abstract',
    
    open: function(config) {
        if (!this._window) {
            this._window = Ext.create('Ext.device.browser.Window');
        }

        this._window.open(config);

        return this._window;
    },
    
    close: function() {
        if (!this._window) {
            return;
        }

        this._window.close();
    }
});
