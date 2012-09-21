var _ = require("underscore");
var propertyDataSource = require("model/PropertyDataSource").Instance;
var SearchResultsViewModel = require("viewModel/SearchResultsViewModel");
var SearchResultsView = require("view/SearchResultsView");
var PropertyView = require("view/PropertyView");
var application = require("viewModel/ApplicationViewModel").Instance;

propertyDataSource.findPropertiesByCoordinate(54.98, -1.61, 0, function(response) {
	var viewModel = new SearchResultsViewModel();
	//viewModel.initialize(that.searchLocation, results);
	viewModel.initialize("Newcastle upon Tyne", response);
	application.navigateTo(viewModel);
	// var searchResultsView = new SearchResultsView(viewModel);
	// // win.add(searchResultsView.window);
	// var propertyView = new PropertyView(viewModel.properties()[0]);
	// propertyView.window.open();
});

var previousBackStackLength = 0;
var viewStack = [];

// subscribe to changes in the current view model, creating
// the required view
application.currentViewModel.subscribe(function(viewModel) {
	var backStackLength = application.viewModelBackStack().length, view;

	if (viewModel !== undefined) {

		if (previousBackStackLength < backStackLength) {
			// forward navigation
			var upperCamelCase = viewModel.template[0].toUpperCase() + viewModel.template.substr(1);
			view = new (require("view/" + upperCamelCase))(viewModel);
			viewStack.push(view);
			view.window.open();

		} else {
			// backward navigation
			view = viewStack.pop();
			view.window.close();
			view.dispose();
		}

	}
	previousBackStackLength = backStackLength;

});
