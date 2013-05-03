define(
    [
        'ko',
        'viewModels/SearchViewModel',
        'viewModels/ResultsViewModel'
    ],

    function(ko, SearchViewModel, ResultsViewModel) {

    var ApplicationViewModel = function() {

        this.searchViewModel = new SearchViewModel(this);
        this.resultsViewModel = new ResultsViewModel(this);

        this.initialize = function() {
            ko.applyBindings(this.searchViewModel, Quo('#main').get(0));
            ko.applyBindings(this.resultsViewModel, Quo('#results').get(0));
        };

        this.displaySearchResults = function(response, search) {
            this.resultsViewModel.empty();
            this.resultsViewModel.update(response, search);
            Lungo.Router.section('results');
        };
    };

    return ApplicationViewModel;

});