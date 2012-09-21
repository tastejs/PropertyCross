var _ = require("underscore");
var ko = require("knockout");
var application = require("viewModel/ApplicationViewModel").Instance;
var PropertySearchResponseCode = require("model/PropertySearchResponseCode");
var LocationViewModel = require("viewModel/LocationViewModel");
var SearchResultsViewModel = require("viewModel/SearchResultsViewModel");
var GeolocationViewModel = require("viewModel/GeolocationViewModel");
var FavouritesViewModel = require("viewModel/FavouritesViewModel");
var AboutViewModel = require("viewModel/AboutViewModel");
var util = require("viewModel/util");

function PropertySearchViewModel() {
	/// <summary>
	/// The 'top level' property search view model.
	/// </summary>

	// ----- private fields
	var synchroniseSearchStrings = true, that = this;

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
	this.searchDisplayString.subscribe(function() {
		if (synchroniseSearchStrings) {
			var newLocation = new LocationViewModel();

			newLocation.initialise(that.searchDisplayString());
			that.searchLocation = newLocation;
		}
	});

	// ----- public functions

	this.executeSearch = function() {
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
					that.updateRecentSearches();
					var viewModel = new SearchResultsViewModel();
					viewModel.initialize(that.searchLocation, results);
					application.navigateTo(viewModel);
				}
			} else if (results.responseCode === PropertySearchResponseCode.ambiguousLocation) {

				// if the location was ambiguous, display the list of options
				that.locations.removeAll();
				_.each(results.data, function(item) {
					var viewModel = new LocationViewModel();
					viewModel.initialiseDisambiguated(item);
					that.locations.push(viewModel);
				});
				that.updateListStyling(that.locations);

			} else {
				that.userMessage("The location given was not recognised.");
			}

			that.isSearchEnabled(true);
		}


		this.searchLocation.executeSearch(1, successCallback, errorCallback);
	};

	this.updateRecentSearches = function() {
		/// <summary>
		/// Updates the recent search list
		/// </summary>

		// check to see whether this location already appears in the list
		var locationPresent = false;
		_.each(that.recentSearches(), function(item) {
			if (item.displayString === that.searchLocation.displayString) {
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

		that.updateListStyling(that.recentSearches);
	};

	this.updateListStyling = function(observableArray) {
		/// <summary>
		/// Updates the first and last element in a list
		/// </summary>
		var
		i;

		if (observableArray()) {
			for ( i = 0; i < observableArray().length; i++) {
				observableArray()[i].firstElement(i === 0);
				observableArray()[i].lastElement(i === observableArray().length - 1);
			}
		}
	};

	this.searchMyLocation = function() {
		/// <summary>
		/// Performs a search based on the current geolocation
		/// </summary>

		// check that the use of location is enabled.
		if (this.locationEnabled() === false) {
			that.userMessage("The use of location is currently disabled. Please enable via the 'about' page.");
			return;
		}

		function successCallback(result) {
			if (result.error) {
				that.userMessage("Unable to detect current location. Please ensure location is turned on in your phone settings and try again.");
				return;
			}
			var location = new GeolocationViewModel();
			location.initialise(result.coords.latitude, result.coords.longitude);

			synchroniseSearchStrings = false;
			that.searchLocation = location;
			that.searchDisplayString(location.displayString);
			synchroniseSearchStrings = true;

			that.executeSearch();
		}

		Titanium.Geolocation.getCurrentPosition(successCallback);
	};

	this.selectLocation = function() {
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

	this.viewFavourites = function() {
		/// <summary>
		/// Navigates to the favourites view
		/// </summary>
		var viewModel = new FavouritesViewModel(this);
		application.navigateTo(viewModel);
	};

	this.viewAbout = function() {
		/// <summary>
		/// Navigates to the about view
		/// </summary>
		var viewModel = new AboutViewModel(this);
		application.navigateTo(viewModel);
	};

	this.getFavouriteByGuid = function(guid) {
		/// <summary>
		/// Gets the a favourite by GUID, returning null if it is not found
		/// </summary>
		var existingFavourite = null;

		// check if it already favourite
		_.each(that.favourites(), function(item) {
			if (this.guid === guid) {
				existingFavourite = item;
			}
		});

		return existingFavourite;
	};

	this.addToFavourites = function(propertyViewModel) {
		/// <summary>
		/// Adds the given property view model to the list of favourites
		/// </summary>
		var existingFavourite = this.getFavouriteByGuid(propertyViewModel.guid);

		// add or remove
		if (!existingFavourite) {
			propertyViewModel.isFavourite(true);
			this.favourites.push(propertyViewModel);
		} else {
			propertyViewModel.isFavourite(false);
			this.favourites.remove(existingFavourite);
		}

	};
}

util.registerFactory("PropertySearchViewModel", PropertySearchViewModel);

module.exports = PropertySearchViewModel;
