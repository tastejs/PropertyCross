/**
 * {@link Ext.Menu}'s are used with {@link Ext.Viewport#setMenu}. A menu can be linked with any side of the screen (top, left, bottom or right)
 *  and will simply describe the contents of your menu. To use this menu you will call various menu related functions on the {@link Ext.Viewport}
 * such as {@link Ext.Viewport#showMenu}, {@link Ext.Viewport#hideMenu}, {@link Ext.Viewport#toggleMenu}, {@link Ext.Viewport#hideOtherMenus},
 * or {@link Ext.Viewport#hideAllMenus}.
 *
 *      @example preview
 *      var menu = Ext.create('Ext.Menu', {
 *          items: [
 *              {
 *                  text: 'Settings',
 *                  iconCls: 'settings'
 *              },
 *              {
 *                  text: 'New Item',
 *                  iconCls: 'compose'
 *              },
 *              {
 *                  text: 'Star',
 *                  iconCls: 'star'
 *              }
 *          ]
 *      });
 *
 *      Ext.Viewport.setMenu(menu, {
 *          side: 'left',
 *          reveal: true
 *      });
 *
 *      Ext.Viewport.showMenu('left');
 *
 * The {@link #defaultType} of a Menu item is a {@link Ext.Button button}.
 */
Ext.define('Ext.Menu', {
    extend: 'Ext.Sheet',
    xtype: 'menu',
    requires: ['Ext.Button'],

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'menu',

        /**
         * @cfg
         * @inheritdoc
         */
        left: 0,

        /**
         * @cfg
         * @inheritdoc
         */
        right: 0,

        /**
         * @cfg
         * @inheritdoc
         */
        bottom: 0,

        /**
         * @cfg
         * @inheritdoc
         */
        height: 'auto',

        /**
         * @cfg
         * @inheritdoc
         */
        width: 'auto',

        /**
         * @cfg
         * @inheritdoc
         */
        defaultType: 'button',

        /**
         * @hide
         */
        showAnimation: null,

        /**
         * @hide
         */
        hideAnimation: null,

        /**
         * @hide
         */
        centered: false,

        /**
         * @hide
         */
        modal: true,

        /**
         * @hide
         */
        hidden: true,

        /**
         * @hide
         */
        hideOnMaskTap: true,

        /**
         * @hide
         */
        translatable: {
            translationMethod: null
        }
    },

    constructor: function() {
        this.config.translatable.translationMethod = Ext.browser.is.AndroidStock2 ? 'cssposition' : 'csstransform';
        this.callParent(arguments);
    },

    platformConfig: [{
        theme: ['Windows']
    }, {
        theme: ['Blackberry'],
        ui: 'context',
        layout: {
            pack: 'center'
        }
    }],

    updateUi: function(newUi, oldUi) {
        this.callParent(arguments);

        if (newUi != oldUi && Ext.theme.is.Blackberry) {
            if (newUi == 'context') {
                this.innerElement.swapCls('x-vertical', 'x-horizontal');
            }
            else if (newUi == 'application') {
                this.innerElement.swapCls('x-horizontal', 'x-vertical');
            }
        }
    },

    updateHideOnMaskTap : function(hide) {
        var mask = this.getModal();

        if (mask) {
            mask[hide ? 'on' : 'un'].call(mask, 'tap', function() {
                Ext.Viewport.hideMenu(this.$side);
            }, this);
        }
    },

    /**
     * Only fire the hide event if it is initialized
     */
    doSetHidden: function() {
        if (this.initialized) {
            this.callParent(arguments);
        }
    }
});
