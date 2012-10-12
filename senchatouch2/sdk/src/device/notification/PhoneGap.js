/**
 * @private
 */
Ext.define('Ext.device.notification.PhoneGap', {
    extend: 'Ext.device.notification.Abstract',
    requires: ['Ext.device.Communicator'],

    show: function() {
        var config = this.callParent(arguments),
            buttons = (config.buttons) ? config.buttons.join(',') : null,
            onShowCallback = function(index) {
                if (config.callback) {
                    config.callback.apply(config.scope, (config.buttons) ? [config.buttons[index - 1]] : []);
                }
            };

        navigator.notification.confirm(
            config.message,
            onShowCallback,
            config.title,
            buttons
        );
    },

    vibrate: function() {
        navigator.notification.vibrate(2000);
    }
});
