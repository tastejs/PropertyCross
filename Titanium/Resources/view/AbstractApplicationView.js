var _ = require("underscore");
var ko = require("knockout");
var util = require("viewModel/util");

function AbstractApplicationView(applicationViewModel, propertySearchViewModel) {
	var that = this;

	this.viewStack = [];

	// subscribe to changes in the current view model, creating
	// the required view
	var previousBackStackLength = 0;
	applicationViewModel.currentViewModel.subscribe(function(viewModel) {
		var backStackLength = applicationViewModel.viewModelBackStack().length, view;

		if (previousBackStackLength < backStackLength) {
			// forward navigation
			var upperCamelCase = viewModel.template[0].toUpperCase() + viewModel.template.substr(1);
			view = new (require("view/" + upperCamelCase))(viewModel);
			that.navigateForwards(viewModel, view);
			that.viewStack.push(view);
		} else {
			// backward navigation
			view = that.viewStack.pop();
			that.navigateBackwards(view);
			view.dispose();
		}

		previousBackStackLength = backStackLength;

	});
	
	this.navigateForwards = function(viewModel, view) {
		// no-op
	};
	
	this.navigateBackwards = function(view) {
		// no-op
	};

	// handle changes in persistent state
	function persistentStateChanged() {
		var state = {
			recentSearches : propertySearchViewModel.recentSearches,
			favourites : propertySearchViewModel.favourites
		}, jsonState = ko.toJSON(state);

		Ti.App.Properties.setString('appState', jsonState);
	}


	propertySearchViewModel.favourites.subscribe(persistentStateChanged);
	propertySearchViewModel.recentSearches.subscribe(persistentStateChanged);

	var state = Ti.App.Properties.getString('appState');
	if (state && ( state = JSON.parse(state))) {
		if (state.favourites) {
			_.each(state.favourites, function(item) {
				propertySearchViewModel.favourites.push(util.hydrateObject(item));
			});
		}
		if (state.recentSearches) {
			_.each(state.recentSearches, function(item) {
				propertySearchViewModel.recentSearches.push(util.hydrateObject(item));
			});
		}
	}
}

module.exports = AbstractApplicationView;