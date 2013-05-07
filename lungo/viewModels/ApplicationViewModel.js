define(
    [
        'ko',
        'viewModels/SearchViewModel',
        'viewModels/ResultsViewModel',
        'viewModels/FavouritesViewModel'
    ],

    function(ko, SearchViewModel, ResultsViewModel, FavouritesViewModel) {

    var ApplicationViewModel = function() {

        this.searchViewModel = new SearchViewModel(this);
        this.resultsViewModel = new ResultsViewModel(this);
        this.favouritesViewModel = new FavouritesViewModel(this);

        this.initialize = function() {
            ko.applyBindings(this.searchViewModel, Quo('#main').get(0));
            ko.applyBindings(this.resultsViewModel, Quo('#results').get(0));
            ko.applyBindings(this.favouritesViewModel, Quo('#favourites').get(0));
        };

        this.displaySearchResults = function(response, search) {
            this.resultsViewModel.empty();
            this.resultsViewModel.update(response, search);
            Lungo.Router.section('results');
        };

        this.viewProperty = function(property) {
            ko.applyBindings(property, Quo('#property-view').get(0));
            Lungo.Router.section('property-view');
        }
    };

    return ApplicationViewModel;

});