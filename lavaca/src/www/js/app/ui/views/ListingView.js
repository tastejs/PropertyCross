define(function(require) {

  var BaseView = require('./BaseView'),
      $ = require('$');
  require('rdust!templates/listing-single');

  /**
   * @class app.ui.ListingView
   * @super app.ui.BaseView
   * Example view type
   */
  var ListingView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
  }, {
    /**
     * @field {String} template
     * @default 'templates/search'
     * The name of the template used by the view
     */
    template: 'templates/listing-single',
    /**
     * @field {String} className
     * @default 'search'
     * A class name added to the view container
     */
    className: 'listing',
    dispose: function() {
      this.model = null;
      BaseView.prototype.dispose.apply(this, arguments);
    }

  });

  return ListingView;

});
