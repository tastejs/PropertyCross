define("app", function (require) {
  var $ = require("lib/jquery");
  var ko = require("lib/knockout");
  var PropertySearchViewModel = require("viewModel/PropertySearchViewModel");
  var util = require("viewModel/util");
  var application = require("viewModel/ApplicationViewModel").Instance;

// a custom bindings which is used to 'refresh' jQueryMobile listviews.
// See: http://www.scottlogic.co.uk/blog/colin/2012/10/integrating-knockout-and-jquerymobile/
  ko.virtualElements.allowedBindings.updateListviewOnChange = true;
  ko.bindingHandlers.updateListviewOnChange = {
    update:function (element, valueAccessor) {
      // reference value to force update when value changes
      valueAccessor();

      var listview = $(element).parents().andSelf()
          .filter("[data-role='listview']");

      if (listview.data("mobile-listview")) {
        listview.listview('refresh');
      }
    }
  };

// takes the JSON state and updates the view model state
  function setState(jsonState) {
    var state = $.parseJSON(jsonState);
    if (!state)
      return;
    if (state.favourites) {
      $.each(state.favourites, function () {
        propertySearchViewModel.favourites.push(util.hydrateObject(this));
      });
    }
    if (state.recentSearches) {
      $.each(state.recentSearches, function () {
        propertySearchViewModel.recentSearches.push(util.hydrateObject(this));
      });
    }
  }

// saves the current state
  function persistentStateChanged() {
    var state = {
          recentSearches:propertySearchViewModel.recentSearches,
          favourites:propertySearchViewModel.favourites
        },
        jsonState = ko.toJSON(state);

    localStorage["appState"] = jsonState;
  }

  // create the top-level view model
  // N.B. This is kept as a global to avoid re-engineering the whole
  // project and losing the focus of this article. However, this seems
  // to be a hack to allow global state (i.e. favourites) to be stored
  // somewhere other than the application level (i.e. in the
  // ApplicationViewModel).
  window.propertySearchViewModel = new PropertySearchViewModel();
  propertySearchViewModel.maxRecentSearch = 3;

  $.mobile.defaultPageTransition = "slide";

  function initializeViewModels() {

    $(document).bind("pagechange", function (event, args) {
      if (args.options.reverse) {
        application.back();
      }
    });

    var previousBackStackLength = 0;
    var previousView = null;

    // subscribe to changes in the current view model, creating
    // the required view
    application.currentViewModel.subscribe(function (viewModel) {
      var backStackLength = application.viewModelBackStack().length;
      var view = $("#" + viewModel.template);
      if (previousBackStackLength < backStackLength) {
        // forward navigation
        ko.applyBindings(viewModel, view[0]);
        $.mobile.changePage(view);
        console.log("forward");
      } else {
        // backward navigation
        ko.cleanNode(previousView[0]);
        console.log("backwards");
      }

      previousBackStackLength = backStackLength;
      previousView = view;

    });

    // handle changes in persistent state
    propertySearchViewModel.favourites.subscribe(persistentStateChanged);
    propertySearchViewModel.recentSearches.subscribe(persistentStateChanged);

    // load app state if present
    var state = localStorage["appState"];
    if (state) {
      setState(state);
    }

    application.navigateTo(propertySearchViewModel);
  };

// startup the app
  $(function () {
    if (window.device) {
      document.addEventListener("deviceready", initializeViewModels, false);
    } else {
      // if there is no 'device' immediately create the view models. This is useful
      // for browser-based testing
      initializeViewModels();
    }
  });
});