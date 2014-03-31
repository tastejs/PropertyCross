/**
 * User extention designed to be used on the BB10 platform.
 *
 * This component is used to recreate the Tab Menu component of the BB10 SDK. To recreate a native BB10 experience, it is
 * advised to insert this component into a {@link Ext.Toolbar} and have it aligned to the left edge.
 *
 *     // Used within a toolbar
 *     {
 *         xtype: 'toolbar',
 *         items: [{
 *             xclass: 'Ext.ux.TabMenuButton',
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
 *             }]
 *         }]
 *     }
 */
Ext.define('Ext.ux.TabMenuButton', {
    extend: 'Ext.ux.MenuButton',

    config: {
        /**
         * @hide
         */
        ui: 'tab',

        /**
         * @hide
         */
        cls: 'tabmenu',

        /**
         * The items to be used within the {@link Ext.Menu} which is shown when this button is tapped.
         *
         *     // Used within a toolbar
         *     {
         *         xtype: 'toolbar',
         *         items: [{
         *             xclass: 'Ext.ux.TabMenuButton',
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
        menuSide: 'left'
    },

    onMenuButtonTap: function(button) {
        if (button) {
            this.setText(button.getText());
            this.setIconCls(button.getIconCls());
        }

        Ext.Viewport.hideMenu(this.getMenuSide());
    }
});