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

    // Called when the actionbar is presented
    $.win.activity.onPrepareOptionsMenu = function onPrepareOptionsMenu(e) {

      // FIXME: $.favorite is not there because Alloy UI code executes after it merges $.__views
      $.favorite || ($.favorite = $.__views.favorite);

      // Add the favorite button using the right style
      $.favorite.icon = $.createStyle({
        classes: favorite ? 'star' : 'nostar'
      }).icon;
    };
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
