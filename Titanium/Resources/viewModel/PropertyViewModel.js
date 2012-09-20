define("viewModel/PropertyViewModel", function (require) {
  var ko = require("lib/knockout");
  var application = require("viewModel/ApplicationViewModel").Instance;
  var util = require("viewModel/util");

  function PropertyViewModel() {
    /// <summary>
    /// Represents a single property listing
    /// </summary>

    var titleParts;

    // ----- framework fields
    this.template = "propertyView";
    this.factoryName = "PropertyViewModel";

    // ----- public fields
    this.price = undefined;
    this.bedrooms = undefined;
    this.bathrooms = undefined;
    this.propertyType = undefined;
    this.thumbnailUrl = undefined;
    this.guid = undefined;
    this.summary = undefined;
    this.title = undefined;
    this.isFavourite = ko.observable(false);

    // ----- public functions

    this.initialize = function (property) {
      /// <summary>
      /// Initializes this view model
      /// </summary>

      // copy and format the properties required by the UI
      this.price = property.price;
      this.bedrooms = property.bedrooms;
      this.bathrooms = property.bathrooms;
      this.propertyType = property.propertyType;
      this.thumbnailUrl = property.thumbnailUrl;
      this.guid = property.guid;
      this.summary = property.summary;

      // simplify the title a bit
      if (property.title) {
        titleParts = property.title.split(",");
        if (titleParts.length >= 2) {
          this.title = titleParts[0] + ", " + titleParts[1];
        }
      }
    };

    this.select = function () {
      /// <summary>
      /// Selects this property, navigating to the property view
      /// </summary>
      application.navigateTo(this);
    };

  }

  util.registerFactory("PropertyViewModel", PropertyViewModel);

  return PropertyViewModel;
});