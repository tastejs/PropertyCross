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

  this.navigateForwards = function (viewModel, view) {
    if (!nav) {
      nav = Titanium.UI.iOS.createNavigationWindow({
        backgroundColor:"#ffffff",
        window:view.window
      });
      nav.open();
    } else {
      view.window.addEventListener('close', function () {
        applicationViewModel.back();
      });
    }
    if (!( viewModel instanceof FavouritesViewModel || viewModel instanceof SearchResultsViewModel)) {
      var favouriteButton = Titanium.UI.createButton();
      if (viewModel instanceof PropertyViewModel) {
        favouriteButton.addEventListener('click', function () {
          var viewModel = applicationViewModel.currentViewModel();
          viewModel.addToFavourites();
        });
        function updateFavouriteButton(isFavourite) {
          favouriteButton.image = isFavourite ? '/star.png' : '/nostar.png';
        }

        viewModel.isFavourite.subscribe(updateFavouriteButton);
        updateFavouriteButton(viewModel.isFavourite());
      } else {
        favouriteButton.title = "Favs";
        favouriteButton.addEventListener('click', function () {
          applicationViewModel.navigateToFavourites();
        });
      }
      view.window.setRightNavButton(favouriteButton);
    }
    nav.openWindow(view.window);
  };

  this.navigateBackwards = function (view) {
    // no-op
  };

}

module.exports = IPhoneApplicationView;
