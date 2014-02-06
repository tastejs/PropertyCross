angular.module('propertycross', ['ionic', 'propertycross.services', 'propertycross.controllers'])


.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

        .state('home', {
            url: '/home',
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
        });
/*
    .state('results', {
      url: '/results/:searchTerm',
      views: {
        'results': {
          templateUrl: 'templates/results.html',
          controller: 'ResultsCtrl'
        }
      }
    })

    .state('property', {
      url: '/property/:propertyId',
      views: {
        'property': {
          templateUrl: 'templates/property.html',
          controller: 'PropertyCtrl'
        }
      }
    })

    .state('favourites', {
      url: '/favourites',
      views: {
        'favourites': {
          templateUrl: 'templates/favourites.html'
          controller: 'FavouritesCtrl'
        }
      }
    });*/

  $urlRouterProvider.otherwise('/home');

});

