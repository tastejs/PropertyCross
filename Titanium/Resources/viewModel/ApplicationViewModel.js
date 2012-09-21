var ko = require("knockout");
var util = require("viewModel/util");

function ApplicationViewModel() {
	/// <summary>
	/// The view model that manages the view model back-stack
	/// </summary>

	var that = this;

	// ----- public fields

	// the back stack that represents the applications current state
	this.viewModelBackStack = ko.observableArray();

	// A boolean dependant observable that is true if this application
	// needs to handle the back button, and false otherwise.
	this.backButtonRequired = ko.computed(function() {
		return this.viewModelBackStack().length > 1;
	}, this);

	// Gets the view model that is top of the back-stack.
	this.currentViewModel = ko.computed(function() {
		return this.viewModelBackStack()[this.viewModelBackStack().length - 1];
	}, this);

	// Gets the template name for the top-most view model
	this.currentView = ko.computed(function() {
		var view = "";
		if (this.viewModelBackStack().length !== 0) {
			view = this.viewModelBackStack()[this.viewModelBackStack().length - 1].template;
		}
		return view;
	}, this);

	// ----- public functions

	this.navigateTo = function(viewModel) {
		/// <summary>
		/// Navigates to the given view model by placing it on the top of the back-stack.
		/// </summary>
		this.viewModelBackStack.push(viewModel);
	};

	this.back = function() {
		/// <summary>
		/// Navigates backwards.
		/// </summary>
		this.viewModelBackStack.pop();
	};

	this.getState = function() {
		/// <summary>
		/// Gets the application state as a JSON string
		/// </summary>

		var
		i, viewModel, state = ko.observableArray();

		for ( i = 0; i < that.viewModelBackStack().length; i++) {
			viewModel = that.viewModelBackStack()[i];
			state.push(viewModel);
		}
		return ko.toJSON(state);
	};

	this.setState = function(stateString) {
		/// <summary>
		/// Sets the application based on the given JSON string
		/// </summary>

		var
		i, viewModel, state = Global.JSON.parse(stateString);

		that.viewModelBackStack.removeAll();
		for ( i = 0; i < state.length; i++) {
			viewModel = util.hydrateObject(state[i]);
			that.viewModelBackStack.push(viewModel);
		}
	};
}

ApplicationViewModel.Instance = new ApplicationViewModel();

module.exports = ApplicationViewModel;
