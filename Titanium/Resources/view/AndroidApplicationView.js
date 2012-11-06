var _ = require("lib/underscore");
var ko = require("lib/knockout");
var AbstractApplicationView = require("view/AbstractApplicationView");
var PropertyViewModel = require("viewModel/PropertyViewModel");

function AndroidApplicationView(applicationViewModel) {
	AbstractApplicationView.call(this, applicationViewModel);

	var that = this;
	var nav;

	this.navigateForwards = function(viewModel, view) {
		// pressing back on the last screen should exit the application
		view.window.addEventListener('android:back', function() {
			if (applicationViewModel.backButtonRequired()) {
				applicationViewModel.back();
			} else {
				Titanium.Android.currentActivity.finish();
			}
		});
		// hide the previous view
		var previousView = _.last(that.viewStack);
		if (previousView) {
			previousView.window.hide();
		}
		view.window.open();
	};

	this.navigateBackwards = function(view) {
		view.window.close();
		// show the previous view
		var previousView = _.last(that.viewStack);
		if (previousView) {
			previousView.window.show();
		}
	};

	// handle favourites
	if (Ti.Platform.osname === "android") {
		Titanium.Android.currentActivity.onCreateOptionsMenu = function(e) {
			var menu = e.menu;
			var menuItem = menu.add({
				title : "Add to Favourites"
			});
			menuItem.addEventListener("click", function(e) {
				var viewModel = applicationViewModel.currentViewModel();
				viewModel.addToFavourites();
			});
			menuItem = menu.add({
				title : "Remove from Favourites"
			});
			menuItem.addEventListener("click", function(e) {
				var viewModel = applicationViewModel.currentViewModel();
				viewModel.addToFavourites();
			});
			menuItem = menu.add({
				title : "View Favourites"
			});
			menuItem.addEventListener("click", function(e) {
				applicationViewModel.navigateToFavourites();
			});
		};

		Titanium.Android.currentActivity.onPrepareOptionsMenu = function(e) {
			var menu = e.menu;
			var viewModel = applicationViewModel.currentViewModel();
			var isPropertyViewModel = viewModel instanceof PropertyViewModel;
			menu.items[0].visible = isPropertyViewModel && !viewModel.isFavourite();
			menu.items[1].visible = isPropertyViewModel && viewModel.isFavourite();
			menu.items[2].visible = !isPropertyViewModel;
		};
	}
}

module.exports = AndroidApplicationView;
