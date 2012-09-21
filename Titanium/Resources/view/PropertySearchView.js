var _ = require("underscore");
var ko = require("knockout");

module.exports = function(viewModel) {

	var window = Titanium.UI.createWindow();

	var view = Titanium.UI.createView({
		backgroundColor : 'white'
	});

	var instructions = Titanium.UI.createLabel({
		text : "Use the form below to search for houses to buy:",
		color : '#2F3E46',
		textAlign : 'left',
		font : {
			fontSize : 16
		},
		width : 'auto',
		height : 'auto',
		top : 15,
		left : 15
	});
	view.add(instructions);

	var textField = Ti.UI.createTextField({
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		color : '#336699',
		top : 50,
		left : 15,
		width : 250,
		height : 60
	});
	var searchDisplayStringSubscription = viewModel.searchDisplayString.subscribe(function(newValue) {
		textField.value = newValue;
	});
	textField.addEventListener('change', function(e) {
		viewModel.searchDisplayString(textField.value);
	});
	view.add(textField);

	var goButton = Titanium.UI.createButton({
		title : 'Go',
		top : 150,
		left : 15,
		width : 100,
		height : 50
	});
	goButton.addEventListener('click', function(e) {
		// ensure the keyboard is hidden
		textField.blur();
		viewModel.executeSearch();
	});
	view.add(goButton);

	var myLocationButton = Titanium.UI.createButton({
		title : 'My Location',
		top : 150,
		width : 100,
		height : 50
	});
	myLocationButton.addEventListener('click', function(e) {
		// ensure the keyboard is hidden
		textField.blur();
		viewModel.searchMyLocation();
	});
	view.add(myLocationButton);

	var userMessage = Titanium.UI.createLabel({
		text : "",
		color : '#2F3E46',
		textAlign : 'left',
		font : {
			fontSize : 16
		},
		width : 'auto',
		height : 'auto',
		top : 210,
		left : 15
	});
	var userMessageSubscription = viewModel.userMessage.subscribe(function(newValue) {
		userMessage.text = newValue;
	});
	view.add(userMessage);
	
	var recentSearchesLabel = Titanium.UI.createLabel({
		text : "Recent Searches",
		color : '#2F3E46',
		textAlign : 'left',
		font : {
			fontSize : 19,
			fontWeight: 'bold'
		},
		width : 'auto',
		height : 'auto',
		top : 250,
		left : 15
	});
	view.add(recentSearchesLabel);
	
	var tableView = Titanium.UI.createTableView({
		backgroundColor : 'white',
		width : 'auto',
		height : 'auto',
		top : 300,
		left : 15
	});
	tableView.addEventListener('click', function(e) {
		viewModel.selectLocation.call(viewModel.recentSearches()[e.index]);
	});
	function updateRecentSearches(items) {
		tableView.setData(_.map(items, function(item) {
			// create first row
			var row = Ti.UI.createTableViewRow();
			row.height = 82;
			// tip the abstraction off that the rows have the same layout
			row.className = 'myrows';
			row.add(Titanium.UI.createLabel({
				text : item.displayString,
				color : '#2F3E46',
				textAlign : 'left',
				font : {
					fontSize : 16,
					fontWeight : 'bold'
				}
			}));
			return row;
		}));
	}
	var recentSearchesSubscription = viewModel.recentSearches.subscribe(function(newValue) {
		updateRecentSearches(newValue);
	});
	updateRecentSearches(viewModel.recentSearches());
	view.add(tableView);

	var activityIndicator = Ti.UI.createActivityIndicator({
		message : 'Loading...',
		top : 10,
		left : 10,
		height : 'auto',
		width : 'auto'
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
	};
};
