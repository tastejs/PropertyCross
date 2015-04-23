define(function (require, exports, module) {
  var ko = require("lib/knockout");
  var PropertyViewModel = require("viewModel/PropertyViewModel");
  var util = require("viewModel/util");

  function SearchResultsViewModel(application, refreshListview) {

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
      this.properties(results.data.map(function (property) {
        var viewModel = new PropertyViewModel(application);
        viewModel.initialize(property);
        return viewModel;
      }));
      that.searchLocation(searchLocation);
      that.totalResults(results.totalResults);
    };

    this.loadMore = function () {
      this.pageNumber(this.pageNumber() + 1);
      this.isLoading(true);
      this.searchLocation().executeSearch(this.pageNumber()).done(function (results) {
        that.isLoading(false);
        results.data.forEach(function (property) {
          var viewModel = new PropertyViewModel(application);
          viewModel.initialize(property);
          that.properties.push(viewModel);
        });
        that.pageNumber(that.pageNumber() + 1);
      });

    };
    this.refreshListview = refreshListview;
  }

  util.registerFactory("SearchResultsViewModel", SearchResultsViewModel);

  module.exports = SearchResultsViewModel;
});
