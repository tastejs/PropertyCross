(function(){
  'use strict';
  var module = angular.module('app', ['onsen', 'app.services']);

  module.controller('AppController', function($scope, $http, Properties, RecentSearches) {
    $scope.data = {
      searchError: false,
      recent: [],
      suggestions: [],
      result: null,
      listings: [],
      current: null,
      loadingMore: false,
      query: ''
    };

    RecentSearches.get().then(function(searches) {
      $scope.data.recent = searches;
    });

    $scope.search = function(query) {
      if (query) {
        $scope.data.query = query;
      }

      app.modal.show();

      $scope.data.suggestions = [];
      $scope.hideError();

      Properties.search($scope.data.query, 1).then(function(res) {
        var status_code = res.application_response_code;

        if (['100', '101', '110'].indexOf(status_code) >= 0) {
          
          if (res.listings.length) {
            $scope.data.result = res;
            $scope.data.listings = res.listings;
            app.navigator.pushPage('results.html');
          } else  if (res.listings.length === 0) {
            $scope.showError('There were no properties found for the given location.');
          } else {
            $scope.showError();
          }

        } else if (['200', '202'].indexOf(status_code) >= 0) {
          $scope.data.suggestions = res.locations;
        } else if (status_code == '201') {
          $scope.showError('The location given was not recognised.');
        } else {
          $scope.showError();
        }
      }, function(error) {
        $scope.showError();
      }).finally(function() {
        app.modal.hide();    
      });
    };

    $scope.searchByLocation = function() {
      app.modal.show();
      $scope.hideError();

      var rnd = function(num) {
        return Math.round(num * 100) / 100;
      }

      navigator.geolocation.getCurrentPosition(function(location) {
        var coords = rnd(location.coords.latitude) + "," + rnd(location.coords.longitude);
        $scope.search(coords);
      }, function() {
        app.modal.hide();
        $scope.showError('Unable to detect current location. Please ensure location is turned on in your phone settings and try again.');
      }, {timeout: 5000});
    };

    $scope.loadMore = function() {
      if ($scope.loadingMore) {
        return;
      }

      $scope.data.loadingMore = true;
      var current = $scope.data.result;

      Properties.search($scope.data.query, parseInt(current.page) + 1).then(function(res) {
        $scope.data.result = res;
        $scope.data.listings = $scope.data.listings.concat(res.listings);
      }, function(error) {
      }).finally(function() {
        $scope.data.loadingMore = false; 
      });
    };

    $scope.showError = function(message) {
      if (!message) {
        message = 'An error occurred while searching. Please check your network connection and try again.';
      }

      $scope.data.searchError = true;
      $scope.data.errorMessage = message;
    };

    $scope.hideError = function() {
      $scope.data.searchError = false;
    };
  });

  module.controller('ResultsController', function($scope) {
    $scope.showDetails = function(index) {
      $scope.data.current = $scope.data.listings[index];
      app.navigator.pushPage('details.html'); 
    }; 
  });

  module.controller('DetailsController', function($scope, Favourites) {
    $scope.toggleFavourite = function() {
      Favourites.toggle($scope.data.current);
    };

    $scope.isFavourite = function() {
      return Favourites.isFavourite($scope.data.current);
    }; 
  });

  module.controller('FavouritesController', function($scope, Favourites) {
    Favourites.get().then(function(favourites) {
      $scope.favourites = favourites;
    });

    $scope.showDetails = function(guid) {
      $scope.data.current = $scope.favourites[guid];
      app.navigator.pushPage('details.html');
    };
  
    $scope.hasFavourites = function() {
      return Object.keys($scope.favourites).length > 0;
    };
  });

  module.filter('largeNumber', function() {
    return function(input) {
      return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
  }).filter('fixTitle', function() {
    return function(input) {
      return input.split(', ').slice(0,2).join(', ');
    };
  }).filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });
})();

