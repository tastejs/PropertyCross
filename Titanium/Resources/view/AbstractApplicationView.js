var _ = require("lib/underscore");
var ko = require("lib/knockout");
var util = require("viewModel/util");

function AbstractApplicationView(application) {
	var that = this;
	var previousBackStackLength = 0;

	// subscribe to changes in the current view model, creating
	// the required view
	application.currentViewModel.subscribe(function(viewModel) {
		var backStackLength = application.viewModelBackStack().length;
		if (previousBackStackLength < backStackLength) {
			var viewName = application.currentView();
			var upperCamelCase = viewName[0].toUpperCase() + viewName.substr(1);
			var view = new (require("view/" + upperCamelCase))(viewModel);
			// forward navigation
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
	
	this.viewStack = [];

	this.navigateForwards = function(viewModel, view) {
		// no-op
	};

	this.navigateBackwards = function(view) {
		// no-op
	};
}

module.exports = AbstractApplicationView;  