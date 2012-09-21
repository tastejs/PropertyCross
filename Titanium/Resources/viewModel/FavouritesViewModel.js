var util = require("viewModel/util");

function FavouritesViewModel(propertySearchViewModel) {
	/// <summary>
	/// The view model that backs the favourites view
	/// </summary>

	// ----- framework fields
	this.template = "favouritesView";
	this.factoryName = "FavouritesViewModel";

	// ----- public fields
	this.properties = propertySearchViewModel.favourites;
}

util.registerFactory("FavouritesViewModel", FavouritesViewModel);

module.exports = FavouritesViewModel; 