/// <reference path="..//intellisense.js" />

/*global ko, application, ViewModel*/

ViewModel.PropertyViewModel = function () {
  /// <summary>
  /// Represents a single property listing
  /// </summary>

  // ----- framework fields
  this.template = "propertyView";
  this.factoryName = "PropertyViewModel"

  // ----- public fields
  this.price = ko.observable();
  this.bedrooms = ko.observable();
  this.bathrooms = ko.observable();
  this.propertyType = ko.observable();
  this.thumbnailUrl = ko.observable();
  this.guid = undefined;
  this.summary = ko.observable();
  this.title = ko.observable();
  this.isFavourite = ko.observable(false);

  // ----- public functions

  this.initialize = function (property) {
    /// <summary>
    /// Initializes this view model
    /// </summary>
    var titleParts;

    // copy and format the properties required by the UI
    this.guid = property.guid;
    this.price(property.price);
    this.bedrooms(property.bedrooms);
    this.bathrooms(property.bathrooms);
    this.propertyType(property.propertyType);
    this.thumbnailUrl(property.thumbnailUrl);
    this.summary(property.summary);

    // simplify the title a bit
    if (property.title) {
      titleParts = property.title.split(",");
      if (titleParts.length >= 2) {
        this.title(titleParts[0] + ", " + titleParts[1]);
      }
    }
  };

  this.copy = function (propertyViewModel) {
    /// <summary>
    /// Copy this view model
    /// </summary>
    this.price(propertyViewModel.price());
    this.bedrooms(propertyViewModel.bedrooms());
    this.bathrooms(propertyViewModel.bathrooms());
    this.propertyType(propertyViewModel.propertyType());
    this.thumbnailUrl(propertyViewModel.thumbnailUrl());
    this.guid = propertyViewModel.guid;
    this.summary(propertyViewModel.summary());
    this.title(propertyViewModel.title());
  };
};
