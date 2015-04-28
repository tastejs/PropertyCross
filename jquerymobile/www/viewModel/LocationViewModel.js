define(function (require, exports, module) {
  var ko = require("lib/knockout");
  var util = require("viewModel/util");

  function LocationViewModel(application) {
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
    this.totalResults = 0;

    // ----- framework functions

    this.initialise = function (searchString) {
      /// <summary>
      /// Initializes the state of this view model.
      /// </summary>
      this.searchString = searchString;
      this.displayString = searchString;
    };

    this.initialiseDisambiguated = function (location) {
      /// <summary>
      /// Initializes the state of this view model via a location that has a 'display name' which is shown to the
      /// user, which differs from the name used to search the Nestoria APIs
      /// </summary>
      this.searchString = location.placeName;
      this.displayString = location.longTitle;
    };

    this.executeSearch = function (pageNumber) {
      /// <summary>
      /// Executes a search by the search string represented by this view model for the given page
      /// </summary>
      return application.propertyDataSource.findProperties(this.searchString, pageNumber);
    };
  }

  util.registerFactory("LocationViewModel", LocationViewModel);

  module.exports = LocationViewModel;
});
