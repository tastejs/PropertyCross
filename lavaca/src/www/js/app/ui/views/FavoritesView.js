define(function(require) {

  var BaseView = require('./BaseView'),
      $ = require('$'),
      router = require('lavaca/mvc/Router');
  require('rdust!templates/favorites');
  require('rdust!templates/listings-list-item');

  /**
   * @class app.ui.FavoritesView
   * @super app.ui.BaseView
   * Example view type
   */
  var FavoritesView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
    this.mapEvent({
      'li': {tap: this.onTapListing.bind(this)}
    });
  }, {
    /**
     * @field {String} template
     * @default 'templates/search'
     * The name of the template used by the view
     */
    template: 'templates/favorites',
    /**
     * @field {String} className
     * @default 'search'
     * A class name added to the view container
     */
    className: 'listings favorites',
    onTapListing: function(e) {
      var li = $(e.currentTarget),
          guid = li.data('guid'),
          listing = this.model.first({guid: guid});
      if (listing) {
        router.exec('/favorites/' + guid, null, {listing: listing});
      }
    }

  });

  return FavoritesView;

});
