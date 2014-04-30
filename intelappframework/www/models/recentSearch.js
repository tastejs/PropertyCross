RecentSearch = new $.mvc.model.extend("recentSearch", {
    id: '',
    display_name: '',
    total_results: '',
    searchTimeMS: '',

    /*Keeps the total recent searches down to 4*/
    prune: function() {
        var that = this;
        this.fetchAll(function(searches) {
            if (searches.length > 4) {
                searches.sort(function(a, b) {
                    return b.searchTimeMS - a.searchTimeMS;
                });
                for (var i = 4; i < searches.length; i++) {
                    that.fetch(searches[i].id, function(item) {
                        item.remove();
                    });
                }
            }
        });
    }
});

var recentSearch = new RecentSearch();
