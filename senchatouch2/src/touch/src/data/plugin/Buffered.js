/**
 * @class Ext.data.plugin.Buffered
 * Description
 */
Ext.define('Ext.data.plugin.Buffered', {
    alias: 'plugin.storebuffered',

    extend: 'Ext.Evented',

    requires: [
        'Ext.util.BufferedCollection'
    ],

    config: {
        store: null,

        /**
         * @cfg {Number} trailingBufferZone
         * When {@link #buffered}, the number of extra records to keep cached on the trailing side of scrolling buffer
         * as scrolling proceeds. A larger number means fewer replenishments from the server.
         */
        trailingBufferZone: 25,

        /**
         * @cfg {Number} leadingBufferZone
         * When {@link #buffered}, the number of extra rows to keep cached on the leading side of scrolling buffer
         * as scrolling proceeds. A larger number means fewer replenishments from the server.
         */
        leadingBufferZone: 50,

        /**
         * @cfg {Number} purgePageCount
         * *Valid only when used with a {@link Ext.data.Store#buffered buffered} Store.*
         *
         * The number of pages *additional to the required buffered range* to keep in the prefetch cache before purging least recently used records.
         *
         * For example, if the height of the view area and the configured {@link #trailingBufferZone} and {@link #leadingBufferZone} require that there
         * are three pages in the cache, then a `purgePageCount` of 5 ensures that up to 8 pages can be in the page cache any any one time.
         *
         * A value of 0 indicates to never purge the prefetched data.
         */
        purgePageCount: 5,

        // Number of records to load into a buffered grid before it has been bound to a view of known size
        viewSize: 0,

        bufferedCollection: {}
    },

    init: function(store) {
        this.setStore(store);
        this.pageRequests = {};
    },

    applyBufferedCollection: function(config) {
        return Ext.factory(config, Ext.util.BufferedCollection, this.getBufferedCollection());
    },

    updateBufferedCollection: function(collection) {
        var store = this.getStore();
        if (store) {
            Ext.destroy(store.data);
            store.data = collection;
        }
    },

    updateStore: function(store) {
        if (store) {
            store.setRemoteSort(true);
            store.setRemoteFilter(true);
            store.setRemoteGroup(true);
            store.setPageSize(this.getViewSize());
            this.updateBufferedCollection(this.getBufferedCollection());

            //<debug>
            Ext.Function.interceptBefore(store, 'add', function() {
                Ext.Error.raise({
                    msg: 'add method may not be called on a buffered store'
                });
            });
            //</debug>

            Ext.apply(store, {
                load: Ext.Function.bind(this.load, this),
                buffered: this
            });
        }
    },

    updateViewSize: function(viewSize) {
        var store = this.getStore();
        if (store) {
            store.setPageSize(viewSize);
            this.getBufferedCollection().setPageSize(viewSize);
        }
    },

    requestRange: function(start, end, callback, scope) {
        if (this.isRangeCached(start, end)) {
            callback.call(scope || this, this.getBufferedCollection().getRange(start, end));
        } else {
            this.loadPrefetch({
                start: start,
                limit: end - start,
                callback: callback,
                scope: scope || this
            });
        }
    },

    load: function(options, scope) {
        var store = this.getStore(),
            currentPage = store.currentPage,
            viewSize = this.getViewSize();

        options = options || {};

        if (Ext.isFunction(options)) {
            options = {
                callback: options,
                scope: scope || this
            };
        }

        Ext.applyIf(options, {
            sorters: store.getSorters(),
            filters: store.getFilters(),
            grouper: store.getGrouper(),

            page: currentPage,
            start: (currentPage - 1) * viewSize,
            limit: viewSize,

            addRecords: false,
            action: 'read',
            model: store.getModel()
        });

        this.loadPrefetch(options);
    },

    loadPrefetch: function(options) {
        var me = this,
            startIndex = options.start,
            endIndex = options.start + options.limit - 1,
            trailingBufferZone = me.getTrailingBufferZone(),
            leadingBufferZone = me.getLeadingBufferZone(),
            startPage = me.getPageFromRecordIndex(Math.max(startIndex - trailingBufferZone, 0)),
            endPage = me.getPageFromRecordIndex(endIndex + leadingBufferZone),
            bufferedCollection = me.getBufferedCollection(),
            store = me.getStore(),
            prefetchOptions = Ext.apply({}, options),
            waitForRequestedRange, totalCount, i, records;

        // Wait for the viewable range to be available
        waitForRequestedRange = function() {
            if (me.isRangeCached(startIndex, endIndex)) {
                store.loading = false;

                bufferedCollection.un('pageadded', waitForRequestedRange);
                records = bufferedCollection.getRange(startIndex, endIndex);

                if (options.callback) {
                    options.callback.call(options.scope || me, records, startIndex, endIndex, options);
                }
            }
        };

        delete prefetchOptions.callback;

        store.on('prefetch', function(store, records, successful) {
            if (successful) {
                totalCount = store.getTotalCount();
                if (totalCount) {
                    bufferedCollection.on('pageadded', waitForRequestedRange);

                    // As soon as we have the size of the dataset, ensure we are not waiting for more than can ever arrive,
                    endIndex = Math.min(endIndex, totalCount - 1);

                    // And make sure we never ask for pages beyond the end of the dataset.
                    endPage = me.getPageFromRecordIndex(Math.min(endIndex + leadingBufferZone, totalCount - 1));

                    for (i = startPage + 1; i <= endPage; ++i) {
                        me.prefetchPage(i, prefetchOptions);
                    }
                }
            }
        }, this, {single: true});

        me.prefetchPage(startPage, prefetchOptions);
    },

    /**
     * Prefetches a page of data.
     * @param {Number} page The page to prefetch
     * @param {Object} options (Optional) config object, passed into the Ext.data.Operation object before loading.
     * See {@link #method-load}
     */
    prefetchPage: function(page, options) {
        var me = this,
            viewSize = me.getViewSize();

        // Copy options into a new object so as not to mutate passed in objects
        me.prefetch(Ext.applyIf({
            page: page,
            start: (page - 1) * viewSize,
            limit: viewSize
        }, options));
    },

    /**
     * Prefetches data into the store using its configured {@link #proxy}.
     * @param {Object} options (Optional) config object, passed into the Ext.data.Operation object before loading.
     * See {@link #method-load}
     */
    prefetch: function(options) {
        var me = this,
            pageSize = me.getViewSize(),
            store = me.getStore(),
            operation;

        // Always get whole pages.
        if (!options.page) {
            options.page = me.getPageFromRecordIndex(options.start);
            options.start = (options.page - 1) * pageSize;
            options.limit = Math.ceil(options.limit / pageSize) * pageSize;
        }

        // Currently not requesting this page, then request it...
        if (!me.pageRequests[options.page]) {
            // Copy options into a new object so as not to mutate passed in objects
            options = Ext.applyIf({
                action : 'read',
                sorters: store.getSorters(),
                filters: store.getFilters(),
                grouper: store.getGrouper()
            }, options);

            operation = Ext.create('Ext.data.Operation', options);

            if (store.fireEvent('beforeprefetch', me, operation) !== false) {
                me.pageRequests[options.page] = store.getProxy().read(operation, me.onProxyPrefetch, me);
            }
        }

        return me;
    },

    /**
     * Called after the configured proxy completes a prefetch operation.
     * @private
     * @param {Ext.data.Operation} operation The operation that completed
     */
    onProxyPrefetch: function(operation) {
        var me = this,
            resultSet = operation.getResultSet(),
            records = operation.getRecords(),
            successful = operation.wasSuccessful(),
            store = me.getStore(),
            bufferedCollection = me.getBufferedCollection(),
            page = operation.getPage(),
            total;

        if (resultSet) {
            total = resultSet.getTotal();

            if (total !== store.getTotalCount()) {
                store.setTotalCount(total);
                bufferedCollection.setTotalCount(total);

                store.fireEvent('totalcountchange', store, total);
            }
        }

        store.loading = false;

        if (successful) {
            me.cachePage(records, page);
        }

        store.fireEvent('prefetch', store, records, successful, operation);

        //this is a callback that would have been passed to the 'read' function and is optional
        Ext.callback(operation.callback, operation.scope || me, [records, operation, successful]);
    },

    /**
     * Caches the records in the prefetch and stripes them with their server-side
     * index.
     * @private
     * @param {Ext.data.Model[]} records The records to cache
     * @param {Ext.data.Operation} page The associated operation
     */
    cachePage: function(records, page) {
        var me = this,
            bufferedCollection = me.getBufferedCollection(),
            ln = records.length, i;

        // Add the fetched page into the pageCache
        for (i = 0; i < ln; i++) {
            records[i].join(me);
        }

        bufferedCollection.addPage(page, records);
    },

    /**
     * Determines the page from a record index
     * @param {Number} index The record index
     * @return {Number} The page the record belongs to
     */
    getPageFromRecordIndex: function(index) {
        return Math.floor(index / this.getViewSize()) + 1;
    },

    /**
     * Determines if the passed range is available in the page cache.
     * @private
     * @param {Number} start The start index
     * @param {Number} end The end index in the range
     */
    isRangeCached: function(start, end) {
        return this.getBufferedCollection().hasRange(start, end);
    }
});