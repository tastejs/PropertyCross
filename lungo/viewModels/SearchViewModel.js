define(
    [
        'ko',
        'datasource',
        'models/Search',
        'models/DataSourceResponseCode'
    ],

    function(ko, DataSource, Search, DataSourceResponseCode) {

        var SearchViewModel = function(application) {

            this.datasource = new DataSource();

            this.errorMessage = ko.observable();

            this.searchTerm = ko.observable();
            this.isSearching = ko.observable(false);

            this.recentSearches = ko.observableArray();

            this.suggestions = ko.observableArray();
            this.hasSuggestions = ko.computed(function() {
                return this.suggestions().length > 0;
            }, this);


            this.performSearch = Lungo.Core.bind(this, function() {
                var search = new Search({
                    term: this.searchTerm(),
                    pageNumber: 1
                });

                this.isSearching(true);

                // Perform the search
                this.datasource.performSearch(search, Lungo.Core.bind(this, function(response) {
                    this.suggestions.removeAll();
                    this.isSearching(false);
                    this.errorMessage('');

                    switch(response.code) {
                        case DataSourceResponseCode.PROPERTIES_FOUND:
                            if(!response.data.length) {
                                this.errorMessage('There were no properties found for the given location.');
                            } else {
                                application.displaySearchResults(response, search);
                            }
                            break;
                        case DataSourceResponseCode.AMBIGIOUS_LOCATION:
                            response.data.forEach(function(location) {
                                this.suggestions.push(location);
                            }, this);
                            break;
                        case DataSourceResponseCode.UNKNOWN_LOCATION:
                            this.errorMessage('The location given was not recognised.');
                            break;
                    }
                }),
                Lungo.Core.bind(this, function(message) {
                    this.isSearching(false);
                    this.errorMessage(message);
                }));
            });

            this.performSearchFromSuggested = Lungo.Core.bind(this, function(location) {
                this.searchTerm(location.placeName);
                this.performSearch();
            });
        };

        return SearchViewModel;
});