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

        this.favourites = ko.observableArray();

        this.initialize = function() {
            ko.applyBindings(this.searchViewModel, Quo('#main').get(0));
            ko.applyBindings(this.resultsViewModel, Quo('#results').get(0));
        };

        this.displaySearchResults = function(response, search) {
            this.resultsViewModel.empty();
            this.resultsViewModel.update(response, search);
            Lungo.Router.section('results');
        };

        this.getFavouriteByGuid = function(guid) {
            return ko.utils.arrayFirst(this.favourites(), function (property) {
                return property.guid === guid;
            });
        };

        this.toggleFavourited = function(property) {
            var existingFavourite = this.getFavouriteByGuid(property.guid);

            if(existingFavourite) {
                this.favourites.remove(existingFavourite);
            } else {
                this.favourites.push(property);
            }
        };
    };

    return ApplicationViewModel;

});