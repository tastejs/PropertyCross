define(
    [
        'ko',
        'datasource',
        'models/Search',
        'viewModels/PropertyViewModel'
    ],

    function(ko, DataSource, Search, PropertyViewModel) {

        var ResultsViewModel = function(application) {
            this.datasource = new DataSource();

            this.properties = ko.observableArray();
            this.resultCount = ko.observable();
            this.currentPageNumber = ko.observable();
            this.searchTerm = ko.observable();

            this.pageCount = ko.computed(function() {
                return this.properties().length;
            }, this);

            this.empty = function() {
                this.properties.removeAll();
            };

            this.update = function(response, search) {
                this.currentPageNumber(response.pageNumber);
                this.resultCount(response.total);
                this.searchTerm(search.term);

                response.data.forEach(Lungo.Core.bind(this, function(property) {
                    var viewModel = new PropertyViewModel();
                    viewModel.initialize(property);
                    this.properties.push(viewModel);
                }));
            };

            this.retrieveMoreResults = function() {
                var search = new Search({
                    term: this.searchTerm(),
                    pageNumber: this.currentPageNumber() + 1
                });

                this.datasource.performSearch(search, Lungo.Core.bind(this, this.update));
            };

        };

        return ResultsViewModel;

});