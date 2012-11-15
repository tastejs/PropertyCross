var _ = require("lib/underscore");
var ko = require("lib/knockout");

module.exports = function (viewModel) {

  var window = Titanium.UI.createWindow({
    title:'PropertyCross',
    layout:'vertical'
  });

  var instructions = Titanium.UI.createLabel({
    text:"Use the form below to search for houses to buy. You can search by place-name, postcode, or click 'My location', to search in your current location",
    textAlign:'left',
    font:{
      fontSize:'14dip'
    },
    left:'6dip',
    right:'6dip',
    top:'6dip'
  });
  window.add(instructions);

  var textField = Ti.UI.createTextField({
    borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
    left:'6dip',
    right:'6dip',
    top:'6dip',
    returnKeyType:Titanium.UI.RETURNKEY_SEARCH
  });
  var searchDisplayStringSubscription = viewModel.searchDisplayString.subscribe(function (newValue) {
    textField.value = newValue;
  });
  textField.addEventListener('return', function (e) {
    viewModel.searchDisplayString(textField.value);
    // ensure the keyboard is hidden
    textField.blur();
    viewModel.executeSearch();
  });
  window.add(textField);

  var myLocationButton = Titanium.UI.createButton({
    title:'My Location',
    left:'6dip',
    right:'6dip',
    top:'6dip'
  });
  myLocationButton.addEventListener('click', function (e) {
    // ensure the keyboard is hidden
    textField.blur();
    viewModel.searchMyLocation();
  });
  window.add(myLocationButton);

  var userMessage = Titanium.UI.createLabel({
    text:"",
    textAlign:'left',
    font:{
      fontSize:'16dip'
    },
    left:'6dip',
    right:'6dip',
    top:'6dip'
  });
  var userMessageSubscription = viewModel.userMessage.subscribe(function (newValue) {
    userMessage.text = newValue;
  });
  window.add(userMessage);

  var recentSearchesView = Titanium.UI.createView({
    layout:'vertical',
    height:Titanium.UI.SIZE
  });

  var recentSearchesLabel = Titanium.UI.createLabel({
    text:"Recent searches:",
    textAlign:'left',
    font:{
      fontSize:'19dip',
      fontWeight:'bold'
    },
    left:'6dip',
    right:'6dip',
    top:'6dip'
  });
  recentSearchesView.add(recentSearchesLabel);

  var recentSearchesTableView = Titanium.UI.createTableView({
    width:Titanium.UI.FILL,
    bottom:0,
    top:'6dip'
  });
  recentSearchesTableView.addEventListener('click', function (e) {
    // ensure the keyboard is hidden
    textField.blur();
    viewModel.selectLocation.call(viewModel.recentSearches()[e.index]);
  });
  function updateRecentSearches(items) {
    recentSearchesTableView.setData(_.map(items, function (item) {
      // create first row
      var row = Ti.UI.createTableViewRow({
        hasChild:Ti.Platform.osname === "iphone"
      });
      row.height = '41dip';
      // tip the abstraction off that the rows have the same layout
      row.className = 'myrows';
      row.add(Titanium.UI.createLabel({
        text:item.displayString,
        textAlign:'left',
        font:{
          fontSize:'16dip',
          fontWeight:'bold'
        },
        left:'6dip'
      }));
      row.add(Titanium.UI.createLabel({
        text:item.totalResults,
        textAlign:'right',
        font:{
          fontSize:'16dip'
        },
        right:'6dip'
      }));
      return row;
    }));
  }

  var recentSearchesSubscription = viewModel.recentSearches.subscribe(updateRecentSearches);
  updateRecentSearches(viewModel.recentSearches());
  recentSearchesView.add(recentSearchesTableView);

  function toggleRecentSearches() {
    var attached = _.contains(window.children, recentSearchesView);
    if (viewModel.recentSearches().length > 0 && viewModel.locations().length === 0) {
      if (!attached) {
        window.add(recentSearchesView);
      }
    } else {
      if (attached) {
        window.remove(recentSearchesView);
      }
    }
  }

  var recentSearchesVisibilityRecentSearchesSubscription = viewModel.recentSearches.subscribe(toggleRecentSearches);
  var recentSearchesVisibilityLocationsSubscription = viewModel.locations.subscribe(toggleRecentSearches);
  toggleRecentSearches();

  var locationsView = Titanium.UI.createView({
    layout:'vertical',
    height:Titanium.UI.SIZE
  });

  var locationsLabel = Titanium.UI.createLabel({
    text:"Please select a location below:",
    textAlign:'left',
    font:{
      fontSize:'19dip',
      fontWeight:'bold'
    },
    left:'6dip',
    right:'6dip',
    top:'6dip'
  });
  locationsView.add(locationsLabel);

  var locationsTableView = Titanium.UI.createTableView({
    width:Titanium.UI.FILL,
    bottom:0,
    top:'6dip'
  });
  locationsTableView.addEventListener('click', function (e) {
    // ensure the keyboard is hidden
    textField.blur();
    viewModel.selectLocation.call(viewModel.locations()[e.index]);
  });
  function updateLocations(items) {
    locationsTableView.setData(_.map(items, function (item) {
      // create first row
      var row = Ti.UI.createTableViewRow({
        hasChild:Ti.Platform.osname === "iphone"
      });
      row.height = '41dip';
      // tip the abstraction off that the rows have the same layout
      row.className = 'myrows';
      row.add(Titanium.UI.createLabel({
        text:item.displayString,
        textAlign:'left',
        font:{
          fontSize:'16dip',
          fontWeight:'bold'
        },
        left:'6dip',
        right:'6dip'
      }));
      return row;
    }));
  }

  var locationsSubscription = viewModel.locations.subscribe(updateLocations);
  updateLocations(viewModel.locations());
  locationsView.add(locationsTableView);

  function toggleLocations() {
    var attached = _.contains(window.children, locationsView);
    if (viewModel.locations().length > 0) {
      if (!attached) {
        window.add(locationsView);
      }
    } else {
      if (attached) {
        window.remove(locationsView);
      }
    }
  }

  var locationsVisibilityRecentSearchesSubscription = viewModel.recentSearches.subscribe(toggleLocations);
  var locationsVisibilityLocationsSubscription = viewModel.locations.subscribe(toggleLocations);
  toggleLocations();

  var activityIndicator;

  // On iOS, the activity indicator must be added to a window or view for it to appear
  if (Ti.Platform.osname === "iphone") {
    activityIndicator = Ti.UI.createActivityIndicator({
      width:Titanium.UI.SIZE,
      height:Titanium.UI.SIZE,
      right:'6dip',
      style:Ti.UI.iPhone.ActivityIndicatorStyle.DARK
    });
    textField.add(activityIndicator);
  } else {
    activityIndicator = Ti.UI.createActivityIndicator({
      message:'Loading...',
      width:Titanium.UI.FILL,
      height:Titanium.UI.FILL
    });
  }

  var isSearchEnabledSubscription = viewModel.isSearchEnabled.subscribe(function (newValue) {
    if (newValue) {
      activityIndicator.hide();
    } else {
      activityIndicator.show();
    }
    textField.enabled = newValue;
    myLocationButton.enabled = newValue;
  });

  this.window = window;

  this.dispose = function () {
    searchDisplayStringSubscription.dispose();
    userMessageSubscription.dispose();
    recentSearchesSubscription.dispose();
    isSearchEnabledSubscription.dispose();
    recentSearchesVisibilityRecentSearchesSubscription.dispose();
    recentSearchesVisibilityLocationsSubscription.dispose();
    locationsSubscription.dispose();
    locationsVisibilityRecentSearchesSubscription.dispose();
    locationsVisibilityLocationsSubscription.dispose();
  };
};
