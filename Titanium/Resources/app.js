var _ = require("underscore");
var propertyDataSource = require("model/PropertyDataSource").Instance;

var win = Titanium.UI.createWindow();

propertyDataSource.findProperties("location", "pagenumber", function(response) {
	var rows = _.map(response.data, function (property) {
		// create first row
		var row = Ti.UI.createTableViewRow();
		row.height = 82;
		row.add(Ti.UI.createView({
			backgroundImage : property.thumbnailUrl,
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
		return row;
	});

	var tableView;

	//
	// create table view (
	//
	tableView = Titanium.UI.createTableView({
		data : rows,
		filterAttribute : 'filter',
		backgroundColor : 'white'
	});

	win.add(tableView);

	win.open(); 

});


