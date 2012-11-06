define(function (require, exports, module) {
  var _ = require("lib/underscore");
  var ko = require("lib/knockout");
  var PropertySearchResponseCode = require("model/PropertySearchResponseCode");
  var LocationViewModel = require("viewModel/LocationViewModel");
  var GeolocationViewModel = require("viewModel/GeolocationViewModel");
  var util = require("viewModel/util");

  function PropertySearchViewModel(application) {
    /// <summary>
    /// The 'top level' property search view model.
    /// </summary>

    // ----- private fields
    var synchroniseSearchStrings = true,
        that = this;

    // ----- framework fields
    this.template = "propertySearchView";
    this.factoryName = "PropertySearchViewModel";

    // ----- public fields
    this.searchDisplayString = ko.observable("");
    this.userMessage = ko.observable();
    this.searchLocation = new LocationViewModel(application);
    this.isSearchEnabled = ko.observable(true);
    this.locationEnabled = ko.observable(true);
    this.locations = ko.observableArray();
    this.recentSearches = application.recentSearches;

    // synchronised the search display string and the search-string
    this.searchDisplayString.subscribe(function () {
      if (synchroniseSearchStrings) {
        var newLocation = new LocationViewModel(application);
        newLocation.initialise(that.searchDisplayString());
        that.searchLocation = newLocation;
      }
    });

    // ----- public functions

    this.executeSearch = function () {
      /// <summary>
      /// Executes a search based on the current search string
      /// </summary>

      that.userMessage("");
      that.isSearchEnabled(false);

      function errorCallback(error) {
        /// <summary>
        /// A callback that is invoked if the search fails, in order to report the failure to the end user
        /// </summary>
        that.userMessage("An error occurred while searching. Please check your network connection and try again.");
        that.isSearchEnabled(true);
      }

      function successCallback(results) {
        /// <summary>
        /// A callback that is invoked if the search succeeds
        /// </summary>

        if (results.responseCode === PropertySearchResponseCode.propertiesFound) {

          if (results.totalResults === null) {
            that.userMessage("There were no properties found for the given location.");
          } else {
            // if properties were found, navigate to the search results view model
            that.searchLocation.totalResults = results.totalResults;
            application.addToRecentSearches(that.searchLocation);
            application.navigateToSearchResults(that.searchLocation, results);
          }
        } else if (results.responseCode === PropertySearchResponseCode.ambiguousLocation) {

          // if the location was ambiguous, display the list of options
          that.locations.removeAll();
          _.forEach(results.data, function (item) {
            var viewModel = new LocationViewModel(application);
            viewModel.initialiseDisambiguated(item);
            that.locations.push(viewModel);
          });

        } else {
          that.userMessage("The location given was not recognised.");
        }

        that.isSearchEnabled(true);
      }

      this.searchLocation.executeSearch(1, successCallback, errorCallback);
    };

    this.searchMyLocation = function () {
      /// <summary>
      /// Performs a search based on the current geolocation
      /// </summary>

      // check that the use of location is enabled.
      if (this.locationEnabled() === false) {
        that.userMessage("The use of location is currently disabled. Please enable via the 'about' page.");
        return;
      }

      function successCallback(result) {
        var location = new GeolocationViewModel(application);
        location.initialise(result.coords.latitude, result.coords.longitude);

        synchroniseSearchStrings = false;
        that.searchLocation = location;
        that.searchDisplayString(location.displayString);
        synchroniseSearchStrings = true;

        that.executeSearch();
      }

      function errorCallback() {
        that.userMessage("Unable to detect current location. Please ensure location is turned on in your phone settings and try again.");
      }

      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    };

    this.selectLocation = function () {
      /// <summary>
      /// A function that is invoked when a search location is clicked
      /// </summary>
      var location = this;

      synchroniseSearchStrings = false;
      that.searchLocation = location;
      that.searchDisplayString(location.displayString);
      synchroniseSearchStrings = true;

      that.locations.removeAll();
      that.executeSearch();
    };

    this.viewFavourites = function () {
      /// <summary>
      /// Navigates to the favourites view
      /// </summary>
      application.navigateToFavourites(this.favourites);
    };
  }

  util.registerFactory("PropertySearchViewModel", PropertySearchViewModel);

  module.exports = PropertySearchViewModel;
});
