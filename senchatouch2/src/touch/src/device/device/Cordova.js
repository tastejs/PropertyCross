/**
 * @private
 */
Ext.define('Ext.device.device.Cordova', {
    alternateClassName: 'Ext.device.device.PhoneGap',

    extend: 'Ext.device.device.Abstract',

    availableListeners: [
        'pause',
        'resume',
        'backbutton',
        'batterycritical',
        'batterylow',
        'batterystatus',
        'menubutton',
        'searchbutton',
        'startcallbutton',
        'endcallbutton',
        'volumeupbutton',
        'volumedownbutton'
    ],

    constructor: function() {
        // We can't get the device details until the device is ready, so lets wait.
        if (Ext.isReady) {
            this.onReady();
        } else {
            Ext.onReady(this.onReady, this, {single: true});
        }
    },

    /**
     * @property {String} cordova
     * Returns the version of Cordova running on the device.
     *
     *     alert('Device cordova: ' + Ext.device.Device.cordova);
     */

    /**
     * @property {String} version
     * Returns the operating system version.
     *
     *     alert('Device Version: ' + Ext.device.Device.version);
     */

    /**
     * @property {String} model
     * Returns the device's model name.
     *
     *     alert('Device Model: ' + Ext.device.Device.model);
     */
    
    /**
     * @event pause
     * Fires when the application goes into the background
     */
    
    /**
     * @event resume
     * Fires when the application goes into the foreground
     */
    
    /**
     * @event batterycritical
     * This event that fires when a Cordova application detects the percentage of battery 
     * has reached the critical battery threshold.
     */
    
    /**
     * @event batterylow
     * This event that fires when a Cordova application detects the percentage of battery 
     * has reached the low battery threshold.
     */
    
    /**
     * @event batterystatus
     * This event that fires when a Cordova application detects the percentage of battery 
     * has changed by at least 1 percent.
     */
    
    /**
     * @event backbutton
     * This is an event that fires when the user presses the back button.
     */
    
    /**
     * @event menubutton
     * This is an event that fires when the user presses the menu button.
     */
    
    /**
     * @event searchbutton
     * This is an event that fires when the user presses the search button.
     */
    
    /**
     * @event startcallbutton
     * This is an event that fires when the user presses the start call button.
     */
    
    /**
     * @event endcallbutton
     * This is an event that fires when the user presses the end call button.
     */
    
    /**
     * @event volumeupbutton
     * This is an event that fires when the user presses the volume up button.
     */
    
    /**
     * @event volumedownbutton
     * This is an event that fires when the user presses the volume down button.
     */

    onReady: function() {
        var me = this,
            device = window.device;

        me.name = device.name || device.model;
        me.cordova = device.cordova;
        me.platform =  device.platform || Ext.os.name;
        me.uuid =  device.uuid;
        me.version = device.version;
        me.model = device.model;
    },

    doAddListener: function(name) {
        if (!this.addedListeners) {
            this.addedListeners = [];
        }

        if (this.availableListeners.indexOf(name) != -1 && this.addedListeners.indexOf(name) == -1) {
            // Add the listeners
            this.addedListeners.push(name);

            document.addEventListener(name, function() {
                me.fireEvent(name, me);
            });
        }

        Ext.device.Device.mixins.observable.doAddListener.apply(Ext.device.Device.mixins.observable, arguments);
    }
});
