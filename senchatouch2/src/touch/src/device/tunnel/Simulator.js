Ext.define('Ext.device.tunnel.Simulator', {
    extend: 'Ext.device.tunnel.Abstract',

    requires: ['Ext.device.Communicator'],

    broadcast: function(message) {
        console.log('broadcast ' + message);

        return Ext.Promise.from([{ id: 'foobar' }, { id: 'whatever' }]);
    },

    doSend: function(receiverId, messageId, message) {
        console.log('doSend', receiverId, messageId, message);

        return Ext.Promise.from(true);
    }
});
