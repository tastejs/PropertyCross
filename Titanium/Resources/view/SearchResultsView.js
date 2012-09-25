var _ = require("underscore");
var ko = require("knockout");

function createRow(imageUrl, title, description) {
	var row = Ti.UI.createTableViewRow({
		hasChild: Ti.Platform.osname === "iphone"
	});
	row.height = '82dip';
	// tip the abstraction off that the rows have the same layout
	row.className = 'myrows';
	// use an image view rather than a plain view
	row.add(Ti.UI.createImageView({
		url : imageUrl,
		top : '11dip',
		left : '6dip',
		width : '80dip',
		height : '60dip'
	}));
	row.add(Titanium.UI.createLabel({
		text : title,
		textAlign : 'left',
		font : {
			fontSize : '16dip',
			fontWeight : 'bold'
		},
		top : '21dip',
		left : '100dip'
	}));
	row.add(Titanium.UI.createLabel({
		text : description,
		textAlign : 'left',
		font : {
			fontSize : '12dip',
			fontWeight : 'bold'
		},
		top : '46dip',
		left : '100dip'
	}));
	return row;
}

module.exports = function(viewModel) {

	var window = Ti.UI.createWindow({
		title: "Results"
	});
	var tableView = Titanium.UI.createTableView();
	tableView.addEventListener('click', function(e) {
		if (e.index === viewModel.properties().length) {
			viewModel.loadMore();
		} else {
			viewModel.properties()[e.index].select();
		}
	});

	window.add(tableView);
	this.window = window;

	function updateRows(properties) {
		var rows = _.map(properties, function(property) {
			return createRow(property.thumbnailUrl, '£ ' + property.price, property.title + ' ' + property.bedrooms + ' bed ' + property.propertyType);
		});
		if (viewModel.properties().length < viewModel.totalResults) {
			rows.push(createRow("/pull-icon.png", "Tap to load more...", "Results for " + viewModel.searchLocation.displayString + ", showing " + viewModel.properties().length + " of " + viewModel.totalResults + " properties"));
		}
		tableView.setData(rows);
	}

	var propertiesSubscription = viewModel.properties.subscribe(function(properties) {
		updateRows(properties);
	});
	updateRows(viewModel.properties());

	this.dispose = function() {
		propertiesSubscription.dispose();
	};

};
