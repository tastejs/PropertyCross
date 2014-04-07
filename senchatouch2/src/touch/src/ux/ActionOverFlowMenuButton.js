/**
 * User extention designed to be used on the BB10 platform.
 *
 * This component is used to recreate the Action Over Flow Menu component of the BB10 SDK. To recreate a native BB10 experience, it is
 * advised to insert this component into a {@link Ext.Toolbar} and have it aligned to the right edge.
 *
 *     // Used within a toolbar
 *     {
 *         xtype: 'toolbar',
 *         items: [{
 *             xclass: 'Ext.ux.ActionOverFlowMenuButton',
 *             menuItems: [{
 *                 text: 'Chats',
 *                 iconCls: 'chats',
 *                 handler: function() {
 *                     // do something
 *                 }
 *             }, {
 *                 text: 'Contacts',
 *                 iconCls: 'contacts',
 *                 handler: function() {
 *                     // do something
 *                 }
 *             }, {
 *                 docked: 'bottom',
 *                 text: 'Settings',
 *                 iconCls: 'settings',
 *                 handler: function() {
 *                     // do something
 *                 }
 *             }]
 *         }]
 *     }
 */
Ext.define('Ext.ux.ActionOverFlowMenuButton', {
    extend: 'Ext.ux.MenuButton',

    config: {
        /**
         * @hide
         */
        cls: 'overflow',

        /**
         * @hide
         */
        ui: 'normal',

        /**
         * The items to be used within the {@link Ext.Menu} which is shown when this button is tapped.
         *
         *     // Used within a toolbar
         *     {
         *         xtype: 'toolbar',
         *         items: [{
         *             xclass: 'Ext.ux.ActionMenuButton',
         *             text: 'Chats',
         *             iconCls: 'chats',
         *             menuItems: [{
         *                 text: 'Chats',
         *                 iconCls: 'chats',
         *                 handler: function() {
         *                     // do something
         *                 }
         *             }, {
         *                 text: 'Contacts',
         *                 iconCls: 'contacts',
         *                 handler: function() {
         *                     // do something
         *                 }
         *             }, {
         *                 docked: 'bottom',
         *                 text: 'Settings',
         *                 iconCls: 'settings',
         *                 handler: function() {
         *                     // do something
         *                 }
         *             }]
         *         }]
         *     }
         * 
         * @type {}
         */
        menuItems: [],

        /**
         * @hide
         */
        menuCover: true,

        /**
         * @hide
         */
        menuCls: 'action-over-flow'
    }
});