var _ = require("underscore");
var ko = require("knockout");
var PropertyViewModel = require("viewModel/PropertyViewModel");
var util = require("viewModel/util");

function SearchResultsViewModel() {

	var that = this;

	// framework fields
	this.template = "searchResultsView";
	this.factoryName = "SearchResultsViewModel";

	// ----- public properties

	this.isLoading = ko.observable(false);
	this.totalResults = undefined;
	this.pageNumber = ko.observable(1);
	this.searchLocation = undefined;
	this.properties = ko.observableArray();

	// ----- public functions

	this.initialize = function(searchLocation, results) {
		_.each(results.data, function(property) {
			var viewModel = new PropertyViewModel();
			viewModel.initialize(property);
			that.properties.push(viewModel);
		});

		that.searchLocation = searchLocation;
		that.totalResults = results.totalResults;
	};

	this.loadMore = function() {
		this.pageNumber(this.pageNumber() + 1);
		this.isLoading(true);
		this.searchLocation.executeSearch(this.pageNumber(), function(results) {
			that.isLoading(false);
			_.each(results.data, function(property) {
				var viewModel = new PropertyViewModel();
				viewModel.initialize(property);
				that.properties.push(viewModel);
			});
			that.pageNumber(that.pageNumber() + 1);
		});

	};
}

util.registerFactory("SearchResultsViewModel", SearchResultsViewModel);

module.exports = SearchResultsViewModel;
