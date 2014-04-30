var _ = require("lib/underscore");
var ko = require("lib/knockout");

function createRow(imageUrl, title, description) {
  var row = Ti.UI.createTableViewRow({
    hasChild:Ti.Platform.osname === "iphone"
  });
  row.height = '54dip';
  // tip the abstraction off that the rows have the same layout
  row.className = 'myrows';
  // use an image view rather than a plain view
  row.add(Ti.UI.createImageView({
    image:imageUrl,
    top:'2dip',
    left:'4dip',
    width:'50dip',
    height:'50dip'
  }));
  row.add(Titanium.UI.createLabel({
    text:title,
    textAlign:'left',
    font:{
      fontSize:'16dip',
      fontWeight:'bold'
    },
    top:'2dip',
    left:'60dip'
  }));
  row.add(Titanium.UI.createLabel({
    text:description,
    textAlign:'left',
    font:{
      fontSize:'12dip'
    },
    top:'22dip',
    left:'60dip'
  }));
  return row;
}

module.exports = function (viewModel) {

  var window = Ti.UI.createWindow();
  var tableView = Titanium.UI.createTableView();
  tableView.addEventListener('click', function (e) {
    if (e.index === viewModel.properties().length) {
      viewModel.loadMore();
    } else {
      viewModel.properties()[e.index].select();
    }
  });

  window.add(tableView);
  this.window = window;
  
  function updateTitle() {
  	window.title =  viewModel.properties().length + ' of ' + viewModel.totalResults() + ' matches';
  }

  function updateRows(properties) {
    var rows = _.map(properties, function (property) {
      return createRow(property.thumbnailUrl(), '£ ' + property.price(), property.title() + ' ' + property.bedrooms() + ' bed ' + property.propertyType());
    });
    if (viewModel.properties().length < viewModel.totalResults()) {
      rows.push(createRow("/pull-icon.png", "Tap to load more...", 
      	"Results for " + viewModel.searchLocation().displayString + ", showing " + viewModel.properties().length + " of " + viewModel.totalResults() + " properties"));
    }
    tableView.setData(rows);
    updateTitle();
  }

  var propertiesSubscription = viewModel.properties.subscribe(updateRows);
  updateRows(viewModel.properties());

  var totalResultsSubscription = viewModel.totalResults.subscribe(updateTitle);

  this.dispose = function () {
    propertiesSubscription.dispose();
    totalResultsSubscription.dispose();
  };

};
