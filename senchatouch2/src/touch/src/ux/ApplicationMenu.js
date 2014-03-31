/**
 * User extention designed to be used on the BB10 platform.
 */
Ext.define('Ext.ux.ApplicationMenu', {
    extend: 'Ext.Menu',

    config: {
        /**
         * @hide
         */
        ui: 'application',

        /**
         * @hide
         */
        layout: {
            type: 'hbox',
            pack: 'center'
        },

        defaults: {
            flex: 0,
            iconAlign: 'top',
            ui: 'tab'
        }
    }
});