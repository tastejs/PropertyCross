define(function (require) {
  var $ = require("lib/jquery");
  var ko = require("lib/knockout");
  var refreshListview = function(element) {
    var listview = $(element).closest("[data-role='listview']");
    if (listview.data("mobile-listview")) {
      listview.listview('refresh');
    }
  };
  var application = new (require("viewModel/ApplicationViewModel"))(refreshListview);

  $.mobile.defaultPageTransition = /android/i.test(navigator.userAgent) ? "none" : "slide";

  function initialize() {
    var previousBackStackLength = 0;
    var viewCache = {};

    // subscribe to changes in the current view model, creating
    // the required view
    application.currentViewModel.subscribe(function (viewModel) {
      var backStackLength = application.viewModelBackStack().length;
      var viewName = application.currentView();
      var view = viewCache[viewName];
      if (!view) {
        view = viewCache[viewName] = $("#" + viewName);
        ko.applyBindings(viewModel, view[0]);
      }
      if (previousBackStackLength < backStackLength) {
        // forward navigation
        $.mobile.changePage(view);
      } else {
        // backward navigation
      }

      previousBackStackLength = backStackLength;
    });

    // inform the application of jquery mobile's handling of backwards navigation
    $(document).bind("pagechange", function (event, args) {
      if (args.options.reverse) {
        application.back();
      }
    });

    // handle changes in persistent state
    application.state.subscribe(function (state) {
      localStorage["appState"] = state;
    });

    // load app state if present
    var state = localStorage["appState"];
    if (state) {
      try {
        application.setState(state);
      }
      catch (e) {
        console.warn("Failed to load state", e);
      }
    }

    // navigate to home
    application.navigateToHome();
    $("#propertySearchView [data-role=listview]").listview('refresh');

    // hide the splash screen (ios only)
    if (navigator.splashscreen) {
      navigator.splashscreen.hide();
    }
  }

  // startup the app
  if (/\/www\//.test(location)) {
    // on a device - wait for the PhoneGap device ready event
    document.addEventListener("deviceready", initialize, false);
  } else {
    // if there is we are not running on a phone - start the app immediately
    $(initialize);
  }
});
