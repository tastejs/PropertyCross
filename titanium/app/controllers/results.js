// Reference global reference to the actual favorite/property collection we'll use
var results = Alloy.Collections.results;

// The next page to load
var nextPage = 2;

var infiniteScroll;

// Self-executing constructor, just for clarity
(function constructor(args) {

  // Set the Window title, shown in the tool/actionbar
  $.win.title = args.title;
  
  // Manually call the data-binding method named in the view, to populate with existing data
  renderData();

  // Do not init infinite scroll for favorites
  if (!args.favorites) {

    // We use a widget providing cross-platform infiniteScroll behavior
    infiniteScroll = Alloy.createWidget('nl.fokkezb.infiniteScroll');
    infiniteScroll.on('end', loadMore);
    infiniteScroll.init($.list);
  }

})(arguments[0] || {});

// Called by Alloy for each model before rendering
function transformData(model) {

  // Use the model's transform() method to have it add custom properties we need rendered
  return model.transform();
}

// Called when we near the end of the list or the user taps the footerView provided by the widget
function loadMore(e) {

  // Fetch from the collection's data-source (our custom nestoria sync adapter)
  results.fetch({
    
    // Don't replace existing models
    add: true,
    request: {
      page: nextPage
    },
    success: function onSuccess(col, res) {

      // Tell the widget all is OK
      e.success();

      // Increment page for next fetch
      nextPage++;
    },
    error: function onError(col, res) {

      // pagination out of range or over 50 (max of 1000 results)
      if (_.isObject(res) && (res.response.application_response_code === '901' || res.response.application_response_code === '902')) {

        // Tell the widget we have no more to load
        e.done();

      } else {

        // Tell the widget something's wrong
        e.error();
      }
    }
  });

}

// Called when the user taps on an item
function onItemclick(e) {

  // Create the property view in the NavigationWindow/stack
  Alloy.Globals.nav.openWindow(Alloy.createController('property', {

    // Pass the model ID so the controller can get its data
    guid: e.itemId

  }).getView());
}

// Called when the window closes
function onClose() {

  // Clean up data-binding listeners
  $.destroy();
}