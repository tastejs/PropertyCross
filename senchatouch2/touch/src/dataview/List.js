/**
 * @aside guide list
 * @aside video list
 *
 * List is a custom styled DataView which allows Grouping, Indexing, Icons, and a Disclosure. See the
 * [Guide](#!/guide/list) and [Video](#!/video/list) for more.
 *
 *     @example miniphone preview
 *     Ext.create('Ext.List', {
 *         fullscreen: true,
 *         itemTpl: '{title}',
 *         data: [
 *             { title: 'Item 1' },
 *             { title: 'Item 2' },
 *             { title: 'Item 3' },
 *             { title: 'Item 4' }
 *         ]
 *     });
 *
 * A more advanced example showing a list of people grouped by last name:
 *
 *     @example miniphone preview
 *     Ext.define('Contact', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: ['firstName', 'lastName']
 *         }
 *     });
 *
 *     var store = Ext.create('Ext.data.Store', {
 *        model: 'Contact',
 *        sorters: 'lastName',
 *
 *        grouper: {
 *            groupFn: function(record) {
 *                return record.get('lastName')[0];
 *            }
 *        },
 *
 *        data: [
 *            { firstName: 'Tommy',   lastName: 'Maintz'  },
 *            { firstName: 'Rob',     lastName: 'Dougan'  },
 *            { firstName: 'Ed',      lastName: 'Spencer' },
 *            { firstName: 'Jamie',   lastName: 'Avins'   },
 *            { firstName: 'Aaron',   lastName: 'Conran'  },
 *            { firstName: 'Dave',    lastName: 'Kaneda'  },
 *            { firstName: 'Jacky',   lastName: 'Nguyen'  },
 *            { firstName: 'Abraham', lastName: 'Elias'   },
 *            { firstName: 'Jay',     lastName: 'Robinson'},
 *            { firstName: 'Nigel',   lastName: 'White'   },
 *            { firstName: 'Don',     lastName: 'Griffin' },
 *            { firstName: 'Nico',    lastName: 'Ferrero' },
 *            { firstName: 'Jason',   lastName: 'Johnston'}
 *        ]
 *     });
 *
 *     Ext.create('Ext.List', {
 *        fullscreen: true,
 *        itemTpl: '<div class="contact">{firstName} <strong>{lastName}</strong></div>',
 *        store: store,
 *        grouped: true
 *     });
 *
 * If you want to dock items to the bottom or top of a List, you can use the scrollDock configuration on child items in this List. The following example adds a button to the bottom of the List.
 *
 *     @example phone preview
 *     Ext.define('Contact', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: ['firstName', 'lastName']
 *         }
 *     });
 *
 *     var store = Ext.create('Ext.data.Store', {
 *        model: 'Contact',
 *        sorters: 'lastName',
 *
 *        grouper: {
 *            groupFn: function(record) {
 *                return record.get('lastName')[0];
 *            }
 *        },
 *
 *        data: [
 *            { firstName: 'Tommy',   lastName: 'Maintz'  },
 *            { firstName: 'Rob',     lastName: 'Dougan'  },
 *            { firstName: 'Ed',      lastName: 'Spencer' },
 *            { firstName: 'Jamie',   lastName: 'Avins'   },
 *            { firstName: 'Aaron',   lastName: 'Conran'  },
 *            { firstName: 'Dave',    lastName: 'Kaneda'  },
 *            { firstName: 'Jacky',   lastName: 'Nguyen'  },
 *            { firstName: 'Abraham', lastName: 'Elias'   },
 *            { firstName: 'Jay',     lastName: 'Robinson'},
 *            { firstName: 'Nigel',   lastName: 'White'   },
 *            { firstName: 'Don',     lastName: 'Griffin' },
 *            { firstName: 'Nico',    lastName: 'Ferrero' },
 *            { firstName: 'Jason',   lastName: 'Johnston'}
 *        ]
 *     });
 *
 *     Ext.create('Ext.List', {
 *         fullscreen: true,
 *         itemTpl: '<div class="contact">{firstName} <strong>{lastName}</strong></div>',
 *         store: store,
 *         items: [{
 *             xtype: 'button',
 *             scrollDock: 'bottom',
 *             docked: 'bottom',
 *             text: 'Load More...'
 *         }]
 *     });
 */
Ext.define('Ext.dataview.List', {
    alternateClassName: 'Ext.List',
    extend: 'Ext.dataview.DataView',
    xtype: 'list',

    mixins: ['Ext.mixin.Bindable'],

    requires: [
        'Ext.dataview.IndexBar',
        'Ext.dataview.ListItemHeader',
        'Ext.dataview.component.ListItem',
        'Ext.dataview.component.SimpleListItem',
        'Ext.util.PositionMap'
    ],

    /**
     * @event disclose
     * @preventable doDisclose
     * Fires whenever a disclosure is handled
     * @param {Ext.dataview.List} this The List instance
     * @param {Ext.data.Model} record The record associated to the item
     * @param {HTMLElement} target The element disclosed
     * @param {Number} index The index of the item disclosed
     * @param {Ext.EventObject} e The event object
     */

    config: {
        /**
         * @cfg layout
         * Hide layout config in DataView. It only causes confusion.
         * @accessor
         * @private
         */
        layout: 'fit',

        /**
         * @cfg {Boolean/Object} indexBar
         * `true` to render an alphabet IndexBar docked on the right.
         * This can also be a config object that will be passed to {@link Ext.IndexBar}.
         * @accessor
         */
        indexBar: false,

        icon: null,

        /**
         * @cfg {Boolean} preventSelectionOnDisclose `true` to prevent the item selection when the user
         * taps a disclose icon.
         * @accessor
         */
        preventSelectionOnDisclose: true,

        /**
         * @cfg baseCls
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'list',

        /**
         * @cfg {Boolean} pinHeaders
         * Whether or not to pin headers on top of item groups while scrolling for an iPhone native list experience.
         * @accessor
         */
        pinHeaders: true,

        /**
         * @cfg {Boolean} grouped
         * Whether or not to group items in the provided Store with a header for each item.
         * @accessor
         */
        grouped: false,

        /**
         * @cfg {Boolean/Function/Object} onItemDisclosure
         * `true` to display a disclosure icon on each list item.
         * The list will still fire the disclose event, and the event can be stopped before itemtap.
         * By setting this config to a function, the function passed will be called when the disclosure
         * is tapped.
         * Finally you can specify an object with a 'scope' and 'handler'
         * property defined. This will also be bound to the tap event listener
         * and is useful when you want to change the scope of the handler.
         * @accessor
         */
        onItemDisclosure: null,

        /**
         * @cfg {String} disclosureProperty
         * A property to check on each record to display the disclosure on a per record basis.  This
         * property must be false to prevent the disclosure from being displayed on the item.
         * @accessor
         */
        disclosureProperty: 'disclosure',

        /**
         * @cfg {String} ui
         * The style of this list. Available options are `normal` and `round`.
         * Please note: if you use the `round` UI, {@link #pinHeaders} will be automatically turned off as
         * it is not supported.
         */
        ui: 'normal',

        /**
         * @cfg {Boolean} useComponents
         * Flag the use a component based DataView implementation.  This allows the full use of components in the
         * DataView at the cost of some performance.
         *
         * Checkout the [DataView Guide](#!/guide/dataview) for more information on using this configuration.
         * @accessor
         * @private
         */

        /**
         * @cfg {Object} itemConfig
         * A configuration object that is passed to every item created by a component based DataView. Because each
         * item that a List renders is a Component, we can pass configuration options to each component to
         * easily customize how each child component behaves.
         * @accessor
         * @private
         */

        /**
         * @cfg {Number} maxItemCache
         * Maintains a cache of reusable components when using a component based DataView.  Improving performance at
         * the cost of memory.
         * Note this is currently only used when useComponents is true.
         * @accessor
         * @private
         */

        /**
         * @cfg {String} defaultType
         * The xtype used for the component based DataView. Defaults to dataitem.
         * Note this is only used when useComponents is true.
         * @accessor
         */
        defaultType: undefined,

        /**
         * @cfg {Object} itemMap
         * @private
         */
        itemMap: {},

        /**
         * @cfg {Number} itemHeight
         * This allows you to set the default item height and is used to roughly calculate the amount
         * of items needed to fill the list. By default items are around 50px high.
         */
        itemHeight: 47,

        /**
         * @cfg {Boolean} variableHeights
         * This configuration allows you optimize the list by not having it read the DOM heights of list items.
         * Instead it will assume (and set) the height to be the {@link #itemHeight}.
         */
        variableHeights: false,

        /**
         * @cfg {Boolean} refreshHeightOnUpdate
         * Set this to false if you make many updates to your list (like in an interval), but updates
         * won't affect the item's height. Doing this will increase the performance of these updates.
         */
        refreshHeightOnUpdate: true,

        /**
         * @cfg {Boolean} infinite
         * Set this to false to render all items in this list, and render them relatively.
         * Note that this configuration can not be dynamically changed after the list has instantiated.
         */
        infinite: false,

        /**
         * @cfg {Boolean} useSimpleItems
         * Set this to true if you just want to have the list create simple items that use the itemTpl.
         * These simple items still support headers, grouping and disclosure functionality but avoid
         * container layouts and deeply nested markup. For many Lists using this configuration will
         * drastically increase the scrolling and render performance.
         */
        useSimpleItems: true,

        scrollable: null
    },

    platformConfig: [{
        theme: ['Windows'],
        itemHeight: 44
    }],

    topItemIndex: 0,

    constructor: function() {
        var me = this, layout;

        me.callParent(arguments);

        //<debug>
        layout = this.getLayout();
        if (layout && !layout.isFit) {
            Ext.Logger.error('The base layout for a DataView must always be a Fit Layout');
        }
        //</debug>
    },

    // We create complex instance arrays and objects in beforeInitialize so that we can use these inside of the initConfig process.
    beforeInitialize: function() {
        var me = this,
            container, scrollable, scrollViewElement, pinnedHeader;

        Ext.apply(me, {
            listItems: [],
            headerItems: [],
            updatedItems: [],
            headerMap: [],
            scrollDockItems: {
                top: [],
                bottom: []
            }
        });

        // We determine the translation methods for headers and items within this List based
        // on the best strategy for the device
        this.translationMethod = Ext.browser.is.AndroidStock2 ? 'cssposition' : 'csstransform';

        // Create the inner container that will actually hold all the list items
        container = me.container = Ext.factory({
            xtype: 'container',
            scrollable: {
                scroller: {
                    autoRefresh: !me.getInfinite(),
                    direction: 'vertical'
                }
            }
        });

        // We add the container after creating it manually because when you add the container,
        // the items config is initialized. When this happens, any scrollDock items will be added,
        // which in turn tries to add these items to the container
        me.add(container);

        // We make this List's scrollable the inner containers scrollable
        scrollable = container.getScrollable();
        scrollViewElement = me.scrollViewElement = scrollable.getElement();
        me.scrollElement = scrollable.getScroller().getElement();

        me.setScrollable(scrollable);
        me.scrollableBehavior = container.getScrollableBehavior();

        // Create the pinnedHeader instance thats being used when grouping is enabled
        // and insert it into the scrollElement
        pinnedHeader = me.pinnedHeader = Ext.factory({
            xtype: 'listitemheader',
            html: '&nbsp;',
            translatable: {
                translationMethod: this.translationMethod
            },
            cls: ['x-list-header', 'x-list-header-swap']
        });
        pinnedHeader.translate(0, -10000);
        pinnedHeader.$position = -10000;
        scrollViewElement.insertFirst(pinnedHeader.renderElement);

        // We want to intercept any translate calls made on the scroller to perform specific list logic
        me.bind(scrollable.getScroller().getTranslatable(), 'doTranslate', 'onTranslate');
    },

    // We override DataView's initialize method with an empty function
    initialize: function() {
        var me = this,
            container = me.container,
            scrollViewElement = me.scrollViewElement,
            indexBar = me.getIndexBar();

        if (indexBar) {
            scrollViewElement.appendChild(indexBar.renderElement);
        }

        me.on(me.getTriggerCtEvent(), me.onContainerTrigger, me);
        me.on(me.getTriggerEvent(), me.onItemTrigger, me);

        container.element.on({
            delegate: '.' + me.getBaseCls() + '-disclosure',
            tap: 'handleItemDisclosure',
            scope: me
        });

        container.element.on({
            resize: 'onContainerResize',
            scope: me
        });

        // Android 2.x not a direct child
        container.innerElement.on({
            touchstart: 'onItemTouchStart',
            touchend: 'onItemTouchEnd',
            tap: 'onItemTap',
            taphold: 'onItemTapHold',
            singletap: 'onItemSingleTap',
            doubletap: 'onItemDoubleTap',
            swipe: 'onItemSwipe',
            delegate: '.' + Ext.baseCSSPrefix + 'list-item',
            scope: me
        });

        if (me.getStore()) {
            me.refresh();
        }
    },

    onTranslate: function(x, y) {
        var me = this,
            pinnedHeader = me.pinnedHeader,
            store = me.getStore(),
            storeCount = store && store.getCount(),
            grouped = me.getGrouped(),
            infinite = me.getInfinite();

        if (!storeCount) {
            me.showEmptyText();
            me.showEmptyScrollDock();

            pinnedHeader.$position = -10000;
            pinnedHeader.translate(0, -10000);
        }
        else if (infinite && me.itemsCount) {
            me.handleItemUpdates(y);
            me.handleItemHeights();
            me.handleItemTransforms();
        }

        if (grouped && me.groups.length && me.getPinHeaders()) {
            me.handlePinnedHeader(y);
        }
    },

    handleItemUpdates: function(y) {
        var me = this,
            listItems = me.listItems,
            itemsCount = listItems.length,
            currentTopIndex = me.topItemIndex,
            info = me.getListItemInfo(),
            itemMap = me.getItemMap(),
            changedCount, i, item, topItemIndex;

        // This is the index of the item that is currently rendered at the top
        me.topItemIndex = topItemIndex = Math.max(0, itemMap.findIndex(-y) || 0);

        if (currentTopIndex !== topItemIndex) {
            // Scroll up
            if (currentTopIndex > topItemIndex) {
                changedCount = Math.min(itemsCount, currentTopIndex - topItemIndex);
                for (i = changedCount - 1; i >= 0; i--) {
                    item = listItems.pop();
                    listItems.unshift(item);
                    me.updateListItem(item, i + topItemIndex, info);
                }
            }
            else {
                // Scroll down
                changedCount = Math.min(itemsCount, topItemIndex - currentTopIndex);
                for (i = 0; i < changedCount; i++) {
                    item = listItems.shift();
                    listItems.push(item);
                    me.updateListItem(item, i + topItemIndex + itemsCount - changedCount, info);
                }
            }
        }
    },

    handleItemHeights: function() {
        var me = this,
            updatedItems = me.updatedItems,
            ln = updatedItems.length,
            itemMap = me.getItemMap(),
            useSimpleItems = me.getUseSimpleItems(),
            scroller = me.container.getScrollable().getScroller(),
            minimumHeight = itemMap.getMinimumHeight(),
            headerIndices = me.headerIndices,
            headerMap = me.headerMap,
            translatable = scroller.getTranslatable(),
            variableHeights = me.getVariableHeights(),
            itemIndex, i, j, jln, item, height, scrollDockHeight;

        for (i = 0; i < ln; i++) {
            item = updatedItems[i];
            itemIndex = item.$dataIndex;

            // itemIndex may not be set yet if the store is still being loaded
            if (itemIndex !== null) {
                if (variableHeights) {
                    height = useSimpleItems ? item.element.getHeight() : item.element.getFirstChild().getHeight();
                    height = Math.max(height, minimumHeight);
                } else {
                    height = minimumHeight;
                }

                item.$ownItemHeight = height;

                jln = me.scrollDockItems.top.length;
                if (item.isFirst) {
                    me.totalScrollDockTopHeight = 0;
                    for (j = 0; j < jln; j++) {
                        scrollDockHeight = me.scrollDockItems.top[j].$scrollDockHeight;
                        height += scrollDockHeight;
                        me.totalScrollDockTopHeight += scrollDockHeight;
                    }
                }

                jln = me.scrollDockItems.bottom.length;
                if (item.isLast) {
                    for (j = 0; j < jln; j++) {
                        scrollDockHeight = me.scrollDockItems.bottom[j].$scrollDockHeight;
                        height += scrollDockHeight;
                    }
                }

                if (headerIndices && headerIndices[itemIndex]) {
                    height += me.headerHeight;
                }

                itemMap.setItemHeight(itemIndex, height);
                item.$height = height;
            }
        }

        itemMap.update();
        height = itemMap.getTotalHeight();

        headerMap.length = 0;
        for (i in headerIndices) {
            if (headerIndices.hasOwnProperty(i)) {
                headerMap.push(itemMap.map[i]);
            }
        }

        if (height != scroller.givenSize) {
            scroller.setSize(height);
            scroller.refreshMaxPosition();
            scroller.fireEvent('refresh', scroller);

            if (translatable.isAnimating && translatable.activeEasingY && translatable.activeEasingY.setMinMomentumValue) {
                translatable.activeEasingY.setMinMomentumValue(-scroller.getMaxPosition().y);
            }
        }

        me.updatedItems.length = 0;
    },

    handleItemTransforms: function() {
        var me = this,
            listItems = me.listItems,
            itemsCount = listItems.length,
            itemMap = me.getItemMap(),
            scrollDockItems = me.scrollDockItems,
            grouped = me.getGrouped(),
            item, transY, i, jln, j;

        for (i = 0; i < itemsCount; i++) {
            item = listItems[i];
            transY = itemMap.map[item.$dataIndex];

            if (!item.$hidden && item.$position !== transY) {
                item.$position = transY;

                jln = scrollDockItems.top.length;
                if (item.isFirst && jln) {
                    for (j = 0; j < jln; j++) {
                        scrollDockItems.top[j].translate(0, transY);
                        transY += scrollDockItems.top[j].$scrollDockHeight;
                    }
                }

                if (grouped && me.headerIndices && me.headerIndices[item.$dataIndex]) {
                    item.getHeader().translate(0, transY);
                    transY += me.headerHeight;
                }

                item.translate(0, transY);
                transY += item.$ownItemHeight;

                jln = scrollDockItems.bottom.length;
                if (item.isLast && jln) {
                    for (j = 0; j < jln; j++) {
                        scrollDockItems.bottom[j].translate(0, transY);
                        transY += scrollDockItems.bottom[j].$scrollDockHeight;
                    }
                }
            }
        }
    },

    handlePinnedHeader: function(y) {
        var me = this,
            pinnedHeader = me.pinnedHeader,
            itemMap = me.getItemMap(),
            groups = me.groups,
            headerMap = me.headerMap,
            headerHeight = me.headerHeight,
            store = me.getStore(),
            totalScrollDockTopHeight = me.totalScrollDockTopHeight,
            record, closestHeader, pushedHeader, transY, headerString;

        closestHeader = itemMap.binarySearch(headerMap, -y);
        record = groups[closestHeader].children[0];

        if (record) {
            pushedHeader = y + headerMap[closestHeader + 1] - headerHeight;
            // Top of the list or above (hide the floating header offscreen)
            if (y >= 0 || (closestHeader === 0 && totalScrollDockTopHeight + y >= 0) || (closestHeader === 0 && -y <= headerMap[closestHeader])) {
                transY = -10000;
            }
            // Scroll the floating header a bit
            else if (pushedHeader < 0) {
                transY = pushedHeader;
            }
            // Stick to the top of the screen
            else {
                transY = Math.max(0, y);
            }

            headerString = store.getGroupString(record);

            if (pinnedHeader.$currentHeader != headerString) {
                pinnedHeader.setHtml(headerString);
                pinnedHeader.$currentHeader = headerString;
            }

            if (pinnedHeader.$position != transY) {
                pinnedHeader.translate(0, transY);
                pinnedHeader.$position = transY;
            }
        }
    },

    createItem: function(config) {
        var me = this,
            container = me.container,
            listItems = me.listItems,
            infinite = me.getInfinite(),
            scrollElement = me.scrollElement,
            item, header, itemCls;

        item = Ext.factory(config);
        item.dataview = me;
        item.$height = config.minHeight;

        header = item.getHeader();

        if (!infinite) {
            itemCls = me.getBaseCls() + '-item-relative';
            item.addCls(itemCls);
            header.addCls(itemCls);
        } else {
            header.setTranslatable({
                translationMethod: this.translationMethod
            });
            header.translate(0, -10000);

            scrollElement.insertFirst(header.renderElement);
        }

        container.doAdd(item);
        listItems.push(item);

        return item;
    },

    setItemsCount: function(itemsCount) {
        var me = this,
            listItems = me.listItems,
            config = me.getListItemConfig(),
            difference = itemsCount - listItems.length,
            i;

        // This loop will create new items if the new itemsCount is higher than the amount of items we currently have
        for (i = 0; i < difference; i++) {
            me.createItem(config);
        }

        // This loop will destroy unneeded items if the new itemsCount is lower than the amount of items we currently have
        for (i = difference; i < 0; i++) {
            listItems.pop().destroy();
        }

        me.itemsCount = itemsCount;

        // Finally we update all the list items with the correct content
        me.updateAllListItems();

        return me.listItems;
    },

    updateUi: function(newUi, oldUi) {
        if (newUi && newUi != oldUi && newUi == 'round') {
            this.setPinHeaders(false);
        }

        this.callParent(arguments);
    },

    updateListItem: function(item, index, info) {
        var me = this,
            record = info.store.getAt(index),
            headerIndices = me.headerIndices,
            footerIndices = me.footerIndices,
            header = item.getHeader(),
            scrollDockItems = me.scrollDockItems,
            updatedItems = me.updatedItems,
            currentItemCls = item.renderElement.classList,
            currentHeaderCls = header.renderElement.classList,
            infinite = me.getInfinite(),
            storeCount = info.store.getCount(),
            itemCls = [],
            headerCls = [],
            itemRemoveCls = [info.headerCls, info.footerCls, info.firstCls, info.lastCls, info.selectedCls],
            headerRemoveCls = [info.headerCls, info.footerCls, info.firstCls, info.lastCls],
            ln, i, scrollDockItem;

        // When we update a list item, the header and scrolldocks can make it have to be retransformed.
        // For that reason we want to always set the position to -10000 so that the next time we translate
        // all the pieces are transformed to the correct location
        if (infinite) {
            item.$position = -10000;
        }

        // We begin by hiding/showing the item and its header depending on a record existing at this index
        if (!record) {
            item.setRecord(null);
            if (infinite) {
                item.translate(0, -10000);
                header.translate(0, -10000);
            } else {
                item.hide();
                header.hide();
            }
            item.$hidden = true;
            return;
        } else if (item.$hidden) {
            if (!infinite) {
                item.show();
            }
            item.$hidden = false;
        }

        if (infinite) {
            updatedItems.push(item);
        }

        // If this item was previously used for the first record in the store, and now it will not be, then we hide
        // any scrollDockTop items and change the isFirst flag
        if (item.isFirst && index !== 0 && scrollDockItems.top.length) {
            for (i = 0, ln = scrollDockItems.top.length; i < ln; i++) {
                scrollDockItem = scrollDockItems.top[i];
                if (infinite) {
                    scrollDockItem.translate(0, -10000);
                }
            }
            item.isFirst = false;
        }

        // If this item was previously used for the last record in the store, and now it will not be, then we hide
        // any scrollDockBottom items and change the istLast flag
        if (item.isLast && index !== storeCount - 1 && scrollDockItems.bottom.length) {
            for (i = 0, ln = scrollDockItems.bottom.length; i < ln; i++) {
                scrollDockItem = scrollDockItems.bottom[i];
                if (infinite) {
                    scrollDockItem.translate(0, -10000);
                }
            }
            item.isLast = false;
        }

        // If the item is already bound to this record then we shouldn't have to do anything
        if (item.$dataIndex !== index) {
            item.$dataIndex = index;
            me.fireEvent('itemindexchange', me, record, index, item);
        }

        // This is where we actually update the item with the record
        if (item.getRecord() === record) {
            item.updateRecord(record);
        } else {
            item.setRecord(record);
        }

        if (me.isSelected(record)) {
            itemCls.push(info.selectedCls);
        }

        if (info.grouped) {
            if (headerIndices[index]) {
                itemCls.push(info.headerCls);
                headerCls.push(info.headerCls);
                header.setHtml(info.store.getGroupString(record));

                if (!infinite) {
                    header.renderElement.insertBefore(item.renderElement);
                    header.show();
                }
            } else {
                if (infinite) {
                    header.translate(0, -10000);
                } else {
                    header.hide();
                }
            }
            if (footerIndices[index]) {
                itemCls.push(info.footerCls);
                headerCls.push(info.footerCls);
            }
        }

        if (index === 0) {
            item.isFirst = true;
            itemCls.push(info.firstCls);
            headerCls.push(info.firstCls);

            if (!info.grouped) {
                itemCls.push(info.headerCls);
                headerCls.push(info.headerCls);
            }

            if (!infinite) {
                for (i = 0, ln = scrollDockItems.top.length; i < ln; i++) {
                    scrollDockItem = scrollDockItems.top[i];
                    scrollDockItem.renderElement.insertBefore(item.renderElement);
                }
            }
        }

        if (index === storeCount - 1) {
            item.isLast = true;
            itemCls.push(info.lastCls);
            headerCls.push(info.lastCls);

            if (!info.grouped) {
                itemCls.push(info.footerCls);
                headerCls.push(info.footerCls);
            }

            if (!infinite) {
                for (i = 0, ln = scrollDockItems.bottom.length; i < ln; i++) {
                    scrollDockItem = scrollDockItems.bottom[i];
                    scrollDockItem.renderElement.insertAfter(item.renderElement);
                }
            }
        }

        if (currentItemCls) {
            for (i = 0; i < itemRemoveCls.length; i++) {
                Ext.Array.remove(currentItemCls, itemRemoveCls[i]);
            }
            itemCls = Ext.Array.merge(itemCls, currentItemCls);
        }

        if (currentHeaderCls) {
            for (i = 0; i < headerRemoveCls.length; i++) {
                Ext.Array.remove(currentHeaderCls, headerRemoveCls[i]);
            }
            headerCls = Ext.Array.merge(headerCls, currentHeaderCls);
        }

        item.renderElement.setCls(itemCls);
        header.renderElement.setCls(headerCls);
    },

    updateAllListItems: function() {
        var me = this,
            store = me.getStore(),
            items = me.listItems,
            info = me.getListItemInfo(),
            topItemIndex = me.topItemIndex,
            i, ln;

        if (store) {
            for (i = 0, ln = items.length; i < ln; i++) {
                me.updateListItem(items[i], topItemIndex + i, info);
            }
        }

        if (me.isPainted()) {
            if (me.getInfinite() && store && store.getCount()) {
                me.handleItemHeights();
            }
            me.refreshScroller();
        }
    },

    doRefresh: function() {
        var me = this,
            infinite = me.getInfinite(),
            scroller = me.container.getScrollable().getScroller(),
            storeCount = me.getStore().getCount();

        if (infinite) {
            me.getItemMap().populate(storeCount, this.topItemIndex);
        }

        if (me.getGrouped()) {
            me.refreshHeaderIndices();
        }

        // This will refresh the items on the screen with the new data
        if (storeCount) {
            me.hideScrollDockItems();
            me.hideEmptyText();
            if (!infinite) {
                me.setItemsCount(storeCount);
                if (me.getScrollToTopOnRefresh()) {
                    scroller.scrollTo(0, 0);
                }
            } else {
                if (me.getScrollToTopOnRefresh()) {
                    me.topItemIndex = 0;
                    scroller.position.y = 0;
                }
                me.updateAllListItems();
            }
        } else {
            me.onStoreClear();
        }
    },

    onContainerResize: function(container, size) {
        var me = this;

        if (!me.headerHeight) {
            me.headerHeight = parseInt(me.pinnedHeader.renderElement.getHeight(), 10);
        }

        if (me.getInfinite()) {
            me.setItemsCount(Math.ceil(size.height / me.getItemMap().getMinimumHeight()) + 1);
        } else if (me.listItems.length && me.getGrouped() && me.getPinHeaders()) {
            // Whenever the container resizes, headers might be in different locations. For this reason
            // we refresh the header position map
            me.updateHeaderMap();
        }
    },

    refreshScroller: function() {
        var me = this;

        if (me.isPainted()) {
            if (!me.getInfinite() && me.getGrouped() && me.getPinHeaders()) {
                me.updateHeaderMap();
            }

            me.container.getScrollable().getScroller().refresh();
        }
    },

    updateHeaderMap: function() {
        var me = this,
            headerMap = me.headerMap,
            headerIndices = me.headerIndices,
            header, i;

        headerMap.length = 0;
        for (i in headerIndices) {
            if (headerIndices.hasOwnProperty(i)) {
                header = me.getItemAt(i).getHeader();
                headerMap.push(header.renderElement.dom.offsetTop);
            }
        }
    },

    applyDefaultType: function(defaultType) {
        if (!defaultType) {
            defaultType = this.getUseSimpleItems() ? 'simplelistitem' : 'listitem';
        }
        return defaultType;
    },

    applyItemMap: function(itemMap) {
        return Ext.factory(itemMap, Ext.util.PositionMap, this.getItemMap());
    },

    updateItemHeight: function(itemHeight) {
        this.getItemMap().setMinimumHeight(itemHeight);
    },

    applyIndexBar: function(indexBar) {
        return Ext.factory(indexBar, Ext.dataview.IndexBar, this.getIndexBar());
    },

    updatePinHeaders: function(pinnedHeaders) {
        if (this.isPainted()) {
            this.pinnedHeader.translate(0, pinnedHeaders ? this.pinnedHeader.$position : -10000);
        }
    },

    updateItemTpl: function(newTpl) {
        var me = this,
            listItems = me.listItems,
            ln = listItems.length || 0,
            i, listItem;

        for (i = 0; i < ln; i++) {
            listItem = listItems[i];
            listItem.setTpl(newTpl);
        }

        me.updateAllListItems();
    },

    updateItemCls: function(newCls, oldCls) {
        var items = this.listItems,
            ln = items.length,
            i, item;

        for (i = 0; i < ln; i++) {
            item = items[i];
            item.removeCls(oldCls);
            item.addCls(newCls);
        }
    },

    updateIndexBar: function(indexBar, oldIndexBar) {
        var me = this,
            scrollViewElement = me.scrollViewElement;

        if (oldIndexBar) {
            oldIndexBar.un({
                index: 'onIndex',
                scope: me
            });

            if (!indexBar) {
                me.element.removeCls(me.getBaseCls() + '-indexed');
            }

            if (scrollViewElement) {
                scrollViewElement.removeChild(oldIndexBar.renderElement);
            }
        }

        if (indexBar) {
            indexBar.on({
                index: 'onIndex',
                scope: me
            });

            if (!oldIndexBar) {
                me.element.addCls(me.getBaseCls() + '-indexed');
            }

            if (scrollViewElement) {
                scrollViewElement.appendChild(indexBar.renderElement);
            }
        }
    },

    updateGrouped: function(grouped) {
        var me = this,
            baseCls = this.getBaseCls(),
            pinnedHeader = me.pinnedHeader,
            cls = baseCls + '-grouped',
            unCls = baseCls + '-ungrouped';

        if (pinnedHeader) {
            pinnedHeader.translate(0, -10000);
        }

        if (grouped) {
            me.addCls(cls);
            me.removeCls(unCls);
        } else {
            me.addCls(unCls);
            me.removeCls(cls);
        }

        me.updateAllListItems();
    },

    // Handling adds and removes like this is fine for now. It should not perform much slower then a dedicated solution
    // TODO: implement logic to not do full refreshes when this list is non-infinite
    onStoreAdd: function() {
        this.doRefresh();
    },

    onStoreRemove: function() {
        this.doRefresh();
    },

    onStoreUpdate: function() {
        this.doRefresh();
    },

    onStoreClear: function() {
        var me = this;

        if (me.pinnedHeader) {
            me.pinnedHeader.translate(0, -10000);
        }

        // Reset the scroller to go to the top
        me.topItemIndex = 0;
        me.container.getScrollable().getScroller().position.y = 0;

        if (!me.getInfinite()) {
            me.setItemsCount(0);
        } else {
            me.updateAllListItems();
        }
    },

    showEmptyScrollDock: function() {
        var me = this,
            infinite = me.getInfinite(),
            scrollDockItems = me.scrollDockItems,
            offset = 0,
            i, ln, item;

        for (i = 0, ln = scrollDockItems.top.length; i < ln; i++) {
            item = scrollDockItems.top[i];
            if (infinite) {
                item.translate(0, offset);
                offset += item.$scrollDockHeight;
            } else {
                this.scrollElement.appendChild(item.renderElement);
            }
        }

        for (i = 0, ln = scrollDockItems.bottom.length; i < ln; i++) {
            item = scrollDockItems.bottom[i];
            if (infinite) {
                item.translate(0, offset);
                offset += item.$scrollDockHeight;
            } else {
                this.scrollElement.appendChild(item.renderElement);
            }
        }
    },

    hideScrollDockItems: function() {
        var me = this,
            infinite = me.getInfinite(),
            scrollDockItems = me.scrollDockItems,
            i, ln, item;

        if (!infinite) {
            return;
        }

        for (i = 0, ln = scrollDockItems.top.length; i < ln; i++) {
            item = scrollDockItems.top[i];
            item.translate(0, -10000);
        }

        for (i = 0, ln = scrollDockItems.bottom.length; i < ln; i++) {
            item = scrollDockItems.bottom[i];
            item.translate(0, -10000);
        }
    },

    /**
     * Returns an item at the specified index.
     * @param {Number} index Index of the item.
     * @return {Ext.dom.Element/Ext.dataview.component.DataItem} item Item at the specified index.
     */
    getItemAt: function(index) {
        var listItems = this.listItems,
            ln = listItems.length,
            i, listItem;

        for (i = 0; i < ln; i++) {
            listItem = listItems[i];
            if (listItem.$dataIndex == index) {
                return listItem;
            }
        }
    },

    /**
     * Returns an index for the specified item.
     * @param {Number} item The item to locate.
     * @return {Number} Index for the specified item.
     */
    getItemIndex: function(item) {
        return item.$dataIndex;
    },

    /**
     * Returns an array of the current items in the DataView.
     * @return {Ext.dom.Element[]/Ext.dataview.component.DataItem[]} Array of Items.
     */
    getViewItems: function() {
        return this.listItems;
    },

    getListItemInfo: function() {
        var me = this,
            baseCls = me.getBaseCls();

        return {
            store: me.getStore(),
            grouped: me.getGrouped(),
            baseCls: baseCls,
            selectedCls: me.getSelectedCls(),
            headerCls: baseCls + '-header-wrap',
            footerCls: baseCls + '-footer-wrap',
            firstCls: baseCls + '-item-first',
            lastCls: baseCls + '-item-last',
            itemMap: me.getItemMap(),
            defaultItemHeight: me.getItemHeight()
        };
    },

    getListItemConfig: function() {
        var me = this,
            minimumHeight = me.getItemMap().getMinimumHeight(),
            config = {
                xtype: me.getDefaultType(),
                itemConfig: me.getItemConfig(),
                tpl: me.getItemTpl(),
                minHeight: minimumHeight,
                cls: me.getItemCls()
            };

        if (me.getInfinite()) {
            config.translatable = {
                translationMethod: this.translationMethod
            };
        }

        if (!me.getVariableHeights()) {
            config.height = minimumHeight;
        }

        return config;
    },

    refreshHeaderIndices: function() {
        var me = this,
            store = me.getStore(),
            storeLn = store && store.getCount(),
            groups = store.getGroups(),
            groupLn = groups.length,
            headerIndices = me.headerIndices = {},
            footerIndices = me.footerIndices = {},
            i, previousIndex, firstGroupedRecord, storeIndex;

        me.groups = groups;

        for (i = 0; i < groupLn; i++) {
            firstGroupedRecord = groups[i].children[0];
            storeIndex = store.indexOf(firstGroupedRecord);
            headerIndices[storeIndex] = true;

            previousIndex = storeIndex - 1;
            if (previousIndex >= 0) {
                footerIndices[previousIndex] = true;
            }
        }

        footerIndices[storeLn - 1] = true;

        return headerIndices;
    },

    onIndex: function(indexBar, index) {
        var me = this,
            key = index.toLowerCase(),
            store = me.getStore(),
            groups = store.getGroups(),
            ln = groups.length,
            scroller = me.container.getScrollable().getScroller(),
            group, i, closest, id;

        for (i = 0; i < ln; i++) {
            group = groups[i];
            id = group.name.toLowerCase();
            if (id >= key) {
                closest = group;
                break;
            }
            else {
                closest = group;
            }
        }

        if (closest) {
            index = store.indexOf(closest.children[0]);

            //stop the scroller from scrolling
            scroller.stopAnimation();

            //make sure the new offsetTop is not out of bounds for the scroller
            var containerSize = scroller.getContainerSize().y,
                size = scroller.getSize().y,
                maxOffset = size - containerSize,
                offset = me.getInfinite() ? me.getItemMap().map[index] : me.listItems[index].getHeader().renderElement.dom.offsetTop;

            scroller.scrollTo(0, Math.min(offset, maxOffset));
        }
    },

    onItemAdd: function(item) {
        var me = this,
            config = item.config;

        if (config.scrollDock) {
            if (config.scrollDock == 'bottom') {
                me.scrollDockItems.bottom.push(item);
            } else {
                me.scrollDockItems.top.push(item);
            }

            if (me.getInfinite()) {
                item.on({
                    resize: 'onScrollDockItemResize',
                    scope: this
                });

                item.addCls(me.getBaseCls() + '-scrolldockitem');
                item.setTranslatable({
                    translationMethod: this.translationMethod
                });
                item.translate(0, -10000);
                item.$scrollDockHeight = 0;
            }

            me.container.doAdd(item);
        } else {
            me.callParent(arguments);
        }
    },

    /**
     * Returns all the items that are docked in the scroller in this list.
     * @return {Array} An array of the scrollDock items
     */
    getScrollDockedItems: function() {
        return this.scrollDockItems.bottom.slice().concat(this.scrollDockItems.top.slice());
    },

    onScrollDockItemResize: function(dockItem, size) {
        var me = this,
            items = me.listItems,
            ln = items.length,
            i, item;

        Ext.getCmp(dockItem.id).$scrollDockHeight = size.height;

        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item.isLast) {
                this.updatedItems.push(item);
                this.refreshScroller();
                break;
            }
        }
    },

    onItemTouchStart: function(e) {
        this.container.innerElement.on({
            touchmove: 'onItemTouchMove',
            delegate: '.' + Ext.baseCSSPrefix + 'list-item',
            single: true,
            scope: this
        });
        this.callParent(this.parseEvent(e));
    },

    onItemTouchMove: function(e) {
        this.callParent(this.parseEvent(e));
    },

    onItemTouchEnd: function(e) {
        this.container.innerElement.un({
            touchmove: 'onItemTouchMove',
            delegate: '.' + Ext.baseCSSPrefix + 'list-item',
            scope: this
        });
        this.callParent(this.parseEvent(e));
    },

    onItemTap: function(e) {
        this.callParent(this.parseEvent(e));
    },

    onItemTapHold: function(e) {
        this.callParent(this.parseEvent(e));
    },

    onItemSingleTap: function(e) {
        this.callParent(this.parseEvent(e));
    },

    onItemDoubleTap: function(e) {
        this.callParent(this.parseEvent(e));
    },

    onItemSwipe: function(e) {
        this.callParent(this.parseEvent(e));
    },

    parseEvent: function(e) {
        var me = this,
            target = Ext.fly(e.getTarget()).findParent('.' + Ext.baseCSSPrefix + 'list-item', 8),
            item = Ext.getCmp(target.id);

        return [me, item, item.$dataIndex, e];
    },

    applyOnItemDisclosure: function(config) {
        if (Ext.isFunction(config)) {
            return {
                scope: this,
                handler: config
            };
        }
        return config;
    },

    handleItemDisclosure: function(e) {
        var me = this,
            item = Ext.getCmp(Ext.get(e.getTarget()).up('.x-list-item').id),
            index = item.$dataIndex,
            record = me.getStore().getAt(index);

        me.fireAction('disclose', [me, record, item, index, e], 'doDisclose');
    },

    doDisclose: function(me, record, item, index, e) {
        var onItemDisclosure = me.getOnItemDisclosure();

        if (onItemDisclosure && onItemDisclosure.handler) {
            onItemDisclosure.handler.call(onItemDisclosure.scope || me, record, item, index, e);
        }
    },

    // apply to the selection model to maintain visual UI cues
    onItemTrigger: function(me, index, target, record, e) {
        if (!(this.getPreventSelectionOnDisclose() && Ext.fly(e.target).hasCls(this.getBaseCls() + '-disclosure'))) {
            this.callParent(arguments);
        }
    }
});
