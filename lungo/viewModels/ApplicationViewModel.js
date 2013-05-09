define(
    [
        'ko',
        'viewModels/SearchViewModel',
        'viewModels/ResultsViewModel',
        'viewModels/FavouritesViewModel',
        'viewModels/PropertyDetailsViewModel',
        'viewModels/PropertyViewModel',
        'models/DataSourceResponse'
    ],

    function(ko, SearchViewModel, ResultsViewModel, FavouritesViewModel, PropertyDetailsViewModel,
             PropertyViewModel, DataSourceResponse) {

    var ApplicationViewModel = function() {

        this.searchViewModel = new SearchViewModel(this);
        this.resultsViewModel = new ResultsViewModel(this);
        this.favouritesViewModel = new FavouritesViewModel(this);
        this.propertyDetailsViewModel = new PropertyDetailsViewModel(this);

        this.applicationState = ko.computed(function() {
            var state = {
                recentSearches: this.searchViewModel.recentSearchResponses(),
                favourites: this.favouritesViewModel.favourites()
            };

            return ko.toJSON(state);
        }, this);

        this.setState = function(state) {
            state.favourites.forEach(function(favourite) {
                var viewModel = new PropertyViewModel(this);
                viewModel.initialize(favourite);

                this.favouritesViewModel.favourites.push(viewModel);
            }, this);

            state.recentSearches.forEach(function(search) {
                this.searchViewModel.recentSearchResponses.push(new DataSourceResponse(search));
            }, this);
        };

        this.initialize = function(params) {
            ko.applyBindings(this.searchViewModel, Quo('#main').get(0));
            ko.applyBindings(this.resultsViewModel, Quo('#results').get(0));
            ko.applyBindings(this.favouritesViewModel, Quo('#favourites').get(0));
            ko.applyBindings(this.propertyDetailsViewModel, Quo('#property-view').get(0));

            if(params.state) {
                this.setState(ko.utils.parseJson(params.state));
            }
        };

        this.displaySearchResults = function(response) {
            this.resultsViewModel.empty();
            this.resultsViewModel.update(response);
            Lungo.Router.section('results');
        };

        this.viewProperty = function(property) {
            this.propertyDetailsViewModel.setCurrentViewModel(property);
            Lungo.Router.section('property-view');
        };
    };

    return ApplicationViewModel;

});