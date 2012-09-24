var _ = require("underscore");
var ko = require("knockout");

module.exports = function(viewModel) {

	var window = Titanium.UI.createWindow();

	var view = Titanium.UI.createView({
		backgroundColor : 'white',
		layout: 'vertical'
	});

	var price = Titanium.UI.createLabel({
		color : '#2F3E46',
		textAlign : 'left',
		font : {
			fontSize : '19dip',
			fontWeight : 'bold'
		},
		width: Ti.UI.FILL
	});
	view.add(price);

	var title = Titanium.UI.createLabel({
		color : '#2F3E46',
		textAlign : 'left',
		font : {
			fontSize : '16dip'
		},
		width: Ti.UI.FILL
	});
	view.add(title);

	var image = Ti.UI.createImageView({
		height: '50%',
		width: Ti.UI.FILL
	});
	view.add(image);

	var description = Titanium.UI.createLabel({
		color : '#2F3E46',
		textAlign : 'left',
		font : {
			fontSize : '16dip'
		},
		width: Ti.UI.FILL
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
