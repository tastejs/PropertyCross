define(
    [
        'ko'
    ],

    function(ko) {

        var PropertyDetailsViewModel = function(application) {

            this.currentViewModel = ko.observable();

            this.isFavourited = ko.computed(function() {
                return this.currentViewModel() && this.currentViewModel().isFavourited();
            }, this);

            this.setCurrentViewModel = function(viewModel) {
                this.currentViewModel(viewModel);
            };

            this.toggleFavourited = function() {
                application.favouritesViewModel.toggleFavourited(this.currentViewModel());
            };
        };

        return PropertyDetailsViewModel;
    }
);