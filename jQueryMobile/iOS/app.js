/// <reference path="..//intellisense.js" />

/*global $, PropertyDataSource, PropertySearchViewModel, Location, PropertyViewModel, hydrateObject, ko, Model, ViewModel, window, localStorage, document, console*/

// a custom bindign which is used to 'refresh' jQueryMobile listviews.
// See: http://www.scottlogic.co.uk/blog/colin/2012/10/integrating-knockout-and-jquerymobile/
ko.virtualElements.allowedBindings.updateListviewOnChange = true;
ko.bindingHandlers.updateListviewOnChange = {
  update: function (element, valueAccessor) {
    ko.utils.unwrapObservable(valueAccessor());  //grab dependency

    var listview = $(element).parents()
                             .andSelf()
                             .filter("[data-role='listview']");

    if (listview) {
      try {
        $(listview).listview('refresh');
      } catch (e) {
        // if the listview is not initialised, the above call with throw an exception
        // there doe snot appear to be any way to easily test for this state, so
        // we just swallow the exception here.
      }
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
      propertySearchViewModel.favourites.push(hydrateObject(this));
    });
  }
  if (state.recentSearches) {
    $.each(state.recentSearches, function () {
      propertySearchViewModel.recentSearches.push(hydrateObject(this));
    });
  }
}

// saves the current state
function persistentStateChanged() {
  var state = {
        recentSearches: propertySearchViewModel.recentSearches,
        favourites: propertySearchViewModel.favourites
      },
      jsonState = ko.toJSON(state);

  localStorage["appState"] = jsonState;
}

// create the various view models
var propertySearchViewModel = new ViewModel.PropertySearchViewModel(),
    searchResultsViewModel = new ViewModel.SearchResultsViewModel(),
    propertyViewModel = new ViewModel.PropertyViewModel(),
    favouritesViewModel = new ViewModel.FavouritesViewModel(propertySearchViewModel),
    propertyDataSource = new Model.PropertyDataSource({
      dataSource: new Model.JSONDataSource()
    });

$.mobile.defaultPageTransition = "slide";

function initializeViewModels() {

  // bind each view model to a jQueryMobile page
  ko.applyBindings(propertySearchViewModel, document.getElementById("propertySearchView"));
  ko.applyBindings(searchResultsViewModel, document.getElementById("searchResultsView"));
  ko.applyBindings(propertyViewModel, document.getElementById("propertyView"));
  ko.applyBindings(favouritesViewModel, document.getElementById("favouritesView"));

  // handle changes in persistent state
  propertySearchViewModel.favourites.subscribe(persistentStateChanged);
  propertySearchViewModel.recentSearches.subscribe(persistentStateChanged);

  // load app state if present
  var state = localStorage["appState"];
  if (state) {
    setState(state);
  }
};

// startup the app
$(document).ready(function () {
  if (window.device) {
    document.addEventListener("deviceready", initializeViewModels, false);
  } else {
    // if there is no 'device' immediately create the view mdoels. This is useful
    // for browser-based testing
    initializeViewModels();
  }
});
