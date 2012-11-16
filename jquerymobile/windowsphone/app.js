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

  function initialize() {
    var viewCache = {};

    // subscribe to changes in the current view model, creating
    // the required view
    application.currentViewModel.subscribe(function (viewModel) {
      var viewName = application.currentView();
      var view = viewCache[viewName];
      if (!view) {
        view = viewCache[viewName] = $("#" + viewName);
        ko.applyBindings(viewModel, view[0]);
      }
      $.mobile.changePage(view);
    });

    // for some reason when you add the event listener for the backbutton event, the supplied function
    // is invoked immediately, even though the back button was not pressed. Hence this boolean state
    // variable is used to detect this.
    application.backButtonRequired.subscribe(function (backButtonRequired) {
      var updatingBackButtonListener = true;

      function onBackButton() {
        if (updatingBackButtonListener)
          return;
        // the standard history.go(-1) and other methods for navigating back do not work, so we have to do it
        // manually here
        application.back();
      }

      if (backButtonRequired) {
        document.addEventListener("backbutton", onBackButton, false);
      } else {
        document.removeEventListener("backbutton", onBackButton, false);
      }
      updatingBackButtonListener = false;
    });

    // handle changes in persistent state
    application.state.subscribe(function (state) {
      localStorage.setItem("appState", state);
    });

    // load app state if present
    var state = localStorage.getItem("appState");
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
  if (/\/www\//.test(location)) {
    // on a device - wait for the PhoneGap device ready event
    document.addEventListener("deviceready", initialize, false);
  } else {
    // if there is we are not running on a phone - start the app immediately
    $(initialize);
  }
});
