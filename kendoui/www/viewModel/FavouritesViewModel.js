
function FavouritesViewModel() {
    var that;

    this.properties = favouritesService.favourites;

    this.propertyClicked = function(event) {
        propertyViewModel.init(event.dataItem);
        app.navigate("#propertyView");
    };

    this.noPropertiesMessageVisible = function() {
        return this.get("properties").length === 0;
    };

    that = kendo.observable(this);
    return that;
}