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

  localStorage.setItem("appState", jsonState);
}

// create the various view models
var propertySearchViewModel = new ViewModel.PropertySearchViewModel(),
    searchResultsViewModel = new ViewModel.SearchResultsViewModel(),
    propertyViewModel = new ViewModel.PropertyViewModel(),
    favouritesViewModel = new ViewModel.FavouritesViewModel(propertySearchViewModel),
    propertyDataSource = new Model.PropertyDataSource({
      dataSource: new Model.JSONDataSource()
    }),
    updatingBackButtonListener = false;

function initializeViewModels() {

  // load app state if present
  var state = localStorage.getItem("appState");
  if (state) {
    setState(state);
  }


  // bind each view model to a jQueryMobile page
  ko.applyBindings(propertySearchViewModel, document.getElementById("propertySearchView"));
  ko.applyBindings(searchResultsViewModel, document.getElementById("searchResultsView"));
  ko.applyBindings(propertyViewModel, document.getElementById("propertyView"));
  ko.applyBindings(favouritesViewModel, document.getElementById("favouritesView"));

  // handle changes in persistent state
  propertySearchViewModel.favourites.subscribe(persistentStateChanged);
  propertySearchViewModel.recentSearches.subscribe(persistentStateChanged);



  $(document).bind('pagechange', function () {

    var currentPageId = ($.mobile.activePage).attr("id"),
        backButtonRequired = false;

    if (currentPageId !== "propertySearchView") {
      backButtonRequired = true;
    }

    // for some reason when you add the evnet listener for the backbutton event, the supplied function
    // is invoked immediately, even though the back button was not pressed. Hence this boolean state
    // variable is used to detect this.
    updatingBackButtonListener = true;

    if (backButtonRequired) {
      document.addEventListener("backbutton", onBackButton, false);
    } else {
      document.removeEventListener("backbutton", onBackButton, false);
    }

    updatingBackButtonListener = false;

  });

};

function onBackButton() {

  if (updatingBackButtonListener)
    return;

  // the standard history.go(-1) and other methods for navigating back do not work, so we have to do it
  // manually here
  var currentPageId = ($.mobile.activePage).attr("id");


  if (currentPageId === "searchResultsView") {
    $.mobile.changePage("#propertySearchView");
  }
  if (currentPageId === "favouritesView") {
    $.mobile.changePage("#propertySearchView");
  }
  if (currentPageId === "propertyView") {
    $.mobile.changePage("#searchResultsView");
  }
}


// startup the app
document.addEventListener("deviceready", initializeViewModels, false);


