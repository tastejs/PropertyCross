define(
    [
        'ko'
    ],

    function(ko) {

        var FavouritesViewModel = function(application) {

            this.favourites = ko.observableArray();

            this.getFavouriteByGuid = function(guid) {
                return ko.utils.arrayFirst(this.favourites(), function (propertyViewModel) {
                    return propertyViewModel.model.guid === guid;
                });
            };

            this.toggleFavourited = function(propertyViewModel) {
                var existingFavourite = this.getFavouriteByGuid(propertyViewModel.model.guid);

                if(existingFavourite) {
                    this.favourites.remove(existingFavourite);
                } else {
                    this.favourites.push(propertyViewModel);
                }
            };

            this.viewProperty = function(property) {
                application.viewProperty(property);
            };
        };

        return FavouritesViewModel;

});