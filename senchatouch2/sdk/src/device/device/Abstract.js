/**
 * @private
 */
Ext.define('Ext.device.device.Abstract', {
    /**
     * @property {String} name
     * Returns the name of the current device. If the current device does not have a name (for example, in a browser), it will
     * default to `Not available`.
     */
    name: 'not available',

    /**
     * @property {String} uuid
     * Returns a unique identifier for the current device. If the current device does not have a unique identifier (for example,
     * in a browser), it will default to `anonymous`.
     */
    uuid: 'anonymous',

    /**
     * @property {String} platform
     * The current platform the device is running on.
     */
    platform: Ext.os.name
});
