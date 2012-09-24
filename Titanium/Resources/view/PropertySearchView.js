var _ = require("underscore");
var ko = require("knockout");

module.exports = function(viewModel) {

	var window = Titanium.UI.createWindow({
	});

	var view = Titanium.UI.createView({
		layout : 'vertical',
		top : '6dip',
		right : '6dip',
		bottom : '6dip',
		left : '6dip'
	});

	var instructions = Titanium.UI.createLabel({
		text : "Use the form below to search for houses to buy:",
		textAlign : 'left',
		font : {
			fontSize : '16dip'
		},
		width : Titanium.UI.FILL
	});
	view.add(instructions);

	var textField = Ti.UI.createTextField({
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		width : Titanium.UI.FILL
	});
	var searchDisplayStringSubscription = viewModel.searchDisplayString.subscribe(function(newValue) {
		textField.value = newValue;
	});
	textField.addEventListener('change', function(e) {
		viewModel.searchDisplayString(textField.value);
	});
	view.add(textField);

	var buttons = Titanium.UI.createView({
		layout : 'horizontal',
		height : Titanium.UI.SIZE
	});

	var goButton = Titanium.UI.createButton({
		title : 'Go',
		width: '50%'
	});
	goButton.addEventListener('click', function(e) {
		// ensure the keyboard is hidden
		textField.blur();
		viewModel.executeSearch();
	});
	buttons.add(goButton);

	var myLocationButton = Titanium.UI.createButton({
		title : 'My Location',
		width: '50%'
	});
	myLocationButton.addEventListener('click', function(e) {
		// ensure the keyboard is hidden
		textField.blur();
		viewModel.searchMyLocation();
	});
	buttons.add(myLocationButton);

	view.add(buttons);

	var userMessage = Titanium.UI.createLabel({
		text : "",
		textAlign : 'left',
		font : {
			fontSize : '16dip'
		},
		width : Titanium.UI.FILL
	});
	var userMessageSubscription = viewModel.userMessage.subscribe(function(newValue) {
		userMessage.text = newValue;
	});
	view.add(userMessage);

	var recentSearchesView = Titanium.UI.createView({
		layout : 'vertical',
		height : Titanium.UI.SIZE
	});

	var recentSearchesLabel = Titanium.UI.createLabel({
		text : "Recent Searches",
		textAlign : 'left',
		font : {
			fontSize : '19dip',
			fontWeight : 'bold'
		},
		width : Titanium.UI.FILL
	});
	recentSearchesView.add(recentSearchesLabel);

	var tableView = Titanium.UI.createTableView({
		width : Titanium.UI.FILL,
		height : Titanium.UI.SIZE
	});
	tableView.addEventListener('click', function(e) {
		// ensure the keyboard is hidden
		textField.blur();
		viewModel.selectLocation.call(viewModel.recentSearches()[e.index]);
	});
	function updateRecentSearches(items) {
		tableView.setData(_.map(items, function(item) {
			// create first row
			var row = Ti.UI.createTableViewRow();
			row.height = '41dip';
			// tip the abstraction off that the rows have the same layout
			row.className = 'myrows';
			row.add(Titanium.UI.createLabel({
				text : item.displayString,
				textAlign : 'left',
				font : {
					fontSize : '16dip',
					fontWeight : 'bold'
				},
				left : 0
			}));
			row.add(Titanium.UI.createLabel({
				text : item.totalResults,
				textAlign : 'right',
				font : {
					fontSize : '16dip',
					fontWeight : 'bold'
				},
				right : 0
			}));
			return row;
		}));
	}

	var recentSearchesSubscription = viewModel.recentSearches.subscribe(updateRecentSearches);
	updateRecentSearches(viewModel.recentSearches());
	recentSearchesView.add(tableView);

	function toggleRecentSearches() {
		if (viewModel.recentSearches().length > 0 && viewModel.locations().length === 0) {
			view.add(recentSearchesView);
		} else {
			view.remove(recentSearchesView);
		}
	}

	var recentSearchesVisibilityRecentSearchesSubscription = viewModel.recentSearches.subscribe(toggleRecentSearches);
	var recentSearchesVisibilityLocationsSubscription = viewModel.locations.subscribe(toggleRecentSearches);
	toggleRecentSearches();

	var locationsView = Titanium.UI.createView({
		layout : 'vertical',
		height : Titanium.UI.SIZE
	});

	var locationsLabel = Titanium.UI.createLabel({
		text : "Please select a location below:",
		textAlign : 'left',
		font : {
			fontSize : '19dip',
			fontWeight : 'bold'
		},
		width : Titanium.UI.FILL
	});
	locationsView.add(locationsLabel);

	var tableView = Titanium.UI.createTableView({
		width : Titanium.UI.FILL,
		height : Titanium.UI.SIZE
	});
	tableView.addEventListener('click', function(e) {
		// ensure the keyboard is hidden
		textField.blur();
		viewModel.selectLocation.call(viewModel.locations()[e.index]);
	});
	function updateLocations(items) {
		tableView.setData(_.map(items, function(item) {
			// create first row
			var row = Ti.UI.createTableViewRow();
			row.height = '41dip';
			// tip the abstraction off that the rows have the same layout
			row.className = 'myrows';
			row.add(Titanium.UI.createLabel({
				text : item.displayString,
				textAlign : 'left',
				font : {
					fontSize : '16dip',
					fontWeight : 'bold'
				},
				left : 0
			}));
			return row;
		}));
	}

	var locationsSubscription = viewModel.locations.subscribe(updateLocations);
	updateLocations(viewModel.locations());
	locationsView.add(tableView);

	function toggleLocations() {
		if (viewModel.locations().length > 0) {
			view.add(locationsView);
		} else {
			view.remove(locationsView);
		}
	}

	var locationsVisibilityRecentSearchesSubscription = viewModel.recentSearches.subscribe(toggleLocations);
	var locationsVisibilityLocationsSubscription = viewModel.locations.subscribe(toggleLocations);
	toggleLocations();

	var activityIndicator = Ti.UI.createActivityIndicator({
		message : 'Loading...',
		width : Titanium.UI.FILL,
		height : Titanium.UI.FILL
	});

	// On iOS, the activity indicator must be added to a window or view for it to appear
	if (Ti.Platform.name === 'iPhone OS') {
		window.add(activityIndicator);
	}

	var isSearchEnabledSubscription = viewModel.isSearchEnabled.subscribe(function(newValue) {
		if (newValue) {
			activityIndicator.hide();
		} else {
			activityIndicator.show();
		}
	});

	window.add(view);
	this.window = window;

	this.dispose = function() {
		searchDisplayStringSubscription.dispose();
		userMessageSubscription.dispose();
		recentSearchesSubscription.dispose();
		isSearchEnabledSubscription.dispose();
		recentSearchesVisibilityRecentSearchesSubscription.dispose();
		recentSearchesVisibilityLocationsSubscription.dispose();
		locationsSubscription.dispose();
		locationsVisibilityRecentSearchesSubscription.dispose();
		locationsVisibilityLocationsSubscription.dispose();
	};
};
