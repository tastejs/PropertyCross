var util = require("viewModel/util");

  function FavouritesViewModel(application) {
	/// <summary>
	/// The view model that backs the favourites view
	/// </summary>

	// ----- framework fields
	this.template = "favouritesView";
	this.factoryName = "FavouritesViewModel";

	// ----- public fields
    this.properties = application.favourites;
}

util.registerFactory("FavouritesViewModel", FavouritesViewModel);

module.exports = FavouritesViewModel; 