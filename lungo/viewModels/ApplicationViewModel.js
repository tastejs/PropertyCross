define(
    [
        'ko',
        'datasource',
        'models/Search'
    ],

    function(ko, DataSource, Search) {

    var ApplicationViewModel = function() {

        this.searchTerm = ko.observable();
        this.recentSearches = ko.observableArray();
        this.datasource = new DataSource();

        this.performSearch = function() {
            var search = new Search(this.searchTerm());

            // Perform the search
            this.datasource.performSearch(search, Lungo.Core.bind(this, function(response) {
                this.recentSearches.push(search);
            }));
        };

    };

    return ApplicationViewModel;

});