/**
 * @author Robert Dougan <rob@sencha.com>
 *
 * NavigationView is basically a {@link Ext.Container} with a {@link Ext.layout.Card card} layout, so only one view
 * can be visible at a time. However, NavigationView also adds extra functionality on top of this to allow
 * you to `push` and `pop` views at any time. When you do this, your NavigationView will automatically animate
 * between your current active view, and the new view you want to `push`, or the previous view you want to `pop`.
 *
 * Using the NavigationView is very simple. Here is a basic example of it in action:
 *
 *     @example
 *     var view = Ext.create('Ext.NavigationView', {
 *         fullscreen: true,
 *
 *         items: [{
 *             title: 'First',
 *             items: [{
 *                 xtype: 'button',
 *                 text: 'Push a new view!',
 *                 handler: function() {
 *                     // use the push() method to push another view. It works much like
 *                     // add() or setActiveItem(). it accepts a view instance, or you can give it
 *                     // a view config.
 *                     view.push({
 *                         title: 'Second',
 *                         html: 'Second view!'
 *                     });
 *                 }
 *             }]
 *         }]
 *     });
 *
 * Now, here comes the fun part: you can push any view/item into the NavigationView, at any time, and it will
 * automatically handle the animations between the two views, including adding a back button (if necessary)
 * and showing the new title.
 *
 *     view.push({
 *         title: 'A new view',
 *         html: 'Some new content'
 *     });
 *
 * As you can see, it is as simple as calling the {@link #method-push} method, with a new view (instance or object). Done.
 *
 * You can also `pop` a view at any time. This will remove the top-most view from the NavigationView, and animate back
 * to the previous view. You can do this using the {@link #method-pop} method (which requires no arguments).
 *
 *     view.pop();
 *
 *  Applications that need compatibility with ##Older Android## devices will want to see the {@link #layout} config for details on
 *  disabling navigation view animations as these devices have poor animation support and performance.
 *
 * @aside guide navigation_view
 */
Ext.define('Ext.navigation.View', {
    extend: 'Ext.Container',
    alternateClassName: 'Ext.NavigationView',
    xtype: 'navigationview',
    requires: ['Ext.navigation.Bar'],

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'navigationview',

        /**
         * @cfg {Boolean/Object} navigationBar
         * The NavigationBar used in this navigation view. It defaults to be docked to the top.
         *
         * You can just pass in a normal object if you want to customize the NavigationBar. For example:
         *
         *     navigationBar: {
         *         ui: 'dark',
         *         docked: 'bottom'
         *     }
         *
         * You **cannot** specify a *title* property in this configuration. The title of the navigationBar is taken
         * from the configuration of this views children:
         *
         *     view.push({
         *         title: 'This views title which will be shown in the navigation bar',
         *         html: 'Some HTML'
         *     });
         *
         * @accessor
         */
        navigationBar: {
            docked: 'top'
        },

        /**
         * @cfg {String} defaultBackButtonText
         * The text to be displayed on the back button if:
         *
         * - The previous view does not have a title.
         * - The {@link #useTitleForBackButtonText} configuration is `true`.
         * @accessor
         */
        defaultBackButtonText: 'Back',

        /**
         * @cfg {Boolean} useTitleForBackButtonText
         * Set to `false` if you always want to display the {@link #defaultBackButtonText} as the text
         * on the back button. `true` if you want to use the previous views title.
         * @accessor
         */
        useTitleForBackButtonText: false,

        /**
         * @cfg {Array/Object} items The child items to add to this NavigationView. This is usually an array of Component
         * configurations or instances, for example:
         *
         *     Ext.create('Ext.Container', {
         *         items: [
         *             {
         *                 xtype: 'panel',
         *                 title: 'My title',
         *                 html: 'This is an item'
         *             }
         *         ]
         *     });
         *
         * If you want a title to be displayed in the {@link #navigationBar}, you must specify a `title` configuration in your
         * view, like above.
         *
         * __Note:__ Only one view will be visible at a time. If you want to change to another view, use the {@link #method-push} or
         * {@link #setActiveItem} methods.
         * @accessor
         */

        /**
         * @cfg {Object}
         * Layout used in this navigation view, type must be set to 'card'.
         * **Android NOTE:** Older Android devices have poor animation performance. It is recommended to set the animation to null, for example:
         *
         *      layout: {
         *          type: 'card',
         *          animation: null
         *      }
         *
         * @accessor
         */
        layout: {
            type: 'card',
            animation: {
                duration: 300,
                easing: 'ease-out',
                type: 'slide',
                direction: 'left'
            }
        }
    },

    /**
     * @event push
     * Fires when a view is pushed into this navigation view
     * @param {Ext.navigation.View} this The component instance
     * @param {Mixed} view The view that has been pushed
     */

    /**
     * @event pop
     * Fires when a view is popped from this navigation view
     * @param {Ext.navigation.View} this The component instance
     * @param {Mixed} view The view that has been popped
     */

    /**
     * @event back
     * Fires when the back button in the navigation view was tapped.
     * @param {Ext.navigation.View} this The component instance\
     */

    platformConfig: [{
        theme: ['Blackberry'],
        navigationBar: {
            splitNavigation: true
        }
    }],

    // @private
    initialize: function() {
        var me     = this,
            navBar = me.getNavigationBar();

        //add a listener onto the back button in the navigationbar
        if (navBar) {
            navBar.on({
                back: me.onBackButtonTap,
                scope: me
            });

            me.relayEvents(navBar, 'rightbuttontap');

            me.relayEvents(me, {
                add: 'push',
                remove: 'pop'
            });
        }

        //<debug>
        var layout = me.getLayout();
        if (layout && !layout.isCard) {
            Ext.Logger.error('The base layout for a NavigationView must always be a Card Layout');
        }
        //</debug>
    },

    /**
     * @private
     */
    applyLayout: function(config) {
        config = config || {};

        return config;
    },

    /**
     * @private
     * Called when the user taps on the back button
     */
    onBackButtonTap: function() {
        this.pop();
        this.fireEvent('back', this);
    },

    /**
     * Pushes a new view into this navigation view using the default animation that this view has.
     * @param {Object} view The view to push.
     * @return {Ext.Component} The new item you just pushed.
     */
    push: function(view) {
        return this.add(view);
    },

    /**
     * Removes the current active view from the stack and sets the previous view using the default animation
     * of this view. You can also pass a {@link Ext.ComponentQuery} selector to target what inner item to pop to.
     * @param {Number/String/Object} count If a Number, the number of views you want to pop. If a String, the pops to a matching
     * component query. If an Object, the pops to a matching view instance.
     * @return {Ext.Component} The new active item
     */
    pop: function(count) {
        if (this.beforePop(count)) {
            return this.doPop();
        }
    },

    /**
     * @private
     * Calculates whether it needs to remove any items from the stack when you are popping more than 1
     * item. If it does, it removes those views from the stack and returns `true`.
     * @return {Boolean} `true` if it has removed views.
     */
    beforePop: function(count) {
        var me = this,
            innerItems = me.getInnerItems();

        if (Ext.isString(count) || Ext.isObject(count)) {
            var last = innerItems.length - 1,
                i;

            for (i = last; i >= 0; i--) {
                if ((Ext.isString(count) && Ext.ComponentQuery.is(innerItems[i], count)) || (Ext.isObject(count) && count == innerItems[i])) {
                    count = last - i;
                    break;
                }
            }

            if (!Ext.isNumber(count)) {
                return false;
            }
        }

        var ln = innerItems.length,
            toRemove;

        //default to 1 pop
        if (!Ext.isNumber(count) || count < 1) {
            count = 1;
        }

        //check if we are trying to remove more items than we have
        count = Math.min(count, ln - 1);

        if (count) {
            //we need to reset the backButtonStack in the navigation bar
            me.getNavigationBar().beforePop(count);

            //get the items we need to remove from the view and remove theme
            toRemove = innerItems.splice(-count, count - 1);
            for (i = 0; i < toRemove.length; i++) {
                this.remove(toRemove[i]);
            }

            return true;
        }

        return false;
    },

    /**
     * @private
     */
    doPop: function() {
        var me = this,
            innerItems = this.getInnerItems();

        //set the new active item to be the new last item of the stack
        me.remove(innerItems[innerItems.length - 1]);

        // Hide the backButton
        if (innerItems.length < 3 && this.$backButton) {
            this.$backButton.hide();
        }

        // Update the title container
        if (this.$titleContainer) {
            //<debug>
            if (!this.$titleContainer.setTitle) {
                Ext.Logger.error('You have selected to display a title in a component that does not \
                    support titles in NavigationView. Please remove the `title` configuration from your \
                    NavigationView item, or change it to a component that has a `setTitle` method.');
            }
            //</debug>

            var item = innerItems[innerItems.length - 2];
            this.$titleContainer.setTitle((item.getTitle) ? item.getTitle() : item.config.title);
        }

        return this.getActiveItem();
    },

    /**
     * Returns the previous item, if one exists.
     * @return {Mixed} The previous view
     */
    getPreviousItem: function() {
        var innerItems = this.getInnerItems();
        return innerItems[innerItems.length - 2];
    },

    /**
     * Updates the backbutton text accordingly in the {@link #navigationBar}
     * @private
     */
    updateUseTitleForBackButtonText: function(useTitleForBackButtonText) {
        var navigationBar = this.getNavigationBar();
        if (navigationBar) {
            navigationBar.setUseTitleForBackButtonText(useTitleForBackButtonText);
        }
    },

    /**
     * Updates the backbutton text accordingly in the {@link #navigationBar}
     * @private
     */
    updateDefaultBackButtonText: function(defaultBackButtonText) {
        var navigationBar = this.getNavigationBar();
        if (navigationBar) {
            navigationBar.setDefaultBackButtonText(defaultBackButtonText);
        }
    },

    // @private
    applyNavigationBar: function(config) {
        if (!config) {
            config = {
                hidden: true,
                docked: 'top'
            };
        }

        if (config.title) {
            delete config.title;
            //<debug>
            Ext.Logger.warn("Ext.navigation.View: The 'navigationBar' configuration does not accept a 'title' property. You " +
                            "set the title of the navigationBar by giving this navigation view's children a 'title' property.");
            //</debug>
        }

        config.view = this;
        config.useTitleForBackButtonText = this.getUseTitleForBackButtonText();

        if (config.splitNavigation) {
            this.$titleContainer = this.add({
                docked: 'top',
                xtype: 'titlebar',
                ui: 'light',
                title: this.$currentTitle || ''
            });

            var containerConfig = (config.splitNavigation === true) ? {} : config.splitNavigation;

            this.$backButtonContainer = this.add(Ext.apply({
                xtype: 'toolbar',
                docked: 'bottom'
            }, containerConfig));

            this.$backButton = this.$backButtonContainer.add({
                xtype: 'button',
                text: 'Back',
                hidden: true,
                ui: 'back'
            });

            this.$backButton.on({
                scope: this,
                tap: this.onBackButtonTap
            });

            config = {
                hidden: true,
                docked: 'top'
            };
        }

        return Ext.factory(config, Ext.navigation.Bar, this.getNavigationBar());
    },

    // @private
    updateNavigationBar: function(newNavigationBar, oldNavigationBar) {
        if (oldNavigationBar) {
            this.remove(oldNavigationBar, true);
        }

        if (newNavigationBar) {
            this.add(newNavigationBar);
        }
    },

    /**
     * @private
     */
    applyActiveItem: function(activeItem, currentActiveItem) {
        var me = this,
            innerItems = me.getInnerItems();

        // Make sure the items are already initialized
        me.getItems();

        // If we are not initialzed yet, we should set the active item to the last item in the stack
        if (!me.initialized) {
            activeItem = innerItems.length - 1;
        }

        return this.callParent([activeItem, currentActiveItem]);
    },

    doResetActiveItem: function(innerIndex) {
        var me = this,
            innerItems = me.getInnerItems(),
            animation = me.getLayout().getAnimation();

        if (innerIndex > 0) {
            if (animation && animation.isAnimation) {
                animation.setReverse(true);
            }
            me.setActiveItem(innerIndex - 1);
            me.getNavigationBar().onViewRemove(me, innerItems[innerIndex], innerIndex);
        }
    },

    /**
     * @private
     */
    doRemove: function() {
        var animation = this.getLayout().getAnimation();

        if (animation && animation.isAnimation) {
            animation.setReverse(false);
        }

        this.callParent(arguments);
    },

    /**
     * @private
     */
    onItemAdd: function(item, index) {

        // Check for title configuration
        if (item && item.getDocked() && item.config.title === true) {
            this.$titleContainer = item;
        }

        this.doItemLayoutAdd(item, index);

        var navigaitonBar = this.getInitialConfig().navigationBar;

        if (!this.isItemsInitializing && item.isInnerItem()) {
            this.setActiveItem(item);

            // Update the navigationBar
            if (navigaitonBar) {
                this.getNavigationBar().onViewAdd(this, item, index);
            }

            // Update the custom backButton
            if (this.$backButtonContainer) {
                this.$backButton.show();
            }
        }

        if (item && item.isInnerItem()) {
            // Update the title container title
            this.updateTitleContainerTitle((item.getTitle) ? item.getTitle() : item.config.title);
        }

        if (this.initialized) {
            this.fireEvent('add', this, item, index);
        }
    },

    /**
     * @private
     * Updates the title of the titleContainer, if it exists
     */
    updateTitleContainerTitle: function(title) {
        if (this.$titleContainer) {
            //<debug>
            if (!this.$titleContainer.setTitle) {
                Ext.Logger.error('You have selected to display a title in a component that does not \
                    support titles in NavigationView. Please remove the `title` configuration from your \
                    NavigationView item, or change it to a component that has a `setTitle` method.');
            }
            //</debug>

            this.$titleContainer.setTitle(title);
        }
        else {
            this.$currentTitle = title;
        }
    },

    /**
     * Resets the view by removing all items between the first and last item.
     * @return {Ext.Component} The view that is now active
     */
    reset: function() {
        return this.pop(this.getInnerItems().length);
    }
});
