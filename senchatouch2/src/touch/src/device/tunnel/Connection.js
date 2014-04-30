Ext.define('Ext.device.tunnel.Connection', {
    constructor: function(receiverId) {
        this.receiverId = receiverId;
    },

    send: function(message, foreground) {
        return Ext.device.Tunnel.send(this.receiverId, message, foreground);
    },

    receive: function(message) {}
});
