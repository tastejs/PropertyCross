var _ = require("lib/underscore");
var ko = require("lib/knockout");

module.exports = function (viewModel) {

  var window = Ti.UI.createWindow({
    title:"Favourites"
  });
  var tableView;

  //
  // create table view (
  //
  tableView = Titanium.UI.createTableView({
  });
  tableView.addEventListener('click', function (e) {
    viewModel.properties()[e.index].select();
  });

  window.add(tableView);
  this.window = window;

  function updateRows(properties) {
    tableView.setData(_.map(properties, function (property) {
      // create first row
      var row = Ti.UI.createTableViewRow({
        hasChild:Ti.Platform.osname === "iphone"
      });
      row.height = '54dip';
      // tip the abstraction off that the rows have the same layout
      row.className = 'myrows';
      // use an image view rather than a plain view
      row.add(Ti.UI.createImageView({
        image:property.thumbnailUrl(),
        top:'2dip',
        left:'4dip',
        width:'50dip',
        height:'50dip'
      }));
      row.add(Titanium.UI.createLabel({
        text:'£ ' + property.price(),
        textAlign:'left',
        font:{
          fontSize:'16dip',
          fontWeight:'bold'
        },
        top:'2dip',
        left:'60dip'
      }));
      row.add(Titanium.UI.createLabel({
        text:property.title() + ' ' + property.bedrooms() + ' bed ' + property.propertyType(),
        textAlign:'left',
        font:{
          fontSize:'12dip'
        },
        top:'22dip',
        left:'60dip'
      }));
      return row;
    }));
  }

  var propertiesSubscription = viewModel.properties.subscribe(function (properties) {
    updateRows(properties);
  });
  updateRows(viewModel.properties());

  this.dispose = function () {
    propertiesSubscription.dispose();
  };

};
