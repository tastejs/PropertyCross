/**
 * @private
 */
Ext.define('Ext.device.splashscreen.Cordova', {
    alternateClassName: 'Ext.device.splashscreen.PhoneGap',
    extend: 'Ext.device.splashscreen.Abstract',
    show: function() {
        navigator.splashscreen.show();
    },

    hide: function () {
        navigator.splashscreen.hide();
    }
});