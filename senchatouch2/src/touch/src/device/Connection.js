/**
 * This class is used to check if the current device is currently online or not. It has three different implementations:
 *
 * - Sencha Packager
 * - Cordova
 * - Simulator
 *
 * Both the Sencha Packager and Cordova implementations will use the native functionality to determine if the current
 * device is online. The Simulator version will simply use `navigator.onLine`.
 *
 * When this singleton ({@link Ext.device.Connection}) is instantiated, it will automatically decide which version to
 * use based on the current platform.
 *
 * ## Examples
 *
 * Determining if the current device is online:
 *
 *     alert(Ext.device.Connection.isOnline());
 *
 * Checking the type of connection the device has:
 *
 *     alert('Your connection type is: ' + Ext.device.Connection.getType());
 *
 * The available connection types are:
 *
 * - {@link Ext.device.Connection#UNKNOWN UNKNOWN} - Unknown connection
 * - {@link Ext.device.Connection#ETHERNET ETHERNET} - Ethernet connection
 * - {@link Ext.device.Connection#WIFI WIFI} - WiFi connection
 * - {@link Ext.device.Connection#CELL_2G CELL_2G} - Cell 2G connection
 * - {@link Ext.device.Connection#CELL_3G CELL_3G} - Cell 3G connection
 * - {@link Ext.device.Connection#CELL_4G CELL_4G} - Cell 4G connection
 * - {@link Ext.device.Connection#NONE NONE} - No network connection
 *
 * @mixins Ext.device.connection.Abstract
 *
 * @aside guide native_apis
 */
Ext.define('Ext.device.Connection', {
    singleton: true,

    requires: [
        'Ext.device.Communicator',
        'Ext.device.connection.Sencha',
        'Ext.device.connection.Cordova',
        'Ext.device.connection.Simulator'
    ],

    /**
     * @event onlinechange
     * @inheritdoc Ext.device.connection.Sencha#onlinechange
     */

    constructor: function() {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView) {
            if (browserEnv.Cordova) {
                return Ext.create('Ext.device.connection.Cordova');
            } else if (browserEnv.Sencha) {
                return Ext.create('Ext.device.connection.Sencha');
            }
        }
        return Ext.create('Ext.device.connection.Simulator');
    }
});
