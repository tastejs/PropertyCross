var _ = require("underscore");
var ko = require("knockout");

module.exports = function(viewModel) {

	var window = Titanium.UI.createWindow();

	var view = Titanium.UI.createView({
		backgroundColor : 'white'
	});

	var price = Titanium.UI.createLabel({
		color : '#2F3E46',
		textAlign : 'left',
		font : {
			fontSize : 19,
			fontWeight : 'bold'
		},
		width : 'auto',
		height : 'auto',
		top : 15,
		left : 15
	});
	view.add(price);

	var title = Titanium.UI.createLabel({
		color : '#2F3E46',
		textAlign : 'left',
		font : {
			fontSize : 16
		},
		width : 'auto',
		height : 'auto',
		top : 50,
		left : 15
	});
	view.add(title);

	var image = Ti.UI.createImageView({
		top : 75,
		left : 15,
		width: Titanium.UI.FILL
	});
	view.add(image);

	var description = Titanium.UI.createLabel({
		color : '#2F3E46',
		textAlign : 'left',
		font : {
			fontSize : 16
		},
		width : 'auto',
		height : 'auto',
		left : 15
	});
	view.add(description);

	window.add(view);
	this.window = window;

	function update() {
		price.text = '£ ' + viewModel.price;
		title.text = viewModel.title;
		image.image = viewModel.thumbnailUrl;
		description.text = viewModel.bedrooms + ' bed ' + viewModel.propertyType
	}
	update();

	this.dispose = function() { };
};
