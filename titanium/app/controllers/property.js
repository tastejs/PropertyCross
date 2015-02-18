// Create reference to global favorite collection and the current favorite
var favorites = Alloy.Collections.favorite;
var favorite;

// Self-executing constructor, just for clarity
(function constructor(args) {

  // Get the actual model by guid
  var property = Alloy.Collections.results.get(args.guid);

  // Set the model used for data-binding with the actual model's data, triggering data-binding
  $.property.set(property.toJSON());

  // See if we have this model in the favorite collection
  favorite = favorites.get(args.guid);

  // iOS: Set the image of the favorite button
  if (OS_IOS) {
    $.favorite.image = $.createStyle({
      classes: favorite ? 'star' : 'nostar'
    }).image;
  }

  if (OS_ANDROID) {

    // We need to wait until the window is open to get the activity
    $.win.addEventListener('open', function onOpen() {

      // Only once please
      $.win.removeEventListener('open', onOpen);

      // Called when the actionbar is (re)rendered
      $.win.activity.onCreateOptionsMenu = function onCreateOptionsMenu(e) {

        // Add the favorite button using the right style
        $.favorite = e.menu.add($.createStyle({
          classes: favorite ? 'star' : 'nostar'
        }));

        $.favorite.addEventListener('click', toggleFavorite);
      };

      // Triggers the actionbar to rerender, showing the new button
      $.win.activity.invalidateOptionsMenu();

    });
  }

})(arguments[0] || {});

// Called when the user taps the favorite button
function toggleFavorite() {

  // Unfavor the favorite
  if (favorite) {

    // Remove from collection and destroy, syncing to SQLite store
    favorites.remove(favorite);
    favorite.destroy();
    favorite = null;

    if (OS_IOS) {
      $.favorite.image = $.createStyle({
        classes: 'nostar'
      }).image;
    }

    if (OS_ANDROID) {
      $.favorite.icon = $.createStyle({
        classes: 'nostar'
      }).icon;
    }

  } else {

    // Add to collection and save, syncing to SQLite store
    favorite = Alloy.createModel('favorite', $.property.toJSON());
    favorites.add(favorite);
    favorite.save();

    if (OS_IOS) {
      $.favorite.image = $.createStyle({
        classes: 'star'
      }).image;
    }

    if (OS_ANDROID) {
      $.favorite.icon = $.createStyle({
        classes: 'star'
      }).icon;
    }
  }
}

// Called when the window is closed
function onClose() {

  // Clean up data-binding listeners
  $.destroy();
}
