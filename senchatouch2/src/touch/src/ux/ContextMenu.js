/**
 * User extention designed to be used on the BB10 platform.
 */
Ext.define('Ext.ux.ContextMenu', {
    extend: 'Ext.Menu',

    config: {
        /**
         * @hide
         */
        ui: 'context',

        /**
         * @hide
         */
        layout: {
            type: 'vbox',
            pack: 'center'
        }
    }
});