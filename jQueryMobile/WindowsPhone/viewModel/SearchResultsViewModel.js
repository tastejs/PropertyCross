define(function (require) {
  var $ = require("lib/jquery");
  var ko = require("lib/knockout");
  var PropertyViewModel = require("./PropertyViewModel");
  var util = require("./util");

  function SearchResultsViewModel(application) {

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
      this.properties($.map(results.data, function(result) {
        var viewModel = new PropertyViewModel(application);
        viewModel.initialize(result);
        return viewModel;
      }));
      that.searchLocation(searchLocation);
      that.totalResults(results.totalResults);
    };

    this.loadMore = function () {
      this.pageNumber(this.pageNumber() + 1);
      this.isLoading(true);
      this.searchLocation().executeSearch(this.pageNumber(), function (results) {
        that.isLoading(false);
        $.each(results.data, function () {
          var viewModel = new PropertyViewModel(application);
          viewModel.initialize(this);
          that.properties.push(viewModel);
        });
        that.pageNumber(that.pageNumber() + 1);
      });

    };
  }

  util.registerFactory("SearchResultsViewModel", SearchResultsViewModel);

  return SearchResultsViewModel;
});
