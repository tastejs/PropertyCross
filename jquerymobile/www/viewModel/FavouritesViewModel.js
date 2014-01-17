define(function (require, exports, module) {
  var util = require("viewModel/util");

  function FavouritesViewModel(application, refreshListview) {
    /// <summary>
    /// The view model that backs the favourites view
    /// </summary>

    // ----- framework fields
    this.template = "favouritesView";
    this.factoryName = "FavouritesViewModel";

    // ----- public fields
    this.properties = application.favourites;
    this.refreshListview = refreshListview;
  }

  util.registerFactory("FavouritesViewModel", FavouritesViewModel);

  module.exports = FavouritesViewModel;
});
