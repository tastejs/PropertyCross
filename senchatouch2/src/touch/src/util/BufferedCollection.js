/**
 * @class Ext.util.BufferedCollection
 * @extends Ext.util.Collection
 * Description
 */
Ext.define('Ext.util.BufferedCollection', {
    extend: 'Ext.util.Collection',

    mixins: [
        'Ext.util.Observable'
    ],

    config: {
        totalCount: 0,
        autoSort: false,
        autoFilter: false,
        pageSize: 0
    },

    updateTotalCount: function(totalCount) {
        this.length = totalCount;
        this.all = this.items = Array.apply(null, new Array(totalCount));
    },

    addPage: function(page, records) {
        var pageSize = this.getPageSize(),
            start = (page - 1) * pageSize,
            limit = pageSize;

        this.all.splice.apply(this.all, [start, limit].concat(records));
        this.fireEvent('pageadded', page, records, this.items);
    },

    hasRange: function(start, end) {
        var items = this.items,
            i;

        for (i = start; i <= end; i++) {
            if (!items[i]) {
                return false;
            }
        }
        return true;
    }
});