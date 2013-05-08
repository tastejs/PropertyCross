define(
    [
        'ko',
        'datasource',
        'models/Search',
        'viewModels/PropertyViewModel'
    ],

    function(ko, DataSource, Search, PropertyViewModel) {

        var LOAD_MORE_TEXT = 'Load more ...';
        var LOAD_MORE_LOADING_TEXT = 'Loading ...';

        var ResultsViewModel = function(application) {
            this.datasource = new DataSource();

            this.properties = ko.observableArray();
            this.resultCount = ko.observable();
            this.currentPageNumber = ko.observable();
            this.searchTerm = ko.observable();

            this.loadMoreText = ko.observable(LOAD_MORE_TEXT);

            this.pageCount = ko.computed(function() {
                return this.properties().length;
            }, this);

            this.hasMoreResults = ko.computed(function() {
                return this.pageCount() < this.resultCount();
            }, this);

            this.empty = function() {
                this.properties.removeAll();
            };

            this.update = function(response, search) {
                this.currentPageNumber(response.pageNumber);
                this.resultCount(response.total);
                this.searchTerm(search.getTerm());

                response.data.forEach(Lungo.Core.bind(this, function(property) {
                    var viewModel = new PropertyViewModel(application);
                    viewModel.initialize(property);
                    this.properties.push(viewModel);
                }));
            };

            this.retrieveMoreResults = function() {
                this.loadMoreText(LOAD_MORE_LOADING_TEXT);

                var search = new Search({
                    term: this.searchTerm(),
                    pageNumber: this.currentPageNumber() + 1
                });

                this.datasource.performSearch(search, Lungo.Core.bind(this, function(response) {
                    this.update(response, search);
                    this.loadMoreText(LOAD_MORE_TEXT);
                }));
            };

            this.viewProperty = function(property) {
                application.viewProperty(property);
            };
        };

        return ResultsViewModel;

});