/**
 * @class Ext.plugin.BufferedList
 * @extends Ext.plugin.Plugin
 * Description
 */
Ext.define('Ext.plugin.BufferedList', {
    alias: 'plugin.bufferedlist',

    mixins: [
        'Ext.mixin.Bindable'
    ],

    config: {
        list: null
    },

    init: function(list) {
        this.initConfig();
        this.setList(list);
    },

    updateList: function(list) {
        if (list) {
            this.bind(list, 'setItemsCount', 'setItemsCount');

            Ext.apply(list, {
                 updateAllListItems: Ext.Function.bind(this.updateAllListItems, this),
                 handleItemUpdates: Ext.Function.bind(this.handleItemUpdates, this),
                 onAnimationIdle: Ext.Function.bind(this.onAnimationIdle, this)
            });

            list.getStore().on({
                totalcountchange: 'onTotalCountChange',
                scope: this
            });
        }
    },

    onTotalCountChange: function(store, storeCount) {
        var list = this.getList();
        list.getItemMap().populate(storeCount, list.topRenderedIndex);
    },

    setItemsCount: function(count) {
        var list = this.getList(),
            store = list.getStore(),
            buffered = store.buffered;

        if (buffered) {
            buffered.setViewSize(count);
        }
    },

    updateAllListItems: function() {
        var me = this,
            list = me.getList(),
            store = list.getStore(),
            items = list.listItems,
            info = list.getListItemInfo(),
            start = list.topRenderedIndex,
            buffered = store && store.buffered,
            viewSize = buffered && buffered.getViewSize() || 0,
            end = start + viewSize - 1,
            i, ln;

        if (buffered) {
            if (buffered.isRangeCached(start, end)) {
                for (i = 0, ln = items.length; i < ln; i++) {
                    list.updateListItem(items[i], start + i, info);
                }

                if (list.isPainted()) {
                    list.handleItemHeights();
                    list.refreshScroller();
                }
            } else {
                buffered.requestRange(start, end, function() {
                    me.updateAllListItems();
                });
            }
        }
    },

    handleItemUpdates: function(y) {
        console.log(y, 'handle item updates');
    },

    onAnimationIdle: function() {
        console.log('on animation idle');
    }
});