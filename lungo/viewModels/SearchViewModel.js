define(
    [
        'ko',
        'datasource',
        'models/Search',
        'models/DataSourceResponseCode'
    ],

    function(ko, DataSource, Search, DataSourceResponseCode) {

        var SearchViewModel = function(application) {

            this.searchTerm = ko.observable();
            this.recentSearches = ko.observableArray();
            this.datasource = new DataSource();
            this.isSearching = ko.observable(false);

            this.performSearch = function(element) {

                var search = new Search({
                    term: this.searchTerm(),
                    pageNumber: 1
                });

                this.isSearching(true);

                // Perform the search
                this.datasource.performSearch(search, Lungo.Core.bind(this, function(response) {
                    this.isSearching(false);

                    switch(response.code) {
                        case DataSourceResponseCode.PROPERTIES_FOUND:
                            application.displaySearchResults(response, search);
                            break;
                        case DataSourceResponseCode.AMBIGIOUS_LOCATION:

                            break;
                        case DataSourceResponseCode.UNKNOWN_LOCATION:

                            break;
                    }
                }));
            };
        };

        return SearchViewModel;
});