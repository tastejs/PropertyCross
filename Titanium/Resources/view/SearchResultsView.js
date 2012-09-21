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
		e.rowData.viewModel.select();
	});

	window.add(tableView);
	this.window = window;

	function updateRows(properties) {
		while (tableView.data.length) {
			tableView.deleteRow(0);
		}

		tableView.appendRow(_.map(properties, function(property) {
			// create first row
			var row = Ti.UI.createTableViewRow();
			row.height = 82;
			// tip the abstraction off that the rows have the same layout
			row.className = 'myrows';
			// use an image view rather than a plain view
			row.add(Ti.UI.createImageView({
				url : property.thumbnailUrl,
				top : 11,
				left : 6,
				width : 80,
				height : 60
			}));
			row.add(Titanium.UI.createLabel({
				text : '£ ' + property.price,
				color : '#2F3E46',
				textAlign : 'left',
				font : {
					fontSize : 16,
					fontWeight : 'bold'
				},
				width : 'auto',
				height : 'auto',
				top : 21,
				left : 100
			}));
			row.add(Titanium.UI.createLabel({
				text : property.title + ' ' + property.bedrooms + ' bed ' + property.propertyType,
				color : '#2F3E46',
				textAlign : 'left',
				font : {
					fontSize : 12,
					fontWeight : 'bold'
				},
				width : 'auto',
				height : 'auto',
				top : 46,
				left : 100
			}));
			row.viewModel = property;
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
