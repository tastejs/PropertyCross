// Create/Reference instances of all collections we need
var properties = Alloy.Collections.instance('property');
var favorites = Alloy.Collections.instance('favorite');
var searches = Alloy.Collections.instance('search');

// Self-executing constructor, just for clarity
(function constructor(args) {

  // Fetch favorites from SQL data source so we can use them in different controllers
  favorites.fetch();

  // Show/Hide the ambigious/recent locatins when collection updates and do so now
  searches.on('fetch reset', showOptions);
  searches.fetch();

  // Android: Invalidate the menu so the item we declared in XML shows
  if (OS_ANDROID) {
    $.win.addEventListener('open', function onOpen() {
      $.win.removeEventListener('open', onOpen);
      $.win.activity.invalidateOptionsMenu();
    });
  }

})(arguments[0] || {});

// Called when user taps favorites in action/toolbar
function openFavorites() {

  // Reference favorites from the global the results controller will use
  Alloy.Collections.results = favorites;

  // Open the results view in the NavigationWindow
  Alloy.Globals.nav.openWindow(Alloy.createController('results', {

    // Set a glag so it knows it is showing favorites (hiding infiniteScroll)
    favorites: true,
    title: 'Favorites'
  }).getView());
}

// Called when user hits return after entering a search value
function onReturn(e) {
  doSearch({
    place_name: $.search.value
  });
}

// Starts a search, either by value or geo
function doSearch(request) {

  // Reset user feedback and search value
  $.message.text = '';
  $.search.value = '';

  // Show spinner
  $.spinner.show();

  // Fetch from the properties data-source, our custom nestoria sync adapter
  properties.fetch({
    request: request,
    success: function onSuccess(col, res, opts) {
      $.spinner.hide();

      // No properties found
      if (col.length === 0) {
        $.message.text = 'There were no properties found for the given location.';

      } else {

        // Reference properties from the global the results controller will use
        Alloy.Collections.results = properties;

        // Open the results view in the NavigationWindow
        Alloy.Globals.nav.openWindow(Alloy.createController('results', {
          title: res.response.locations[0].long_title
        }).getView());

        // Save our search to the (recent) search collection, only if it wasn't by geo
        if (request.place_name) {

          // Save both location info and total results count
          search = Alloy.createModel('search', _.extend({
            total_results: res.response.total_results
          }, res.response.locations[0]));

          // Add and save to SQLite data-source
          searches.add(search);
          search.save();
        }

        // If we were showing ambigious locations, fetch will show recent searches again
        searches.fetch();
      }
    },
    error: function onError(col, res, opts) {
      var error;

      $.spinner.hide();

      // Server-error
      if (_.isObject(res)) {

        // Ambigious locations
        if (res.response.application_response_code === '200' || res.response.application_response_code === '202') {

          // Reset the searches collection with the ambigious locations
          // This will trigger the data-binding
          // We don't sync with the SQLite data-source
          searches.reset(res.response.locations, {

            // Set a flag so the renderer knows what title to show
            ambigious: true
          });

          return;
        }

        if (res.response.application_response_code === '201') {
          error = 'The location given was not recognised.';

        } else if (res.response.application_response_text) {
          error = res.response.application_response_text;
        }
      }

      // Client-error
      else if (res) {
        error = res;
      }

      // Show the error to the user
      $.message.text = error || 'Unknown error.';
    }
  });
}

// Called when user taps the 'My Location' button
function detectLocation() {

  // Show spinner
  $.spinner.show();

  Ti.Geolocation.getCurrentPosition(function handle(res) {

    $.spinner.hide();

    if (res.error) {
      $.message.text = "Unable to detect current location. Please ensure location is turned on in your phone settings and try again.";

    } else {
      doSearch({
        centre_point: res.coords.latitude + ',' + res.coords.longitude
      });
    }

  });
}

// Set in the view, this filters the collection before it renders in the list
function filterData(col) {

  // Show most recent searches first
  return col.models.reverse();
}

// Called every time the search collection updates
function showOptions(col, opts) {

  // FIXME: Some SQL adapter bug?
  if (col.length === undefined) {
    return;
  }

  // Show the right title, depending on the flag
  $.optionsTitle.text = (opts && opts.ambigious) ? 'Please select a location below:' : 'Recent searches:';

  // Only show if we are not empty
  $.options[(col.length > 0) ? 'show' : 'hide']();
}

// Called when user taps on a ambigious/recent location
function selectOption(e) {
  doSearch({
    place_name: e.itemId
  });
}

// Called when the window is closed
function onClose() {

  // Clean up data-binding listeners
  $.destroy();

  // Clean up listener set in constructor
  searches.off('fetch reset', showOptions);
}