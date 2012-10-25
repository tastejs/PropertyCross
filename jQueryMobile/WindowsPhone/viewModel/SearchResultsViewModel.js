/*global $, ViewModel, ko, propertyDataSource, propertyViewModel */

ViewModel.SearchResultsViewModel = function () {

  var that = this;

  // framework fields
  this.template = "searchResultsView";
  this.factoryName = "SearchResultsViewModel";

  // ----- public properties

  this.isLoading = ko.observable(false);
  this.totalResults = ko.observable();
  this.pageNumber = ko.observable(1);
  this.searchLocation = ko.observable(undefined)
  this.properties = ko.observableArray();

  // ----- public functions

  this.initialize = function (searchLocation, results) {
    // update the observable array with one atomic action
    that.properties.removeAll();
    that.properties(results.data);

    that.searchLocation(searchLocation);
    that.totalResults(results.totalResults);
  };

  this.select = function (property) {
    propertyViewModel.initialize(property);
    $.mobile.changePage("#" + propertyViewModel.template);
  };

  this.loadMore = function () {
    this.pageNumber(this.pageNumber() + 1);
    this.isLoading(true);
    this.searchLocation().executeSearch(this.pageNumber(), function (results) {
      that.isLoading(false);
      $.each(results.data, function () {
        that.properties.push(this);
      });
      that.pageNumber(that.pageNumber() + 1);
    });

  };
};