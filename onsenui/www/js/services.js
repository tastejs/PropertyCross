(function() {
  'use strict';

  var services = angular.module('app.services', ['ngResource']);

  services.factory('Properties', function($resource, $q, RecentSearches) {
    var resource = $resource('http://api.nestoria.co.uk/api',
      {
        country: 'uk',
        pretty: '1',
        action: 'search_listings',
        encoding: 'json',
        listing_type: 'buy',
        callback: 'JSON_CALLBACK'
      },
      {
        search: { 
          method: 'JSONP',
          timeout: 5000
        }
      }
    );

    return {
      search: function(query, page) {
        var q = $q.defer(),
          params = {
            page: page
          };

        if (/^[\-]?[0-9]{1,}\.[0-9]{1,},\s*[\-]?[0-9]{1,}\.[0-9]{1,}$/.test(query)) {
          params.centre_point = query;
        } else {
          params.place_name = query;
        }

        resource.search(params, function(response) {
          var r = response.response;
          if (query.length > 0) {
            RecentSearches.add(query.toLowerCase(), r.total_results ? r.total_results : 0);
          }
          q.resolve(r);
        }, function(error) {
          q.reject(error);
        });
        return q.promise;
      }
    };
  });

  services.factory('RecentSearches', function($q) {
    var KEY = 'recentSearches',
      maxNbrOfSearches = 4,
      data = window.localStorage.getItem(KEY),
      recentSearches = data ? angular.fromJson(data) : [];

    var save = function() {
      window.localStorage.setItem(KEY, angular.toJson(recentSearches));
    };

    return {
      add: function(query, results) {
        var search = {
          query: query,
          results: results
        };

        for (var i = recentSearches.length - 1; i >= 0; i--) {
          if (recentSearches[i].query === query) {
            recentSearches.splice(i, 1);
          }
        }

        recentSearches.push(search);
        recentSearches.splice(0, recentSearches.length-maxNbrOfSearches);
        save();
      },
      get: function() {
        var q = $q.defer();
        q.resolve(recentSearches);
        return q.promise;
      }
    };
  });

  services.factory('Favourites', function($q) {
    var KEY = 'favourites',
      data = window.localStorage.getItem(KEY),
      favourites = data ? angular.fromJson(data) : {};
   
    var save = function() {
      window.localStorage.setItem(KEY, angular.toJson(favourites));
    };

    return {
      toggle: function(property) {
        if (favourites.hasOwnProperty(property.guid)) {
          delete favourites[property.guid];
        } else {
          favourites[property.guid] = property;
        }
        save();
      },
      get: function() {
        var q = $q.defer();
        q.resolve(favourites);
        return q.promise;
      },
      isFavourite: function(property) {
        return favourites.hasOwnProperty(property.guid);
      }
    };
  });
})();
