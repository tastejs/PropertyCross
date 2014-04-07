/**
 * Provides a way to send push notifications to a device.
 *
 * # Example
 *
 *     Ext.device.Push.register({
 *         type: Ext.device.Push.ALERT|Ext.device.Push.BADGE|Ext.device.Push.SOUND,
 *         success: function(token) {
 *             console.log('# Push notification registration successful:');
 *             console.log('    token: ' + token);
 *         },
 *         failure: function(error) {
 *             console.log('# Push notification registration unsuccessful:');
 *             console.log('     error: ' + error);
 *         },
 *         received: function(notifications) {
 *             console.log('# Push notification received:');
 *             console.log('    ' + JSON.stringify(notifications));
 *         }
 *     });
 *
 *
 * ## Sencha Cmd
 *
 * Currently only available on iOS for apps packaged with Sencha Cmd.
 *
 *
 * ## Cordova / PhoneGap
 *
 * For apps packaged with Cordova or PhoneGap, Ext.device.Push currently supports iOS and Android via the [PushPlugin](https://github.com/phonegap-build/PushPlugin).
 *
 * Be sure to include that plugin in your project; Ext.device.Push simply normalizes the interface for using notifications in a Sencha Touch application.
 *
 *
 * @mixins Ext.device.push.Abstract
 *
 * @aside guide native_apis
 */
Ext.define('Ext.device.Push', {
    singleton: true,

    requires: [
        'Ext.device.Communicator',
        'Ext.device.push.Sencha',
        'Ext.device.push.Cordova'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView) {
            if (browserEnv.Sencha) {
                return Ext.create('Ext.device.push.Sencha');
            } else if (browserEnv.Cordova) {
                return Ext.create('Ext.device.push.Cordova');
            }
        }

        return Ext.create('Ext.device.push.Abstract');
    }
});
