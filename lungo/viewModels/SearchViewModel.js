define(
    [
        'ko',
        'datasource',
        'models/Search',
        'models/DataSourceResponseCode',
        'models/Position'
    ],

    function(ko, DataSource, Search, DataSourceResponseCode, Position) {

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

            this.locationEnabled = ko.observable(true);

            this.addToRecent = function(currentSearch) {
                var existingSearch = ko.utils.arrayFirst(this.recentSearches(), function(seenSearch) {
                    return currentSearch.getTerm() === seenSearch.getTerm();
                });

                if(existingSearch) {
                    // Search already done, move to the front of the array
                    var currentSearchIndex = this.recentSearches.indexOf(existingSearch);
                    this.recentSearches.remove(existingSearch);
                    this.recentSearches.push(existingSearch);
                } else {
                    this.recentSearches.push(currentSearch);
                }
            };

            var searchSuccessCallback = Lungo.Core.bind(this, function(response, search) {
                this.suggestions.removeAll();
                this.isSearching(false);
                this.errorMessage('');

                switch(response.code) {
                    case DataSourceResponseCode.PROPERTIES_FOUND:
                        if(!response.data.length) {
                            this.errorMessage('There were no properties found for the given location.');
                        } else {
                            this.addToRecent(search);
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
            });

            var searchErrorCallback = Lungo.Core.bind(this, function(message) {
                this.isSearching(false);
                this.errorMessage(message);
            });

            this.performSearch = Lungo.Core.bind(this, function(search) {
                this.searchTerm(search.getTerm());
                this.isSearching(true);
                this.datasource.performSearch(search, searchSuccessCallback, searchErrorCallback);
            });

            // From UI:
            this.performSearchFromTerm = Lungo.Core.bind(this, function() {
                var search = new Search({
                    term: this.searchTerm(),
                    pageNumber: 1,
                    type: Search.Type.term
                });

                this.performSearch(search);
            });

            this.performSearchFromSuggested = Lungo.Core.bind(this, function(location) {
                var search = new Search({
                    term: location.placeName,
                    pageNumber: 1,
                    type: Search.Type.term
                });

                this.performSearch(search);
            });

            this.searchMyLocation = Lungo.Core.bind(this, function() {

                if(this.locationEnabled()) {
                    navigator.geolocation.getCurrentPosition(
                        Lungo.Core.bind(this, function(pos) {
                            var search = new Search({
                                position: new Position(pos),
                                pageNumber: 1,
                                type: Search.Type.location
                            });

                            this.performSearch(search);
                        }),
                        Lungo.Core.bind(this, function() {
                            this.errorMessage('Unable to detect current location. Please ensure ' +
                                'location is turned on in your phone settings and try again.');
                        })
                    );
                } else {
                    this.errorMessage('The use of location is currently disabled');
                }

            });


        };

        return SearchViewModel;
});