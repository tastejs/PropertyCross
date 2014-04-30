/**
 * @private
 */
Ext.define('Ext.device.notification.Cordova', {
    alternateClassName: 'Ext.device.notification.PhoneGap',
    extend: 'Ext.device.notification.Abstract',
    requires: ['Ext.device.Communicator'],

    show: function(config) {
        config = this.callParent(arguments);
        this.confirm(config);
    },

    confirm: function(config) {
        config = this.callParent(arguments);

        var buttons = config.buttons,
            ln = config.buttons.length;

        if (ln && typeof buttons[0] != "string") {
            var newButtons = [],
                i;

            for (i = 0; i < ln; i++) {
                newButtons.push(buttons[i].text);
            }
            buttons = newButtons;
        }

        var callback = function(index) {
            if (config.callback) {
                config.callback.apply(config.scope, (buttons) ? [buttons[index - 1].toLowerCase()] : []);
            }
        };


        navigator.notification.confirm(
            config.message,
            callback,
            config.title,
            buttons
        );
    },

    alert: function(config) {
        navigator.notification.alert(
            config.message,
            config.callback,
            config.title,
            config.buttonName
        );
    },

    prompt: function(config) {
        config = this.callParent(arguments);
        var buttons = config.buttons,
            ln = config.buttons.length;

        if (ln && typeof buttons[0] != "string") {
            var newButtons = [],
                i;

            for (i = 0; i < ln; i++) {
                newButtons.push(buttons[i].text);
            }
            buttons = newButtons;
        }

        var callback = function(result) {
            if (config.callback) {
                config.callback.call(config.scope, (buttons) ? buttons[result.buttonIndex - 1].toLowerCase() : null, result.input1);
            }
        };

        navigator.notification.prompt(
            config.message,
            callback,
            config.title,
            buttons
        );
    },

    vibrate: function(time) {
        navigator.notification.vibrate(time);
    },

    beep: function(times) {
        navigator.notification.vibrate(times);
    }
});
