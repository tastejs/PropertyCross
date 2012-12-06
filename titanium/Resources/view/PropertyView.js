var _ = require("lib/underscore");
var ko = require("lib/knockout");

module.exports = function (viewModel) {

  var window = Titanium.UI.createWindow({
    title:"Details"
  });

  var view = Titanium.UI.createView({
    layout:'vertical',
    top:'6dip',
    right:'6dip',
    bottom:'6dip',
    left:'6dip'
  });

  var price = Titanium.UI.createLabel({
    text:'£ ' + viewModel.price(),
    textAlign:'left',
    font:{
      fontSize:'19dip',
      fontWeight:'bold'
    },
    top:'6dip',
    width:Ti.UI.FILL
  });
  view.add(price);

  var title = Titanium.UI.createLabel({
    text:viewModel.title(),
    textAlign:'left',
    font:{
      fontSize:'16dip'
    },
    top:'6dip',
    width:Ti.UI.FILL
  });
  view.add(title);

  var image = Ti.UI.createImageView({
    image:viewModel.thumbnailUrl(),
    height:'50%',
    top:'6dip',
    width:Ti.UI.FILL
  });
  view.add(image);

  var description = Titanium.UI.createLabel({
    text:viewModel.stats(),
    textAlign:'left',
    font:{
      fontSize:'16dip'
    },
    top:'6dip',
    width:Ti.UI.FILL
  });
  view.add(description);

  var summary = Titanium.UI.createLabel({
    text:viewModel.summary(),
    textAlign:'left',
    font:{
      fontSize:'16dip'
    },
    top:'6dip',
    width:Ti.UI.FILL
  });
  view.add(summary);

  window.add(view);

  this.window = window;

  this.dispose = function () {
  };
};
