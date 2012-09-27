var _ = require("underscore");
var ko = require("knockout");
var AbstractApplicationView = require("view/AbstractApplicationView");
var PropertyViewModel = require("viewModel/PropertyViewModel");
var FavouritesViewModel = require("viewModel/FavouritesViewModel");

function IPhoneApplicationView(applicationViewModel, propertySearchViewModel) {
	AbstractApplicationView.call(this, applicationViewModel, propertySearchViewModel);

	var that = this;
	var nav;
	
	this.navigateForwards = function(viewModel, view) {
		if (!nav) {
			var root = Titanium.UI.createWindow({
				backgroundColor : "#ffffff"
			});
			nav = Titanium.UI.iPhone.createNavigationGroup({
				window : view.window
			});
			root.add(nav);
			root.open();
		} else {
			view.window.addEventListener('close', function() {
				applicationViewModel.back();
			});
			nav.open(view.window);
		}
		if ( viewModel instanceof PropertyViewModel) {
			var toggleFavouriteButton = Titanium.UI.createButton({
				title : 'Fave'
			});
			toggleFavouriteButton.addEventListener('click', function() {
				var viewModel = applicationViewModel.currentViewModel();
				propertySearchViewModel.addToFavourites(viewModel);
			});
			view.window.setRightNavButton(toggleFavouriteButton);
			function updateToggleFavouriteButton(isFavourite) {
				toggleFavouriteButton.title = isFavourite ? 'RFave' : 'AFave';
			}
			viewModel.isFavourite.subscribe(updateToggleFavouriteButton);
			updateToggleFavouriteButton(viewModel.isFavourite());
		} else if (!( viewModel instanceof FavouritesViewModel)) {
			var viewFavouritesButton = Titanium.UI.createButton({
				title : 'Fave'
			});
			viewFavouritesButton.addEventListener('click', function() {
				propertySearchViewModel.viewFavourites();
			});
			view.window.setRightNavButton(viewFavouritesButton);
		}
	};

	this.navigateBackwards = function(view) {
		// no-op
	};

}

module.exports = IPhoneApplicationView;