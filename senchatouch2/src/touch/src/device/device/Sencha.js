/**
 * @private
 */
Ext.define('Ext.device.device.Sencha', {
    extend: 'Ext.device.device.Abstract',

    constructor: function() {
        this.name = device.name;
        this.uuid = device.uuid;
        this.platform = device.platformName || Ext.os.name;
        this.scheme = Ext.device.Communicator.send({
            command: 'OpenURL#getScheme',
            sync: true
        }) || false;

        Ext.device.Communicator.send({
            command: 'OpenURL#watch',
            callbacks: {
                callback: function(scheme) {
                    this.scheme = scheme || false;
                    this.fireEvent('schemeupdate', this, this.scheme);
                }
            },
            scope: this
        });
    },

    openURL: function(url) {
        Ext.device.Communicator.send({
            command: 'OpenURL#open',
            url: url
        });
    }
});
