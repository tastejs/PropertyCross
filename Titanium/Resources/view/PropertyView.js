var _ = require("underscore");
var ko = require("knockout");

module.exports = function(viewModel) {

	var window = Titanium.UI.createWindow();

	var view = Titanium.UI.createView({
		backgroundColor : 'white',
		layout : 'vertical'
	});

	var price = Titanium.UI.createLabel({
		text : '£ ' + viewModel.price,
		color : '#2F3E46',
		textAlign : 'left',
		font : {
			fontSize : '19dip',
			fontWeight : 'bold'
		},
		width : Ti.UI.FILL
	});
	view.add(price);

	var title = Titanium.UI.createLabel({
		text : viewModel.title,
		color : '#2F3E46',
		textAlign : 'left',
		font : {
			fontSize : '16dip'
		},
		width : Ti.UI.FILL
	});
	view.add(title);

	var image = Ti.UI.createImageView({
		image : viewModel.thumbnailUrl,
		height : '50%',
		width : Ti.UI.FILL
	});
	view.add(image);

	var description = Titanium.UI.createLabel({
		text : viewModel.bedrooms + ' bed ' + viewModel.propertyType,
		color : '#2F3E46',
		textAlign : 'left',
		font : {
			fontSize : '16dip'
		},
		width : Ti.UI.FILL
	});
	view.add(description);

	window.add(view);

	this.window = window;

	this.dispose = function() {
	};
};
