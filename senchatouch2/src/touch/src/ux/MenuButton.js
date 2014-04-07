/**
 * User extention designed to be used on the BB10 platform.
 *
 * @private
 */
Ext.define('Ext.ux.MenuButton', {
    extend: 'Ext.Button',
    requires: ['Ext.ux.ContextMenu'],

    config: {
        /**
         * @hide
         */
        ui: 'tab',

        /**
         * @hide
         */
        cls: 'menu',

        menuItems: [],

        /**
         * @hide
         */
        menuSide: 'right',

        /**
         * @hide
         */
        menuCover: false,

        /**
         * @hide
         */
        menuCls: null,

        /**
         * @hide
         */
        listeners: {
            tap: 'onTap'
        }
    },

    /**
     * @private
     * Used to show the menu associated with this button
     */
    onTap: function(e) {
        if (this.$menu) {
            this.$menu.destroy();
        }

        this.element.addCls('x-open');

        this.$menu = Ext.create('Ext.ux.ContextMenu', {
            cls: this.getMenuCls(),
            items: this.getMenuItems(),
            listeners: {
                scope: this,
                hide: function() {
                    if (this.$menu) {
                        this.element.removeCls('x-open');
                        Ext.Viewport.removeMenu(this.getMenuSide());
                        this.$menu.destroy();
                    }
                }
            }
        });

        this.$menu.on({
            scope: this,
            tap: this.onMenuButtonTap,
            delegate: 'button'
        });

        Ext.Viewport.setMenu(this.$menu, {
            side: this.getMenuSide(),
            cover: this.getMenuCover()
        });

        Ext.Viewport.showMenu(this.getMenuSide());
    },

    onMenuButtonTap: Ext.emptyFn
});