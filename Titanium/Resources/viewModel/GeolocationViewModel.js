define("viewModel/GeolocationViewModel", function (require) {
  var ko = require("lib/knockout");
  var propertyDataSource = require("model/PropertyDataSource").Instance;
  var util = require("viewModel/util");

  function GeolocationViewModel() {
    /// <summary>
    /// The view model that backs the a search based on geolocation
    /// </summary>

    // ----- framework fields
    this.factoryName = "GeolocationViewModel";
    
    // ----- public fields
    this.lat = undefined;
    this.lon = undefined;
    this.firstElement = ko.observable(false);
    this.lastElement = ko.observable(false);
    this.displayString = undefined;
    this.totalResults = 0;

    // ----- public functions

    this.initialise = function (lat, lon) {
      /// <summary>
      /// Initializes the state of this view model.
      /// </summary>
      this.lat = lat;
      this.lon = lon;
      this.displayString = lat.toFixed(2) + ", " + lon.toFixed(2);
    };

    this.executeSearch = function (pageNumber, callback, errorCallback) {
      /// <summary>
      /// Executes a search by the geolocation represented by this view model for the given page
      /// </summary>
      propertyDataSource.findPropertiesByCoordinate(this.lat, this.lon, pageNumber, callback, errorCallback);
    };

  }

  util.registerFactory("GeolocationViewModel", GeolocationViewModel);

  return GeolocationViewModel;
});
