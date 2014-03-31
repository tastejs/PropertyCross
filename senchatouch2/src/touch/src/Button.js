/**
 * A simple class to display a button in Sencha Touch.
 *
 * There are various different styles of Button you can create by using the {@link #icon},
 * {@link #iconCls}, {@link #iconAlign}, {@link #ui}, and {@link #text}
 * configurations.
 *
 * ## Simple Button
 *
 * Here is a Button in it's simplest form:
 *
 *     @example miniphone
 *     var button = Ext.create('Ext.Button', {
 *         text: 'Button'
 *     });
 *     Ext.Viewport.add({ xtype: 'container', padding: 10, items: [button] });
 *
 * ## Icons
 *
 * You can also create a Button with just an icon using the {@link #iconCls} configuration:
 *
 *     @example miniphone
 *     var button = Ext.create('Ext.Button', {
 *         iconCls: 'refresh'
 *     });
 *     Ext.Viewport.add({ xtype: 'container', padding: 10, items: [button] });
 *
 * Sencha provides the "Font" and "PNG" icons packs from http://wwww.pictos.cc. 
 * Use icons with the {@link Global_CSS#icon icon} mixin in your Sass.
 *
 * ## Badges
 *
 * Buttons can also have a badge on them, by using the {@link #badgeText} configuration:
 *
 *     @example
 *     Ext.create('Ext.Container', {
 *         fullscreen: true,
 *         padding: 10,
 *         items: {
 *             xtype: 'button',
 *             text: 'My Button',
 *             badgeText: '2'
 *         }
 *     });
 *
 * ## UI
 *
 * Buttons also come with a range of different default UIs. Here are the included UIs
 * available (if {@link #$include-button-uis $include-button-uis} is set to `true`):
 *
 * - **normal** - a basic gray button
 * - **back** - a back button
 * - **forward** - a forward button
 * - **round** - a round button
 * - **action** - shaded using the {@link Global_CSS#$active-color $active-color} (dark blue by default)
 * - **decline** - shaded using the {@link Global_CSS#$alert-color $alert-color} (red by default)
 * - **confirm** - shaded using the {@link Global_CSS#$confirm-color $confirm-color} (green by default)
 *
 * You can also append `-round` to each of the last three UI's to give it a round shape:
 *
 * - **action-round**
 * - **decline-round**
 * - **confirm-round**
 *
 * And setting them is very simple:
 *
 *     var uiButton = Ext.create('Ext.Button', {
 *         text: 'My Button',
 *         ui: 'action'
 *     });
 *
 * And how they look:
 *
 *     @example miniphone preview
 *     Ext.create('Ext.Container', {
 *         fullscreen: true,
 *         padding: 4,
 *         defaults: {
 *             xtype: 'button',
 *             margin: 5
 *         },
 *         layout: {
 *             type: 'vbox',
 *             align: 'center'
 *         },
 *         items: [
 *             { ui: 'normal', text: 'normal' },
 *             { ui: 'round', text: 'round' },
 *             { ui: 'action', text: 'action' },
 *             { ui: 'decline', text: 'decline' },
 *             { ui: 'confirm', text: 'confirm' }
 *         ]
 *     });
 *
 * Note that the default {@link #ui} is **normal**.
 *
 * You can also use the {@link #sencha-button-ui sencha-button-ui} CSS Mixin to create your own UIs.
 *
 * ## Example
 *
 * This example shows a bunch of icons on the screen in two toolbars. When you click on the center
 * button, it switches the {@link #iconCls} on every button on the page.
 *
 *     @example preview
 *     Ext.createWidget('container', {
 *         fullscreen: true,
 *         layout: {
 *             type: 'vbox',
 *             pack:'center',
 *             align: 'center'
 *         },
 *         items: [
 *             {
 *                 xtype: 'button',
 *                 text: 'Change iconCls',
 *                 handler: function() {
 *                     // classes for all the icons to loop through.
 *                     var availableIconCls = [
 *                         'action', 'add', 'arrow_down', 'arrow_left',
 *                         'arrow_right', 'arrow_up', 'compose', 'delete',
 *                         'organize', 'refresh', 'reply', 'search',
 *                         'settings', 'star', 'trash', 'maps', 'locate',
 *                         'home'
 *                     ];
 *                     // get the text of this button,
 *                     // so we know which button we don't want to change
 *                     var text = this.getText();
 *
 *                     // use ComponentQuery to find all buttons on the page
 *                     // and loop through all of them
 *                     Ext.Array.forEach(Ext.ComponentQuery.query('button'), function(button) {
 *                         // if the button is the change iconCls button, continue
 *                         if (button.getText() === text) {
 *                             return;
 *                         }
 *
 *                         // get the index of the new available iconCls
 *                         var index = availableIconCls.indexOf(button.getIconCls()) + 1;
 *
 *                         // update the iconCls of the button with the next iconCls, if one exists.
 *                         // if not, use the first one
 *                         button.setIconCls(availableIconCls[(index === availableIconCls.length) ? 0 : index]);
 *                     });
 *                 }
 *             },
 *             {
 *                 xtype: 'toolbar',
 *                 docked: 'top',
 *                 items: [
 *                     { xtype: 'spacer' },
 *                     { iconCls: 'action' },
 *                     { iconCls: 'add' },
 *                     { iconCls: 'arrow_down' },
 *                     { iconCls: 'arrow_left' },
 *                     { iconCls: 'arrow_up' },
 *                     { iconCls: 'compose' },
 *                     { iconCls: 'delete' },
 *                     { iconCls: 'organize' },
 *                     { iconCls: 'refresh' },
 *                     { xtype: 'spacer' }
 *                 ]
 *             },
 *             {
 *                 xtype: 'toolbar',
 *                 docked: 'bottom',
 *                 ui: 'light',
 *                 items: [
 *                     { xtype: 'spacer' },
 *                     { iconCls: 'reply' },
 *                     { iconCls: 'search' },
 *                     { iconCls: 'settings' },
 *                     { iconCls: 'star' },
 *                     { iconCls: 'trash' },
 *                     { iconCls: 'maps' },
 *                     { iconCls: 'locate' },
 *                     { iconCls: 'home' },
 *                     { xtype: 'spacer' }
 *                 ]
 *             }
 *         ]
 *     });
 *
 */
Ext.define('Ext.Button', {
    extend: 'Ext.Component',

    xtype: 'button',

    /**
     * @event tap
     * @preventable doTap
     * Fires whenever a button is tapped.
     * @param {Ext.Button} this The item added to the Container.
     * @param {Ext.EventObject} e The event object.
     */

    /**
     * @event release
     * @preventable doRelease
     * Fires whenever the button is released.
     * @param {Ext.Button} this The item added to the Container.
     * @param {Ext.EventObject} e The event object.
     */

    cachedConfig: {
        /**
         * @cfg {String} pressedCls
         * The CSS class to add to the Button when it is pressed.
         * @accessor
         */
        pressedCls: Ext.baseCSSPrefix + 'button-pressing',

        /**
         * @cfg {String} badgeCls
         * The CSS class to add to the Button's badge, if it has one.  Badges appear as small numbers, letters, or icons that sit on top of your button.  For instance, a small red number indicating how many updates are available.
         * @accessor
         */
        badgeCls: Ext.baseCSSPrefix + 'badge',

        /**
         * @cfg {String} hasBadgeCls
         * The CSS class to add to the Button if it has a badge (note that this goes on the
         * Button element itself, not on the badge element).
         * @private
         * @accessor
         */
        hasBadgeCls: Ext.baseCSSPrefix + 'hasbadge',

        /**
         * @cfg {String} labelCls
         * The CSS class to add to the field's label element.
         * @accessor
         */
        labelCls: Ext.baseCSSPrefix + 'button-label',

        /**
         * @cfg {String} iconCls
         * Optional CSS class to add to the icon element. This is useful if you want to use a CSS
         * background image to create your Button icon.
         * @accessor
         */
        iconCls: null
    },

    config: {
        /**
         * @cfg {String} badgeText
         * Optional badge text.  Badges appear as small numbers, letters, or icons that sit on top of your button.  For instance, a small red number indicating how many updates are available.
         * @accessor
         */
        badgeText: null,

        /**
         * @cfg {String} text
         * The Button text.
         * @accessor
         */
        text: null,

        /**
         * @cfg {String} icon
         * Url to the icon image to use if you want an icon to appear on your button.
         * @accessor
         */
        icon: false,

        /**
         * @cfg {String} iconAlign
         * The position within the Button to render the icon Options are: `top`, `right`, `bottom`, `left` and `center` (when you have
         * no {@link #text} set).
         * @accessor
         */
        iconAlign: 'left',

        /**
         * @cfg {Number/Boolean} pressedDelay
         * The amount of delay between the `tapstart` and the moment we add the `pressedCls` (in milliseconds).
         * Settings this to `true` defaults to 100ms.
         */
        pressedDelay: 0,

        /**
         * @cfg {Function} handler
         * The handler function to run when the Button is tapped on.
         * @accessor
         */
        handler: null,

        /**
         * @cfg {Object} scope
         * The scope to fire the configured {@link #handler} in.
         * @accessor
         */
        scope: null,

        /**
         * @cfg {String} autoEvent
         * Optional event name that will be fired instead of `tap` when the Button is tapped on.
         * @accessor
         */
        autoEvent: null,

        /**
         * @cfg {String} ui
         * The ui style to render this button with. The valid default options are:
         *
         * - `'normal'` - a basic gray button (default).
         * - `'back'` - a back button.
         * - `'forward'` - a forward button.
         * - `'round'` - a round button.
         * - `'plain'`
         * - `'action'` - shaded using the {@link Global_CSS#$active-color $active-color} (dark blue by default).
         * - `'decline'` - shaded using the {@link Global_CSS#$alert-color $alert-color} (red by default).
         * - `'confirm'` - shaded using the {@link Global_CSS#$confirm-color $confirm-color} (green by default).
         *
         * You can also append `-round` to each of the last three UI's to give it a round shape:
         *
         * - **action-round**
         * - **decline-round**
         * - **confirm-round**
         *
         * @accessor
         */
        ui: 'normal',

        /**
         * @cfg {String} html The HTML to put in this button.
         *
         * If you want to just add text, please use the {@link #text} configuration.
         */

        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'button'
    },

    template: [
        {
            tag: 'span',
            reference: 'badgeElement',
            hidden: true
        },
        {
            tag: 'span',
            className: Ext.baseCSSPrefix + 'button-icon',
            reference: 'iconElement'
        },
        {
            tag: 'span',
            reference: 'textElement',
            hidden: true
        }
    ],

    initialize: function() {
        this.callParent();

        this.element.on({
            scope      : this,
            tap        : 'onTap',
            touchstart : 'onPress',
            touchend   : 'onRelease'
        });
    },

    /**
     * @private
     */
    updateBadgeText: function(badgeText) {
        var element = this.element,
            badgeElement = this.badgeElement;

        if (badgeText) {
            badgeElement.show();
            badgeElement.setText(badgeText);
        }
        else {
            badgeElement.hide();
        }

        element[(badgeText) ? 'addCls' : 'removeCls'](this.getHasBadgeCls());
    },

    /**
     * @private
     */
    updateText: function(text) {
        var textElement = this.textElement;
        
        if (textElement) {
            if (text) {
                textElement.show();
                textElement.setHtml(text);
            } else {
                textElement.hide();
            }

            this.refreshIconAlign();
        }
    },

    /**
     * @private
     */
    updateHtml: function(html) {
        var textElement = this.textElement;

        if (html) {
            textElement.show();
            textElement.setHtml(html);
        }
        else {
            textElement.hide();
        }
    },

    /**
     * @private
     */
    updateBadgeCls: function(badgeCls, oldBadgeCls) {
        this.badgeElement.replaceCls(oldBadgeCls, badgeCls);
    },

    /**
     * @private
     */
    updateHasBadgeCls: function(hasBadgeCls, oldHasBadgeCls) {
        var element = this.element;

        if (element.hasCls(oldHasBadgeCls)) {
            element.replaceCls(oldHasBadgeCls, hasBadgeCls);
        }
    },

    /**
     * @private
     */
    updateLabelCls: function(labelCls, oldLabelCls) {
        this.textElement.replaceCls(oldLabelCls, labelCls);
    },

    /**
     * @private
     */
    updatePressedCls: function(pressedCls, oldPressedCls) {
        var element = this.element;

        if (element.hasCls(oldPressedCls)) {
            element.replaceCls(oldPressedCls, pressedCls);
        }
    },

    /**
     * @private
     */
    updateIcon: function(icon) {
        var me = this,
            element = me.iconElement;

        if (icon) {
            me.showIconElement();
            element.setStyle('background-image', 'url(' + icon + ')');
            me.refreshIconAlign();
        } else {
        	element.setStyle('background-image', '');
            me.hideIconElement();
        }
    },

    /**
     * @private
     */
    updateIconCls: function(iconCls, oldIconCls) {
        var me = this,
            element = me.iconElement;

        if (iconCls) {
            me.showIconElement();
            element.replaceCls(oldIconCls, iconCls);
            me.refreshIconAlign();
        } else {
			element.removeCls(oldIconCls);
            me.hideIconElement();
        }
    },

    /**
     * @private
     */
    updateIconAlign: function(alignment, oldAlignment) {
        var element = this.element,
            baseCls = Ext.baseCSSPrefix + 'iconalign-';

        if (!this.getText()) {
            alignment = "center";
        }

        element.removeCls(baseCls + "center");
        element.removeCls(baseCls + oldAlignment);
        if (this.getIcon() || this.getIconCls()) {
            element.addCls(baseCls + alignment);
        }
    },

    refreshIconAlign: function() {
        this.updateIconAlign(this.getIconAlign());
    },

    applyAutoEvent: function(autoEvent) {
        var me = this;

        if (typeof autoEvent == 'string') {
            autoEvent = {
                name : autoEvent,
                scope: me.scope || me
            };
        }

        return autoEvent;
    },

    /**
     * @private
     */
    updateAutoEvent: function(autoEvent) {
        var name  = autoEvent.name,
            scope = autoEvent.scope;

        this.setHandler(function() {
            scope.fireEvent(name, scope, this);
        });

        this.setScope(scope);
    },

    /**
     * Used by `icon` and `iconCls` configurations to hide the icon element.
     * @private
     */
    hideIconElement: function() {
        this.iconElement.removeCls(Ext.baseCSSPrefix + 'shown');
        this.iconElement.addCls(Ext.baseCSSPrefix + 'hidden');
    },

    /**
     * Used by `icon` and `iconCls` configurations to show the icon element.
     * @private
     */
    showIconElement: function() {
        this.iconElement.removeCls(Ext.baseCSSPrefix + 'hidden');
        this.iconElement.addCls(Ext.baseCSSPrefix + 'shown');
    },

    /**
     * We override this to check for '{ui}-back'. This is because if you have a UI of back, you need to actually add two class names.
     * The ui class, and the back class:
     *
     * `ui: 'action-back'` would turn into:
     *
     * `class="x-button-action x-button-back"`
     *
     * But `ui: 'action'` would turn into:
     *
     * `class="x-button-action"`
     *
     * So we just split it up into an array and add both of them as a UI, when it has `back`.
     * @private
     */
    applyUi: function(config) {
        if (config && Ext.isString(config)) {
            var array  = config.split('-');
            if (array && (array[1] == "back" || array[1] == "forward")) {
                return array;
            }
        }

        return config;
    },

    getUi: function() {
        //Now that the UI can sometimes be an array, we need to check if it an array and return the proper value.
        var ui = this._ui;
        if (Ext.isArray(ui)) {
            return ui.join('-');
        }
        return ui;
    },

    applyPressedDelay: function(delay) {
        if (Ext.isNumber(delay)) {
            return delay;
        }
        return (delay) ? 100 : 0;
    },

    // @private
    onPress: function() {
        var me = this,
            element = me.element,
            pressedDelay = me.getPressedDelay(),
            pressedCls = me.getPressedCls();

        if (!me.getDisabled()) {
            if (pressedDelay > 0) {
                me.pressedTimeout = setTimeout(function() {
                    delete me.pressedTimeout;
                    if (element) {
                        element.addCls(pressedCls);
                    }
                }, pressedDelay);
            }
            else {
                element.addCls(pressedCls);
            }
        }
    },

    // @private
    onRelease: function(e) {
        this.fireAction('release', [this, e], 'doRelease');
    },

    // @private
    doRelease: function(me, e) {
        if (!me.getDisabled()) {
            if (me.hasOwnProperty('pressedTimeout')) {
                clearTimeout(me.pressedTimeout);
                delete me.pressedTimeout;
            }
            else {
                me.element.removeCls(me.getPressedCls());
            }
        }
    },

    // @private
    onTap: function(e) {
        if (this.getDisabled()) {
            return false;
        }

        this.fireAction('tap', [this, e], 'doTap');
    },

    /**
     * @private
     */
    doTap: function(me, e) {
        var handler = me.getHandler(),
            scope = me.getScope() || me;

        if (!handler) {
            return;
        }

        if (typeof handler == 'string') {
            handler = scope[handler];
        }

        //this is done so if you hide the button in the handler, the tap event will not fire on the new element
        //where the button was.
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        handler.apply(scope, arguments);
    }
}, function() {
    //<deprecated product=touch since=2.0>

    /**
     * Updates the badge text.
     * @method setBadge
     * @param {String} text
     * @deprecated 2.0.0 Please use {@link #setBadgeText} instead.
     */
    Ext.deprecateClassMethod(this, 'setBadge', 'setBadgeText');

    /**
     * Updates the icon class
     * @method setIconClass
     * @param {String} iconClass
     * @deprecated 2.0.0 Please use {@link #setIconCls} instead.
     */
    Ext.deprecateClassMethod(this, 'setIconClass', 'setIconCls');

    this.override({
        constructor: function(config) {
            if (config) {
                /**
                 * @cfg {String} badge
                 * Optional badge text.
                 * @deprecated 2.0.0 Please use {@link #badgeText} instead
                 */
                if (config.hasOwnProperty('badge')) {
                    //<debug warn>
                    Ext.Logger.deprecate("'badge' config is deprecated, please use 'badgeText' config instead", this);
                    //</debug>
                    config.badgeText = config.badge;
                    delete config.badge;
                }
            }

            this.callParent([config]);
        }
    });

    //</deprecated>
});
