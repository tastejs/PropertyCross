Ext.define('Ext.device.tunnel.Sencha', {
    extend: 'Ext.device.tunnel.Abstract',

    requires: ['Ext.device.tunnel.Connection'],

    constructor: function() {
        var me = this,
            i, ln, message;

        this.callSuper(arguments);

        var pendingMessages = window.__tunnelMessages,
            appId = window.__tunnelAppId;

        delete window.__tunnelAppId;
        this.appId = appId;

        if (!appId) {
            throw new Error("window.__tunnelAppId is not set properly");
        }

        if (pendingMessages && pendingMessages.length > 0) {
            for (i = 0, ln = pendingMessages.length; i < ln; i++) {
                message = pendingMessages[i];
                this.onReceived(JSON.parse(atob(message)));
            }
        }

        delete window.__tunnelMessages;

        window.__pushTunnelMessage = function(message) {
            // Release the execution flow for that the native process can continue right away
            // This enable any debugger statement during this flow to work probably
            setTimeout(function() {
                me.onReceived(JSON.parse(atob(message)));
            }, 1);
        }
    },

    broadcast: function(message) {
        var promise = new Ext.Promise;

        Ext.device.Communicator.send({
            command: 'Tunnel#connect',
            callbacks: {
                success: function(result) {
                    if (!result || result.length === 0) {
                        promise.reject({
                            code: 1,
                            message: "There are no receivers for this connection"
                        });
                        return;
                    }

                    promise.fulfill(result);
                },
                failure: function(reason) {
                    promise.reject(reason);
                }
            },
            message: message
        });

        return promise;
    },

    doSend: function(receiverId, messageId, message, foreground) {
        var promise = new Ext.Promise;

        Ext.device.Communicator.send({
            command: 'Tunnel#send',
            callbacks: {
                success: function(result) {
                    promise.fulfill(result);
                },
                failure: function(reason) {
                    promise.reject(reason);
                }
            },
            receiverId: receiverId,
            foreground: foreground,
            message: btoa(JSON.stringify({
                id: messageId,
                appId: this.appId,
                message: message,
                foreground: foreground
            }))
        });

        return promise;
    }
});
