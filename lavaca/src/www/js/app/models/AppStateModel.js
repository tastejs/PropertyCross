define(function(require) {
  var Model = require('lavaca/mvc/Model');

  var AppStateModel = Model.extend(function() {
    Model.apply(this, arguments);
    var state = localStorage.getItem(this.store) || '{}';
    this.apply(JSON.parse(state));
    this.set('isFavorited', this.checkIfFavorited.bind(this));
  }, {
    store: 'appState',
    set: function() {
      Model.prototype.set.apply(this, arguments);
      localStorage.setItem(this.store, JSON.stringify(this.toObject()));
    },
    addRecentSearch: function(search) {
      var recentSearches = this.get('recentSearches') || [],
          ignore;
      recentSearches.forEach(function(item, i) {
        if (item.place_name === search.place_name) {
          recentSearches.splice(i, 1);
        }
      });
      recentSearches.unshift(search);
      this.set('recentSearches', recentSearches);
    },
    checkIfFavorited: function() {
      var id = this.get('favoriteId'),
          favorites = this.get('favorites') || [],
          isFavorited;
      if (!id) {
        return;
      }
      favorites.forEach(function(item) {
        if (item.guid === id) {
          isFavorited = true;
        }
      });
      return !!isFavorited;
    },
    addFavorite: function(model) {
      var favorites = this.get('favorites') || [];
      favorites.push(model.toObject());
      this.set('favorites', favorites);
    },
    removeFavorite: function(id) {
      var favorites = this.get('favorites') || [];
      favorites.forEach(function(item, i) {
        if (item.guid === id) {
          favorites.splice(i, 1);
        }
      });
      this.set('favorites', favorites);
    }

  });
  return AppStateModel;
});