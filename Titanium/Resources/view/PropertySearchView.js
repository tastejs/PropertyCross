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
		width : 100,
		height : 50
	});
	goButton.addEventListener('click', function(e) {
		// ensure the keyboard is hidden
		textField.blur();
		viewModel.executeSearch();
	});
	view.add(goButton);

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
	var userMessageSubscription = viewModel.userMessage.subscribe(function (newValue) {
		userMessage.text = newValue;
	});
	view.add(userMessage);

	window.add(view);
	this.window = window;


	this.dispose = function() {
		searchDisplayStringSubscription.dispose();
		userMessageSubscription.dispose();
	};
};
