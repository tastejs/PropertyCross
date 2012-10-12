/**
 * @private
 */
Ext.define('Ext.device.device.PhoneGap', {
    extend: 'Ext.device.device.Abstract',

    constructor: function() {
        this.name = device.name;
        this.uuid = device.uuid;
        this.platform = device.platformName || Ext.os.name;
    }
});
