/**
 * This device API allows you to access a users contacts using a {@link Ext.data.Store}. This allows you to search, filter
 * and sort through all the contacts using its methods.
 *
 * To use this API, all you need to do is require this class (`Ext.device.Contacts`) and then use `Ext.device.Contacts.getContacts()`
 * to retrieve an array of contacts.
 *
 * **Please note that getThumbnail and getLocalizedLabel are *only* for the Sencha Native Packager.**
 * **Both Cordova/PhoneGap and Sencha Native Packager can access the find method though properties of returned contacts will differ.**
 *
 * # Example
 *
 *     Ext.application({
 *         name: 'Sencha',
 *         requires: 'Ext.device.Contacts',
 *
 *         launch: function() {
 *             Ext.Viewport.add({
 *                 xtype: 'list',
 *                 itemTpl: '{First} {Last}',
 *                 store: {
 *                     fields: ['First', 'Last'],
 *                     data: Ext.device.Contacts.getContacts()
 *                 }
 *             });
 *         }
 *     });
 *
 * @mixins Ext.device.contacts.Abstract
 * @mixins Ext.device.contacts.Sencha
 * @mixins Ext.device.contacts.Cordova
 *
 * @aside guide native_apis
 */
Ext.define('Ext.device.Contacts', {
    singleton: true,

    requires: [
        'Ext.device.Communicator',
        'Ext.device.contacts.Sencha',
        'Ext.device.contacts.Cordova'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView) {
            if (browserEnv.Cordova) {
                return Ext.create('Ext.device.contacts.Cordova');
            }else if (browserEnv.Sencha) {
                return Ext.create('Ext.device.contacts.Sencha');
            }
        }
        return Ext.create('Ext.device.contacts.Abstract');
    }
});
