define(function (require) {
  var $ = require("lib/jquery");
  var ko = require("lib/knockout");
  var application = new (require("viewModel/ApplicationViewModel"))();

// a custom bindings which is used to 'refresh' jQueryMobile listviews.
// See: http://www.scottlogic.co.uk/blog/colin/2012/10/integrating-knockout-and-jquerymobile/
  ko.virtualElements.allowedBindings.updateListviewOnChange = true;
  ko.bindingHandlers.updateListviewOnChange = {
    update:function (element, valueAccessor) {
      // reference value to force update when value changes
      ko.utils.unwrapObservable(valueAccessor());

      var listview = $(element).parents().andSelf()
          .filter("[data-role='listview']");

      if (listview.data("mobile-listview")) {
        listview.listview('refresh');
      }
    }
  };

  $.mobile.defaultPageTransition = "slide";

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
  }

  // startup the app
  if (window.WRAPPED) {
      // on a device - wait for the PhoneGap device ready event
      document.addEventListener("deviceready", initialize, false);
  } else {
      // if there is we are not running on a phone - start the app immediately
    $(initialize);
  }
});
