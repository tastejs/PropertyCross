define("viewModel/PropertyViewModel", function (require) {
  var ko = require("lib/knockout");
  var util = require("viewModel/util");

  function PropertyViewModel(application) {
    /// <summary>
    /// Represents a single property listing
    /// </summary>

    // ----- framework fields
    this.template = "propertyView";
    this.factoryName = "PropertyViewModel";

    // ----- public fields
    this.price = ko.observable();
    this.bedrooms = ko.observable();
    this.bathrooms = ko.observable();
    this.propertyType = ko.observable();
    this.thumbnailUrl = ko.observable();
    this.guid = ko.observable();
    this.summary = ko.observable();
    this.title = ko.observable();
    this.isFavourite = ko.observable(false);

    // ----- public functions

    this.initialize = function (property) {
      /// <summary>
      /// Initializes this view model
      /// </summary>

      // copy and format the properties required by the UI
      this.guid(ko.utils.unwrapObservable(property.guid));
      this.price(ko.utils.unwrapObservable(property.price));
      this.bedrooms(ko.utils.unwrapObservable(property.bedrooms));
      this.bathrooms(ko.utils.unwrapObservable(property.bathrooms));
      this.propertyType(ko.utils.unwrapObservable(property.propertyType));
      this.thumbnailUrl(ko.utils.unwrapObservable(property.thumbnailUrl));
      this.summary(ko.utils.unwrapObservable(property.summary));

      // simplify the title a bit
      var title = ko.utils.unwrapObservable(property.title);
      if (title) {
        var titleParts = title.split(",");
        if (titleParts.length >= 2) {
          this.title(titleParts[0] + ", " + titleParts[1]);
        }
      }
    };

    this.select = function () {
      /// <summary>
      /// Selects this property, navigating to the property view
      /// </summary>
      application.navigateToProperty(this);
    };

    this.addToFavourites = function() {
      /// <summary>
      /// Adds this property to the favourites list
      /// </summary>
      application.addToFavourites(this);
    };
  }

  util.registerFactory("PropertyViewModel", PropertyViewModel);

  return PropertyViewModel;
});