/// <reference path="..//intellisense.js" />

/*global $, ViewModel */

ViewModel.FavouritesViewModel = function (propertySearchViewModel) {
  /// <summary>
  /// The view model that backs the favourites view
  /// </summary>

  // ----- framework fields
  this.template = "favouritesView";
  
  // ----- public fields
  this.properties = propertySearchViewModel.favourites;

  // ----- public functions

  this.select = function (property) {
    propertyViewModel.copy(property);
    $.mobile.changePage("#" + propertyViewModel.template);
  };
};