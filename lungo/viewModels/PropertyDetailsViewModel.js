define(
    [
        'ko'
    ],

    function(ko) {

        var PropertyDetailsViewModel = function(application) {

            this.viewModels = ko.observableArray();
            this.currentViewModel = ko.observable();

            this.isFavourited = ko.computed(function() {
                return this.currentViewModel() && this.currentViewModel().isFavourited();
            }, this);

            this.setCurrentViewModel = function(viewModel) {
                if(this.viewModels.indexOf(viewModel) < 0) {
                    this.viewModels.push(viewModel);
                }

                this.currentViewModel(viewModel);
            };

            this.toggleFavourited = function() {
                application.favouritesViewModel.toggleFavourited(this.currentViewModel());
            };
        };

        return PropertyDetailsViewModel;
    }
);