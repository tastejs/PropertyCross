/// <reference path="..//intellisense.js" />

/*global $, ViewModel, ko, propertyDataSource, Model, navigator, searchResultsViewModel, favouritesViewModel */

ViewModel.PropertySearchViewModel = function () {
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
  this.maxRecentSearch = 5;
  this.searchDisplayString = ko.observable("");
  this.userMessage = ko.observable();
  this.searchLocation = undefined;
  this.isSearchEnabled = ko.observable(true);
  this.locationEnabled = ko.observable(true);
  this.locations = ko.observableArray();
  this.favourites = ko.observableArray();
  this.recentSearches = ko.observableArray();

  // synchronised the search display string and the search-string
  this.searchDisplayString.subscribe(function () {
    if (synchroniseSearchStrings) {
      var newLocation = new ViewModel.LocationViewModel();
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

      if (results.responseCode === Model.PropertySearchResponseCode.propertiesFound) {

        if (results.totalResults === null) {
          that.userMessage("There were no properties found for the given location.");
        } else {
          // if properties were found, navigate to the search results view model
          that.searchLocation.totalResults = results.totalResults;
          that.updateRecentSearches();

          searchResultsViewModel.initialize(that.searchLocation, results);
          $.mobile.changePage("#" + searchResultsViewModel.template);
        }        
      } else if (results.responseCode === Model.PropertySearchResponseCode.ambiguousLocation) {

        // if the location was ambiguous, display the list of options
        that.locations.removeAll();
        $.each(results.data, function () {
          var viewModel = new ViewModel.LocationViewModel();
          viewModel.initialiseDisambiguated(this);
          that.locations.push(viewModel);
        });

      } else {
        that.userMessage("The location given was not recognised.");
      }

      that.isSearchEnabled(true);
    }

    this.searchLocation.executeSearch(1, successCallback, errorCallback);
  };

  this.updateRecentSearches = function () {
    /// <summary>
    /// Updates the recent search list
    /// </summary>

    // check to see whether this location already appears in the list
    var locationPresent = false;
    $.each(that.recentSearches(), function () {
      if (this.displayString === that.searchLocation.displayString) {
        locationPresent = true;
      }
    });
    if (locationPresent) {
      return;
    }

    // add this new item
    if (that.recentSearches().length > that.maxRecentSearch) {
      that.recentSearches.pop();
    }
    that.recentSearches.unshift(that.searchLocation);
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
      var location = new ViewModel.GeolocationViewModel();
      location.initialise(result.coords.latitude, result.coords.longitude);

      synchroniseSearchStrings = false;
      that.searchLocation = location;
      that.searchDisplayString(location.displayString);
      synchroniseSearchStrings = true;

      that.executeSearch();
    }

    function  errorCallback() {
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
    $.mobile.changePage("#" + favouritesViewModel.template);
  };
  
  this.getFavouriteByGuid = function (guid) {
    /// <summary>
    /// Gets the a favourite by GUID, returning null if it is not found
    /// </summary>
    var existingFavourite = null;

    // check if it already favourite
    $.each(that.favourites(), function () {
      if (this.guid === guid) {
        existingFavourite = this;
      }
    });

    return existingFavourite;
  };

  this.addToFavourites = function (propertyViewModel) {
    /// <summary>
    /// Adds the given property view model to the list of favourites
    /// </summary>
    var existingFavourite = that.getFavouriteByGuid(propertyViewModel.guid);

    // add or remove
    if (!existingFavourite) {
      propertyViewModel.isFavourite(true);
      that.favourites.push(propertyViewModel);
    } else {
      propertyViewModel.isFavourite(false);
      that.favourites.remove(existingFavourite);
    }

  };
};
