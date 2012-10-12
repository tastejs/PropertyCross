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
 * A more advanced example showing a list of people groped by last name:
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
*/
Ext.define('Ext.dataview.List', {
    alternateClassName: 'Ext.List',
    extend: 'Ext.dataview.DataView',
    xtype : 'list',

    requires: [
        'Ext.dataview.element.List',
        'Ext.dataview.IndexBar',
        'Ext.dataview.ListItemHeader'
    ],

    /**
     * @event disclose
     * @preventable doDisclose
     * Fires whenever a disclosure is handled
     * @param {Ext.dataview.List} this The List instance
     * @param {Ext.data.Model} record The record assisciated to the item
     * @param {HTMLElement} target The element doubletapped
     * @param {Number} index The index of the item doubletapped
     * @param {Ext.EventObject} e The event object
     */

    config: {
        /**
         * @cfg {Boolean/Object} indexBar
         * True to render an alphabet IndexBar docked on the right.
         * This can also be a config object that will be passed to {@link Ext.IndexBar}
         * (defaults to false)
         * @accessor
         */
        indexBar: false,

        icon: null,

        /**
         * @cfg {Boolean} clearSelectionOnDeactivate
         * True to clear any selections on the list when the list is deactivated.
         * @removed 2.0.0
         */

        /**
         * @cfg {Boolean} preventSelectionOnDisclose True to prevent the item selection when the user
         * taps a disclose icon. Defaults to <tt>true</tt>
         * @accessor
         */
        preventSelectionOnDisclose: true,

        /**
         * @cfg
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
         * True to display a disclosure icon on each list item.
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
         */
        ui: 'normal'

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
         * item that a DataView renders is a Component, we can pass configuration options to each component to
         * easily customize how each child component behaves.
         * Note this is only used when useComponents is true.
         * @accessor
         * @private
         */

        /**
         * @cfg {Number} maxItemCache
         * Maintains a cache of reusable components when using a component based DataView.  Improveing performance at
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
         * @private
         */
    },

    constructor: function() {
        this.translateHeader = (Ext.os.is.Android2) ? this.translateHeaderCssPosition : this.translateHeaderTransform;
        this.callParent(arguments);
    },

    // apply to the selection model to maintain visual UI cues
    onItemTrigger: function(me, index, target, record, e) {
        if (!(this.getPreventSelectionOnDisclose() && Ext.fly(e.target).hasCls(this.getBaseCls() + '-disclosure'))) {
            this.callParent(arguments);
        }
    },

    initialize: function() {
        var me = this,
            container;

        me.on(me.getTriggerCtEvent(), me.onContainerTrigger, me);

        container = me.container = this.add(new Ext.dataview.element.List({
            baseCls: this.getBaseCls()
        }));
        container.dataview = me;

        me.on(me.getTriggerEvent(), me.onItemTrigger, me);

        container.element.on({
            delegate: '.' + this.getBaseCls() + '-disclosure',
            tap: 'handleItemDisclosure',
            scope: me
        });

        container.on({
            itemtouchstart: 'onItemTouchStart',
            itemtouchend: 'onItemTouchEnd',
            itemtap: 'onItemTap',
            itemtaphold: 'onItemTapHold',
            itemtouchmove: 'onItemTouchMove',
            itemsingletap: 'onItemSingleTap',
            itemdoubletap: 'onItemDoubleTap',
            itemswipe: 'onItemSwipe',
            scope: me
        });

        if (this.getStore()) {
            this.refresh();
        }
    },

    updateInline: function(newInline) {
        this.callParent(arguments);
        if (newInline) {
            this.setOnItemDisclosure(false);
            this.setIndexBar(false);
            this.setGrouped(false);
        }
    },

    applyIndexBar: function(indexBar) {
        return Ext.factory(indexBar, Ext.dataview.IndexBar, this.getIndexBar());
    },

    updateIndexBar: function(indexBar) {
        if (indexBar && this.getScrollable()) {
            this.indexBarElement = this.getScrollableBehavior().getScrollView().getElement().appendChild(indexBar.renderElement);

            indexBar.on({
                index: 'onIndex',
                scope: this
            });

            this.element.addCls(this.getBaseCls() + '-indexed');
        }
    },

    updateGrouped: function(grouped) {
        var baseCls = this.getBaseCls(),
            cls = baseCls + '-grouped',
            unCls = baseCls + '-ungrouped';

        if (grouped) {
            this.addCls(cls);
            this.removeCls(unCls);
            this.doRefreshHeaders();
            this.updatePinHeaders(this.getPinHeaders());
        }
        else {
            this.addCls(unCls);
            this.removeCls(cls);

            if (this.container) {
                this.container.doRemoveHeaders();
            }

            this.updatePinHeaders(null);
        }
    },

    updatePinHeaders: function(pinnedHeaders) {
        var scrollable = this.getScrollable(),
            scroller;

        if (scrollable) {
            scroller = scrollable.getScroller();
        }

        if (!scrollable) {
            return;
        }

        if (pinnedHeaders && this.getGrouped()) {
            scroller.on({
                refresh: 'doRefreshHeaders',
                scroll: 'onScroll',
                scope: this
            });

            if (!this.header || !this.header.renderElement.dom) {
                this.createHeader();
            }
        } else {
            scroller.un({
                refresh: 'doRefreshHeaders',
                scroll: 'onScroll',
                scope: this
            });

            if (this.header) {
                this.header.destroy();
            }
        }
    },

    createHeader: function() {
        var header,
            scrollable = this.getScrollable(),
            scroller, scrollView, scrollViewElement;

        if (scrollable) {
            scroller = scrollable.getScroller();
            scrollView = this.getScrollableBehavior().getScrollView();
            scrollViewElement = scrollView.getElement();
        }
        else {
            return;
        }

        this.header = header = Ext.create('Ext.dataview.ListItemHeader', {
            html: ' ',
            cls: 'x-list-header-swap'
        });
        scrollViewElement.dom.insertBefore(header.element.dom, scroller.getContainer().dom.nextSibling);
        this.translateHeader(1000);
    },

    // We need to use the same events as the DataView so we are sure we run AFTER the list populates
    refresh: function() {
        this.callParent();
        this.doRefreshHeaders();
    },

    onStoreAdd: function() {
        this.callParent(arguments);
        this.doRefreshHeaders();
    },

    onStoreRemove: function() {
        this.callParent(arguments);
        this.doRefreshHeaders();
    },

    onStoreUpdate: function() {
        this.callParent(arguments);
        this.doRefreshHeaders();
    },

    onStoreClear: function() {
        this.callParent();
        if (this.header) {
            this.header.destroy();
        }
        this.doRefreshHeaders();
    },

    // @private
    getClosestGroups : function() {
        var groups = this.pinHeaderInfo.offsets,
            scrollable = this.getScrollable(),
            ln = groups.length,
            i = 0,
            pos, group, current, next;

        if (scrollable) {
            pos = scrollable.getScroller().position;
        }
        else {
            return {
                current: 0,
                next: 0
            };
        }

        for (; i < ln; i++) {
            group = groups[i];
            if (group.offset > pos.y) {
                next = group;
                break;
            }
            current = group;
        }

        return {
            current: current,
            next: next
        };
    },

    doRefreshHeaders: function() {
        if (!this.getGrouped() || !this.container) {
            return false;
        }

        var headerIndices = this.findGroupHeaderIndices(),
            ln = headerIndices.length,
            items = this.container.getViewItems(),
            headerInfo = this.pinHeaderInfo = {offsets: []},
            headerOffsets = headerInfo.offsets,
            scrollable = this.getScrollable(),
            scroller, scrollPosition, i, headerItem, header;

        if (ln) {
            for (i = 0; i < ln; i++) {
                headerItem = items[headerIndices[i]];
                if (headerItem) {
                    header = this.getItemHeader(headerItem);

                    headerOffsets.push({
                        header: header,
                        offset: headerItem.offsetTop
                    });
                }
            }

            headerInfo.closest = this.getClosestGroups();
            this.setActiveGroup(headerInfo.closest.current);
            if (header) {
                headerInfo.headerHeight = Ext.fly(header).getHeight();
            }

            // Ensure the pinned header is positioned correctly
            if (scrollable) {
                scroller = scrollable.getScroller();
                scrollPosition = scroller.position;
                this.onScroll(scroller, scrollPosition.x, scrollPosition.y);
            }
        }
    },

    getItemHeader: function(item) {
        var element = Ext.fly(item).down(this.container.headerClsCache);
        return element ? element.dom : null;
    },

    onScroll: function(scroller, x, y) {
        var me = this,
            headerInfo = me.pinHeaderInfo,
            closest = headerInfo.closest,
            activeGroup = me.activeGroup,
            headerHeight = headerInfo.headerHeight,
            next, current;

        if (!closest) {
            return;
        }

        next = closest.next;
        current = closest.current;

        if (!this.header || !this.header.renderElement.dom) {
            this.createHeader();
        }

        if (y <= 0) {
            if (activeGroup) {
                me.setActiveGroup(false);
                closest.next = current;
            }
            this.translateHeader(1000);
            return;
        }
        else if ((next && y > next.offset) || (current && y < current.offset)) {
            closest = headerInfo.closest = this.getClosestGroups();
            next = closest.next;
            current = closest.current;
            this.setActiveGroup(current);
        }

        if (next && y > 0 && next.offset - y <= headerHeight) {
            var headerOffset = headerHeight - (next.offset - y);
            this.translateHeader(headerOffset);
        }
        else {
            this.translateHeader(null);
        }
    },

    translateHeaderTransform: function(offset) {
        this.header.renderElement.dom.style.webkitTransform = (offset === null) ? null : 'translate3d(0px, -' + offset + 'px, 0px)';
    },

    translateHeaderCssPosition: function(offset) {
        this.header.renderElement.dom.style.top = (offset === null) ? null : '-' + Math.round(offset) + 'px';
    },

    /**
     * Set the current active group
     * @param {Object} group The group to set active
     * @private
     */
    setActiveGroup : function(group) {
        var me = this,
            header = me.header;
        if (header) {
            if (group && group.header) {
                if (!me.activeGroup || me.activeGroup.header != group.header) {
                    header.show();

                    if (header.element) {
                        header.setHtml(group.header.innerHTML);
                    }
                }
            } else if (header && header.element) {
                header.hide();
            }
        }

        this.activeGroup = group;
    },

    onIndex: function(indexBar, index) {
        var me = this,
            key = index.toLowerCase(),
            store = me.getStore(),
            groups = store.getGroups(),
            ln = groups.length,
            scrollable = me.getScrollable(),
            scroller, group, i, closest, id, item;

        if (scrollable) {
            scroller = me.getScrollable().getScroller();
        }
        else {
            return;
        }

        for (i = 0; i < ln; i++) {
            group = groups[i];
            id = group.name.toLowerCase();
            if (id == key || id > key) {
                closest = group;
                break;
            }
            else {
                closest = group;
            }
        }

        if (scrollable && closest) {
            item = me.container.getViewItems()[store.indexOf(closest.children[0])];

            //stop the scroller from scrolling
            scroller.stopAnimation();

            //make sure the new offsetTop is not out of bounds for the scroller
            var containerSize = scroller.getContainerSize().y,
                size = scroller.getSize().y,
                maxOffset = size - containerSize,
                offset = (item.offsetTop > maxOffset) ? maxOffset : item.offsetTop;

            scroller.scrollTo(0, offset);
        }
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
            item = e.getTarget().parentNode,
            index = me.container.getViewItems().indexOf(item),
            record = me.getStore().getAt(index);

        me.fireAction('disclose', [me, record, item, index, e], 'doDisclose');
    },

    doDisclose: function(me, record, item, index, e) {
        var onItemDisclosure = me.getOnItemDisclosure();

        if (onItemDisclosure && onItemDisclosure.handler) {
            onItemDisclosure.handler.call(onItemDisclosure.scope || me, record, item, index, e);
        }
    },

    findGroupHeaderIndices: function() {
        if (!this.getGrouped()) {
            return [];
        }
        var me = this,
            store = me.getStore();
        if (!store) {
            return [];
        }

        var container = me.container,
            groups = store.getGroups(),
            groupLn = groups.length,
            items = container.getViewItems(),
            newHeaderItems = [],
            footerClsShortCache = container.footerClsShortCache,
            i, firstGroupedRecord, index, item, lastGroup;

        container.doRemoveHeaders();
        container.doRemoveFooterCls();

        if (items.length) {
            for (i = 0; i < groupLn; i++) {
                firstGroupedRecord = groups[i].children[0];
                index = store.indexOf(firstGroupedRecord);
                item = items[index];
                container.doAddHeader(item, store.getGroupString(firstGroupedRecord));
                // Skip footer before the first Header
                if (i) {
                    Ext.fly(item.previousSibling).addCls(footerClsShortCache);
                }
                newHeaderItems.push(index);
            }
            // Add footer before the last item
            lastGroup = groups[--i].children;
            Ext.fly(items[store.indexOf(lastGroup[lastGroup.length - 1])]).addCls(footerClsShortCache);
        }

        return newHeaderItems;
    },

    destroy: function() {
        Ext.destroy(this.getIndexBar(), this.indexBarElement, this.header);
        this.callParent();
    }
});
