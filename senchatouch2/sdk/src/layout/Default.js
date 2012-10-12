(function(clsPrefix) {

/**
 * @aside guide layouts
 * @aside video layouts
 *
 * The Default Layout is the layout that all other layouts inherit from. The main capability it provides is docking,
 * which means that every other layout can also provide docking support. It's unusual to use Default layout directly,
 * instead it's much more common to use one of the sub classes:
 *
 * * {@link Ext.layout.HBox hbox layout}
 * * {@link Ext.layout.VBox vbox layout}
 * * {@link Ext.layout.Card card layout}
 * * {@link Ext.layout.Fit fit layout}
 *
 * For a full overview of layouts check out the [Layout Guide](#!/guide/layouts).
 *
 * ## Docking
 *
 * Docking enables you to place additional Components at the top, right, bottom or left edges of the parent Container,
 * resizing the other items as necessary. For example, let's say we're using an {@link Ext.layout.HBox hbox layout}
 * with a couple of items and we want to add a banner to the top so that we end up with something like this:
 *
 * {@img ../guides/layouts/docktop.jpg}
 *
 * This is simple to achieve with the `docked: 'top'` configuration below. We can dock as many of the items as we like,
 * to either the top, right, bottom or left edges of the Container:
 *
 *     Ext.create('Ext.Container', {
 *         fullscreen: true,
 *         layout: 'hbox',
 *         items: [
 *             {
 *                 docked: 'top',
 *                 height: 20,
 *                 html: 'This is docked to the top'
 *             },
 *             {
 *                 html: 'message list',
 *                 flex: 1
 *             },
 *             {
 *                 html: 'message preview',
 *                 flex: 2
 *             }
 *         ]
 *     });
 *
 * Similarly, to dock something to the left of a layout (a {@link Ext.layout.VBox vbox} in this case), such as the
 * following:
 *
 * {@img ../guides/layouts/dockleft.jpg}
 *
 * We can simply dock to the left:
 *
 *     Ext.create('Ext.Container', {
 *         fullscreen: true,
 *         layout: 'vbox',
 *         items: [
 *             {
 *                 docked: 'left',
 *                 width: 100,
 *                 html: 'This is docked to the left'
 *             },
 *             {
 *                 html: 'message list',
 *                 flex: 1
 *             },
 *             {
 *                 html: 'message preview',
 *                 flex: 2
 *             }
 *         ]
 *     });
 *
 * We can also dock to the bottom and right and use other layouts than hbox and vbox ({@link Ext.layout.Card card} and
 * {@link Ext.layout.Fit fit} layouts both accept docking too).
 */
Ext.define('Ext.layout.Default', {
    extend: 'Ext.Evented',

    alternateClassName: ['Ext.layout.AutoContainerLayout', 'Ext.layout.ContainerLayout'],

    alias: ['layout.auto', 'layout.default'],

    isLayout: true,

    hasDockedItemsCls: clsPrefix + 'hasdocked',

    centeredItemCls: clsPrefix + 'centered',

    floatingItemCls: clsPrefix + 'floating',

    dockingWrapperCls: clsPrefix + 'docking',

    dockingInnerCls: clsPrefix + 'docking-inner',

    maskCls: clsPrefix + 'mask',

    positionMap: {
        top: 'start',
        left: 'start',
        bottom: 'end',
        right: 'end'
    },

    positionDirectionMap: {
        top: 'vertical',
        bottom: 'vertical',
        left: 'horizontal',
        right: 'horizontal'
    },

    DIRECTION_VERTICAL: 'vertical',

    DIRECTION_HORIZONTAL: 'horizontal',

    POSITION_START: 'start',

    POSITION_END: 'end',

    config: {
        /**
         * @cfg {Ext.fx.layout.Card} animation Layout animation configuration
         * Controls how layout transitions are animated.  Currently only available for
         * Card Layouts
         * @accessor
         */
        animation: null
    },

    constructor: function(container, config) {
        this.container = container;

        this.innerItems = [];

        this.centeringWrappers = {};

        this.initConfig(config);
    },

    reapply: Ext.emptyFn,

    unapply: Ext.emptyFn,

    onItemAdd: function() {
        this.doItemAdd.apply(this, arguments);
    },

    onItemRemove: function() {
        this.doItemRemove.apply(this, arguments);
    },

    onItemMove: function() {
        this.doItemMove.apply(this, arguments);
    },

    onItemCenteredChange: function() {
        this.doItemCenteredChange.apply(this, arguments);
    },

    onItemFloatingChange: function() {
        this.doItemFloatingChange.apply(this, arguments);
    },

    onItemDockedChange: function() {
        this.doItemDockedChange.apply(this, arguments);
    },

    /**
     * @private
     */
    doItemAdd: function(item, index) {
        var docked = item.getDocked();

        if (docked !== null) {
            this.dockItem(item, docked);
        }
        else if (item.isCentered()) {
            this.centerItem(item, index);
        }
        else {
            this.insertItem(item, index);
        }

        if (item.isFloating()) {
            this.onItemFloatingChange(item, true);
        }
    },

    /**
     * @private
     */
    doItemRemove: function(item) {
        if (item.isDocked()) {
            this.undockItem(item);
        }
        else if (item.isCentered()) {
            this.uncenterItem(item);
        }

        if (item.getTranslatable()) {
            item.setTranslatable(false);
        }

        Ext.Array.remove(this.innerItems, item);

        Ext.fly(item.renderElement).destroy();
    },

    /**
     * @private
     */
    doItemMove: function(item, toIndex, fromIndex) {
        if (item.isCentered()) {
            item.setZIndex((toIndex + 1) * 2);
        }
        else {
            if (item.isFloating()) {
                item.setZIndex((toIndex + 1) * 2);
            }
            this.insertItem(item, toIndex);
        }
    },

    /**
     * @private
     */
    doItemCenteredChange: function(item, centered) {
        if (centered) {
            this.centerItem(item);
        }
        else {
            this.uncenterItem(item);
        }
    },

    /**
     * @private
     */
    doItemFloatingChange: function(item, floating) {
        var element = item.element,
            floatingItemCls = this.floatingItemCls;

        if (floating) {
            if (item.getZIndex() === null) {
                item.setZIndex((this.container.indexOf(item) + 1) * 2);
            }
            element.addCls(floatingItemCls);
        }
        else {
            item.setZIndex(null);
            element.removeCls(floatingItemCls);
        }
    },

    /**
     * @private
     */
    doItemDockedChange: function(item, docked, oldDocked) {
        if (oldDocked) {
            this.undockItem(item, oldDocked);
        }

        if (docked) {
            this.dockItem(item, docked);
        }
    },

    centerItem: function(item) {
        this.insertItem(item, 0);

        if (item.getZIndex() === null) {
            item.setZIndex((this.container.indexOf(item) + 1) * 2);
        }

        this.createCenteringWrapper(item);

        // Mainly for styling
        item.element.addCls(this.floatingItemCls);
    },

    uncenterItem: function(item) {
        this.destroyCenteringWrapper(item);
        item.setZIndex(null);
        this.insertItem(item, this.container.indexOf(item));

        // Mainly for styling
        item.element.removeCls(this.floatingItemCls);
    },

    dockItem: function(item, position) {
        var container = this.container,
            itemRenderElement = item.renderElement,
            itemElement = item.element,
            dockingInnerElement = this.dockingInnerElement;

        if (!dockingInnerElement) {
            container.setUseBodyElement(true);
            this.dockingInnerElement = dockingInnerElement = container.bodyElement;
        }

        this.getDockingWrapper(position);

        if (this.positionMap[position] === this.POSITION_START) {
            itemRenderElement.insertBefore(dockingInnerElement);
        }
        else {
            itemRenderElement.insertAfter(dockingInnerElement);
        }

        itemElement.addCls(clsPrefix + 'docked-' + position);
    },

    undockItem: function(item, docked) {
        this.insertItem(item, this.container.indexOf(item));
        item.element.removeCls(clsPrefix + 'docked-' + docked);
    },

    getDockingWrapper: function(position) {
        var currentDockingDirection = this.currentDockingDirection,
            direction = this.positionDirectionMap[position],
            dockingWrapper = this.dockingWrapper;

        if (currentDockingDirection !== direction) {
            this.currentDockingDirection = direction;
            this.dockingWrapper = dockingWrapper = this.createDockingWrapper(direction);
        }

        return dockingWrapper;
    },

    createDockingWrapper: function(direction) {
        return this.dockingInnerElement.wrap({
            classList: [this.dockingWrapperCls + '-' + direction]
        }, true);
    },

    createCenteringWrapper: function(item) {
        var id = item.getId(),
            wrappers = this.centeringWrappers,
            renderElement = item.renderElement,
            wrapper;

        wrappers[id] = wrapper = renderElement.wrap({
            className: this.centeredItemCls
        });

        return wrapper;
    },

    destroyCenteringWrapper: function(item) {
        var id = item.getId(),
            wrappers = this.centeringWrappers,
            renderElement = item.renderElement,
            wrapper = wrappers[id];

        renderElement.unwrap();
        wrapper.destroy();
        delete wrappers[id];

        return this;
    },

    getInnerItemsContainer: function() {
        return this.container.innerElement;
    },

    insertItem: function(item, index) {
       var container = this.container,
           items = container.getItems().items,
           innerItems = this.innerItems,
           containerDom = this.getInnerItemsContainer().dom,
           itemDom = item.renderElement.dom,
           relativeItem, relativeItemDom, domIndex;

       if (container.has(item)) {
           Ext.Array.remove(innerItems, item);
       }

       if (typeof index == 'number') {
           // Retrieve the *logical* relativeItem reference to insertBefore
           relativeItem = items[index];

           // If it is the item itself, get the next sibling
           if (relativeItem === item) {
               relativeItem = items[++index];
           }

           // Continue finding the relativeItem that is neither currently centered nor docked
           while (relativeItem && (relativeItem.isCentered() || relativeItem.isDocked())) {
               relativeItem = items[++index];
           }

           if (relativeItem) {
               // Retrieve the *physical* index of that relativeItem
               domIndex = innerItems.indexOf(relativeItem);

               if (domIndex !== -1) {
                   while (relativeItem && (relativeItem.isCentered() || relativeItem.isDocked())) {
                       relativeItem = innerItems[++domIndex];
                   }

                   if (relativeItem) {
                       innerItems.splice(domIndex, 0, item);

                       relativeItemDom = relativeItem.renderElement.dom;
                       containerDom.insertBefore(itemDom, relativeItemDom);

                       return this;
                   }
               }
           }
       }

       innerItems.push(item);
       containerDom.appendChild(itemDom);

       return this;
   }
});

})(Ext.baseCSSPrefix);
