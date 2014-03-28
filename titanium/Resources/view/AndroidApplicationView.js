var _ = require("lib/underscore");
var ko = require("lib/knockout");
var AbstractApplicationView = require("view/AbstractApplicationView");
var PropertyViewModel = require("viewModel/PropertyViewModel");
var PropertySearchViewModel = require("viewModel/PropertySearchViewModel");

function AndroidApplicationView(applicationViewModel) {
  AbstractApplicationView.call(this, applicationViewModel);

  var that = this;
  var nav;
  
  function navBackwards() {
    if (applicationViewModel.backButtonRequired()) {
      applicationViewModel.back();
    } else {
      Titanium.Android.currentActivity.finish();
    }
  }
  function updateFavouriteMenuItem(menuItem, isFavourite) {
    menuItem.icon = isFavourite ? 'images/star.png' : 'images/nostar.png';
    menuItem.title = isFavourite ? "Remove from Favourites" : "Add to Favourites";
  }

  this.navigateForwards = function (viewModel, view) {
  	  	var win = view.window;
  	win.addEventListener("open", function(evt) {
      var actionBar = win.activity.actionBar;
  	  actionBar.displayHomeAsUp = true;
  	  actionBar.onHomeIconItemSelected = navBackwards;
	  win.activity.onCreateOptionsMenu = function (e) {
	    var menu = e.menu;
	    var viewModel = applicationViewModel.currentViewModel();
	    if(viewModel instanceof PropertyViewModel) {
		    var menuItem = menu.add({ showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS });
		    updateFavouriteMenuItem(menuItem, viewModel.isFavourite());
		    menuItem.addEventListener("click", function (e) {
		      var viewModel = applicationViewModel.currentViewModel();
		      viewModel.addToFavourites();
		      updateFavouriteMenuItem(menuItem, viewModel.isFavourite());
		      //menuItem.icon = viewModel.isFavourite()  ? 'images/star.png' : 'images/nostar.png';
		      //win.activity.invalidateOptionsMenu();
		    });
	    } else if (viewModel instanceof PropertySearchViewModel) {
		  var menuItem = menu.add({
		    title:"Favourites",
		    showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_WITH_TEXT
		  });
		  menuItem.addEventListener("click", function (e) {
		    applicationViewModel.navigateToFavourites();
		  });
	    }
	  };
  	});
    // pressing back on the last screen should exit the application
    view.window.addEventListener('android:back', navBackwards);
    // hide the previous view
    var previousView = _.last(that.viewStack);
    if (previousView) {
      previousView.window.hide();
    }
    view.window.open();
  };

  this.navigateBackwards = function (view) {
    view.window.close();
    // show the previous view
    var previousView = _.last(that.viewStack);
    if (previousView) {
      previousView.window.show();
    }
  };
}

module.exports = AndroidApplicationView;
