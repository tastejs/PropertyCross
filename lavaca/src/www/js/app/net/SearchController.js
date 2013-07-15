define(function(require) {

  var SearchView = require('app/ui/views/SearchView'),
      ListingsView = require('app/ui/views/ListingsView'),
      ListingView = require('app/ui/views/ListingView'),
      FavoritesView = require('app/ui/views/FavoritesView'),
      BaseController = require('./BaseController'),
      SearchModel = require('app/models/SearchModel'),
      ListingCollection = require('app/models/ListingCollection'),
      stateModel = require('app/models/StateModel'),
      Collection = require('lavaca/mvc/Collection'),
      ListingModel = require('app/models/ListingModel');
  /**
   * @class app.net.SearchController
   * @super app.net.BaseController
   * Example controller
   */
  var SearchController = BaseController.extend({
    /**
     * @method home
     * Home action, creates a history state and shows a view
     *
     * @param {Object} params  Action arguments
     * @param {Object} model  History state model
     * @return {Lavaca.util.Promise}  A promise
     */
    home: function(params, model) {
      model = new SearchModel();
      return this
        .view('home', SearchView, model)
        .then(this.updateState(null, 'PropertyCross', params.url, {showFavorites: true, showBack: false}));
    },
    listings: function(params, model) {
      if (!model && !params.listings) {
        model = {
          items: [],
          page: 0,
          placeName: params.placeName
        };
      }
      var listingCollection = new ListingCollection(model ? model.items : params.listings);
      if (params.search) {
        listingCollection.apply(params.search);
      } else {
        listingCollection.apply(model);
        listingCollection.setupComputedProperties();
      }
      if (listingCollection.count() === 0) {
        listingCollection.fetch();
      }
      return this
        .view(null, ListingsView, listingCollection)
        .then(this.updateState(listingCollection.toObject(), listingCollection.get('pageTitle'), params.url));
    },
    listing: function(params, model) {
      if (!model && !params.listing) {
        this.redirect('/');
        return;
      }
      model = model ? new ListingModel(model) : params.listing;
      return this
        .view(null, ListingView, model)
        .then(this.updateState(model.toObject(), model.get('shortTitle'), params.url, {showFavoriteButton: true, favoriteId: model.get('guid')}));
    },
    favorites: function(params, model) {
      var favorites = stateModel.get('favorites');
      if (!favorites || !favorites.length) {
        this.redirect('/');
        return;
      }
      var favoriteCollection = new Collection(favorites);
      return this
        .view(null, FavoritesView, favoriteCollection)
        .then(this.updateState(favoriteCollection.toObject(), 'Favorites', params.url));
    }

  });

  return SearchController;

});
