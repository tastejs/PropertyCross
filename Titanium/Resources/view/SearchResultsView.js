var _ = require("underscore");
var ko = require("knockout");

module.exports = function(viewModel) {

	var window = Ti.UI.createWindow();
	var tableView;

	//
	// create table view (
	//
	tableView = Titanium.UI.createTableView({
		backgroundColor : 'white'
	});
	tableView.addEventListener('click', function(e) {
		viewModel.properties()[e.index].select();
	});

	window.add(tableView);
	this.window = window;

	function updateRows(properties) {
		tableView.setData(_.map(properties, function(property) {
			// create first row
			var row = Ti.UI.createTableViewRow();
			row.height = '82dip';
			// tip the abstraction off that the rows have the same layout
			row.className = 'myrows';
			// use an image view rather than a plain view
			row.add(Ti.UI.createImageView({
				url : property.thumbnailUrl,
				top : '11dip',
				left : '6dip',
				width : '80dip',
				height : '60dip'
			}));
			row.add(Titanium.UI.createLabel({
				text : '£ ' + property.price,
				color : '#2F3E46',
				textAlign : 'left',
				font : {
					fontSize : '16dip',
					fontWeight : 'bold'
				},
				top : '21dip',
				left : '100dip'
			}));
			row.add(Titanium.UI.createLabel({
				text : property.title + ' ' + property.bedrooms + ' bed ' + property.propertyType,
				color : '#2F3E46',
				textAlign : 'left',
				font : {
					fontSize : '12dip',
					fontWeight : 'bold'
				},
				top : '46dip',
				left : '100dip'
			}));
			return row;
		}));
	}

	var propertiesSubscription = viewModel.properties.subscribe(function(properties) {
		updateRows(properties);
	});
	updateRows(viewModel.properties());

	this.dispose = function() {
		propertiesSubscription.dispose();
	};

};
