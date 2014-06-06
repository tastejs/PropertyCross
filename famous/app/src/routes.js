
define(['app'], function(app) {
    'use strict';
    app.config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            })
            .state('listing', {
                url: '/listing/:location',
                templateUrl: 'views/listing.html',
                controller: 'ListingCtrl'
            })
            .state('details', {
                url: '/details/:id',
                templateUrl: 'views/details.html',
                controller: 'DetailsCtrl'
            })
            .state('favourites', {
                url: '/favourites',
                templateUrl: 'views/favourites.html',
                controller: 'FavouritesCtrl'
            });

        $urlRouterProvider.otherwise('/home');
    });
});
