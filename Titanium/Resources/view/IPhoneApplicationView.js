var _ = require("lib/underscore");
var ko = require("lib/knockout");
var AbstractApplicationView = require("view/AbstractApplicationView");
var PropertyViewModel = require("viewModel/PropertyViewModel");
var SearchResultsViewModel = require("viewModel/SearchResultsViewModel");
var FavouritesViewModel = require("viewModel/FavouritesViewModel");

function IPhoneApplicationView(applicationViewModel) {
	AbstractApplicationView.call(this, applicationViewModel);

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
		}
		if (!( viewModel instanceof FavouritesViewModel || viewModel instanceof SearchResultsViewModel)) {
			var favouriteButton = Titanium.UI.createButton();
			if ( viewModel instanceof PropertyViewModel) {
				favouriteButton.addEventListener('click', function() {
					var viewModel = applicationViewModel.currentViewModel();
					viewModel.addToFavourites();
				});
				function updateFavouriteButton(isFavourite) {
					favouriteButton.image = isFavourite ? '/yellow-star.png' : '/white-star.png';
				}
				viewModel.isFavourite.subscribe(updateFavouriteButton);
				updateFavouriteButton(viewModel.isFavourite());
			} else {
				favouriteButton.title = "Favs";
				favouriteButton.addEventListener('click', function() {
					applicationViewModel.navigateToFavourites();
				});
			}
			view.window.setRightNavButton(favouriteButton);
		}
		nav.open(view.window);
	};

	this.navigateBackwards = function(view) {
		// no-op
	};

}

module.exports = IPhoneApplicationView;
