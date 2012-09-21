var ko = require("knockout");
var propertyDataSource = require("model/PropertyDataSource").Instance;
var util = require("viewModel/util");

function LocationViewModel() {
	/// <summary>
	/// The view model that backs the a search based on a location string
	/// </summary>

	// ----- framework fields
	this.factoryName = "LocationViewModel";

	// ----- public fields

	// the string used to search the Nestoria APIs
	this.searchString = undefined;

	// this string displayed to the end-user
	this.displayString = undefined;

	this.firstElement = ko.observable(false);
	this.lastElement = ko.observable(false);
	this.totalResults = 0;

	// ----- framework functions

	this.initialise = function(searchString) {
		/// <summary>
		/// Initializes the state of this view model.
		/// </summary>
		this.searchString = searchString;
		this.displayString = searchString;
	};

	this.initialiseDisambiguated = function(location) {
		/// <summary>
		/// Initializes the state of this view model via a location that has a 'display name' which is shown to the
		/// user, which differs from the name used to search the Nestoria APIs
		/// </summary>
		this.searchString = location.placeName;
		this.displayString = location.longTitle;
	};

	this.executeSearch = function(pageNumber, callback, errorCallback) {
		/// <summary>
		/// Executes a search by the search string represented by this view model for the given page
		/// </summary>
		propertyDataSource.findProperties(this.searchString, pageNumber, callback, errorCallback);
	};
}

util.registerFactory("LocationViewModel", LocationViewModel);

module.exports = LocationViewModel; 