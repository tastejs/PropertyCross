var _ = require("underscore");
var ko = require("knockout");
var AbstractApplicationView = require("view/AbstractApplicationView");
var PropertyViewModel = require("viewModel/PropertyViewModel");
var SearchResultsViewModel = require("viewModel/SearchResultsViewModel");
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
		if (!( viewModel instanceof FavouritesViewModel || viewModel instanceof SearchResultsViewModel)) {
			var favouriteButton = Titanium.UI.createButton();
			if ( viewModel instanceof PropertyViewModel) {
				favouriteButton.addEventListener('click', function() {
					var viewModel = applicationViewModel.currentViewModel();
					propertySearchViewModel.addToFavourites(viewModel);
				});
				function updateFavouriteButton(isFavourite) {
					favouriteButton.image = isFavourite ? '/yellow-star.png' : '/white-star.png';
				}


				viewModel.isFavourite.subscribe(updateFavouriteButton);
				updateFavouriteButton(viewModel.isFavourite());
			} {
				favouriteButton.title = "Favs";
				favouriteButton.addEventListener('click', function() {
					propertySearchViewModel.viewFavourites();
				});
			}
			view.window.setRightNavButton(favouriteButton);
		}
	};

	this.navigateBackwards = function(view) {
		// no-op
	};

}

module.exports = IPhoneApplicationView;
