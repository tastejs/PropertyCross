/**
 * @private
 */
Ext.define('Ext.device.device.Sencha', {
    extend: 'Ext.device.device.Abstract',

    constructor: function() {
        this.name = device.name;
        this.uuid = device.uuid;
        this.platform = device.platformName || Ext.os.name;
    }
});
