/**
 * @private
 */
Ext.define('Ext.device.notification.Simulator', {
    extend: 'Ext.device.notification.Abstract',
    requires: ['Ext.MessageBox', 'Ext.util.Audio'],

    // @private
    msg: null,

	show: function() {
        var config = this.callParent(arguments),
            buttons = [],
            ln = config.buttons.length,
            button, i, callback;

        //buttons
        for (i = 0; i < ln; i++) {
            button = config.buttons[i];
            if (Ext.isString(button)) {
                button = {
                    text: config.buttons[i],
                    itemId: config.buttons[i].toLowerCase()
                };
            }

            buttons.push(button);
        }

        this.msg = Ext.create('Ext.MessageBox');

        callback = function(itemId) {
            if (config.callback) {
                config.callback.apply(config.scope, [itemId]);
            }
        };

        this.msg.show({
            title  : config.title,
            message: config.message,
            scope  : this.msg,
            buttons: buttons,
            fn     : callback
        });
    },

    alert: function() {
        var config = this.callParent(arguments);

        if (config.buttonName) {
            config.buttons = [config.buttonName];
        }

        this.show(config);
    },

    confirm: function() {
        var config = this.callParent(arguments);
        this.show(config);
    },

    prompt: function() {
        var config = this.callParent(arguments),
            buttons = [],
            ln = config.buttons.length,
            button, i, callback;

        //buttons
        for (i = 0; i < ln; i++) {
            button = config.buttons[i];
            if (Ext.isString(button)) {
                button = {
                    text: config.buttons[i],
                    itemId: config.buttons[i].toLowerCase()
                };
            }

            buttons.push(button);
        }

        this.msg = Ext.create('Ext.MessageBox');

        callback = function(buttonText, value) {
            if (config.callback) {
                config.callback.apply(config.scope, [buttonText, value]);
            }
        };

        this.msg.prompt(config.title, config.message, callback, this.msg, config.multiLine, config.value, config.prompt);
    },

    beep: function(times) {
        if(!Ext.isNumber(times)) times = 1;
        var count = 0;
        var callback = function() {
            if(count < times) {
                setTimeout(function() {
                    Ext.util.Audio.beep(callback);
                }, 50);
            }
            count++;
        };

        callback();
    },

    vibrate: function() {
        //nice animation to fake vibration
        var animation = [
            "@-webkit-keyframes vibrate{",
            "    from {",
            "        -webkit-transform: rotate(-2deg);",
            "    }",
            "    to{",
            "        -webkit-transform: rotate(2deg);",
            "    }",
            "}",

            "body {",
            "    -webkit-animation: vibrate 50ms linear 10 alternate;",
            "}"
        ];

        var head = document.getElementsByTagName("head")[0];
        var cssNode = document.createElement('style');
        cssNode.innerHTML = animation.join('\n');
        head.appendChild(cssNode);

        setTimeout(function() {
            head.removeChild(cssNode);
        }, 400);
    }
});
