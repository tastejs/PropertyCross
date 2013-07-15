define(function(require) {

  var BaseView = require('./BaseView'),
      $ = require('$'),
      router = require('lavaca/mvc/Router'),
      Translation = require('lavaca/util/Translation');
  require('rdust!templates/search');

  /**
   * @class app.ui.SearchView
   * @super app.ui.BaseView
   * Example view type
   */
  var SearchView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
    this.mapEvent({
      'form': {submit: this.onFormSubmit.bind(this)},
      'input': {keypress: this.onInputKeypress.bind(this)},
      '.location.button': {tap: this.onTapMyLocation.bind(this)},
      '.list-locations li, .recent-searches li': {tap: this.onTapLocationListItem.bind(this)},
      model: {
        fetchSuccess: this.onChangeSearch.bind(this),
        fetchError: this.onChangeSearch.bind(this)
      }
    });
  }, {
    /**
     * @field {String} template
     * @default 'templates/search'
     * The name of the template used by the view
     */
    template: 'templates/search',
    /**
     * @field {String} className
     * @default 'search'
     * A class name added to the view container
     */
    className: 'search',
    locationSearchKey: null,
    onFormSubmit: function(e) {
      var form = $(e.currentTarget),
          input = form.find('[name="searchText"]');
      e.preventDefault();
      this.model.searchText(this.locationSearchKey || input.val());
    },
    onChangeSearch: function() {
      var search = this.model.get('search'),
          listings = search ? search.listings : [];
      this.redraw('.search-lists');
      if (listings && listings.length) {
        router.exec('/listings/' + search.locations[0].place_name, null, {
          listings: listings,
          search: this.model.get('search')
        });
      }
    },
    onInputKeypress: function() {
      this.locationSearchKey = null;
    },
    onTapLocationListItem: function(e) {
      var li = $(e.currentTarget),
          searchKey = li.data('search-key');
      this.locationSearchKey = searchKey;
      this.model.searchText(searchKey);
      this.el.find('[name="searchText"]').val(li.find('span.title').text());
    },
    onTapMyLocation: function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(location){
          this.model.searchCoords(location.coords.latitude, location.coords.longitude);
        }.bind(this),
        function() {
          this.model.set('error', Translation.get('location_not_enabled'));
          this.redraw('.search-lists');
        }.bind(this));   
      } else {
        Translation.get('location_not_enabled');
        this.redraw('.search-lists');
      }
    }

  });

  return SearchView;

});
