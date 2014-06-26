
 define(['angular'], function(angular) {
    'use strict';

    angular.module('propertycross.controllers', ['propertycross.services'])

    .controller('HomeCtrl', function($scope, $state, PropertySearch, SearchResults, Properties, UiUtils) {
        
        function propertySearchWrapper(propertySearchAction) {
            propertySearchAction().then(function(response) {
                if (response.place_name !== undefined) {
                    $state.go('listing', { location: response.place_name });
                } else {
                    console.log("Ambiguous result");
                }
            },function (response) {
                console.log("Error occurred");
            });
        }

        $scope.ui = {
            buttongrid: {
                dimensions: [2,1]
            }
        };
        
        $scope.search = {
            query: '',
            basicSearch: function() {
                UiUtils.displayLoadingIndicator();
                var query = $scope.search.query;

                propertySearchWrapper(function() {
                    return PropertySearch.queryByPlaceName(query, 1);
                });
            },
            geoLocatedSearch: function() {
                UiUtils.displayLoadingIndicator();
                var latitude = 51.454513;
                var longitude = -2.587910;

                propertySearchWrapper(function() {
                    return PropertySearch.queryByCoordinates(latitude, longitude, 1);
                });
            }
        };
    })

    .controller('ListingCtrl', function($scope, $state, $stateParams, $famous, PropertySearch, Properties, SearchResults, UiUtils) {

        var count = 0;
        var results = undefined;

        function updateListing(response) {
            results = response;

            angular.forEach(response.retrieved, function(entity) {
                var property = Properties.load(entity);
                if(property !== undefined) {
                    this.push(property);
                }
            }, $scope.listing.items);

            count += response.retrieved.length;
            $scope.listing.heading = count + ' of ' + response.total + ' matches';
            UiUtils.hideLoadingIndicator();
        }
        
        function handleError(response) {
            // Should never happen
            console.log("Unable to search for '" + $stateParams.location + "'");
            UiUtils.hideLoadingIndicator();
        }

        UiUtils.displayLoadingIndicator();

        SearchResults.load($stateParams.location).then(updateListing, function() {
            PropertySearch.queryByPlaceName($stateParams.location, 1).then(updateListing, handleError);
        });

        var EventHandler = $famous['famous/core/EventHandler'];

        $scope.ui = {
            eventHandler: new EventHandler(),
            navigate: function(item) {
                $state.go('details', { id: item.id });
            },
            loadMore: function() {
                if (results !== undefined) {
                    PropertySearch.getNextPage(results).then(updateListing, handleError);
                }
            }
        };

        $scope.listing = {
            heading: '',
            items: []
        };
    })

    .controller('DetailsCtrl', function($scope, $stateParams, Favourites, Properties) {
        $scope.property = {
            details: Properties.load($stateParams.id),
            addToFavourites: function() {
                Favourites.store($scope.property.details);
            },
            removeFromFavourites: function() {
                Favourites.remove($scope.property.details);
            }
        };
    })

    .controller('FavouritesCtrl', function($scope, $state, $famous, Favourites, Properties) {
        var favourites = Favourites.query();

        function updateListing() {

            angular.forEach(favourites, function(entity) {
                var property = Properties.load(entity);
                if(property !== undefined) {
                    this.push(property);
                }
            }, $scope.listing.items);
        }

        var EventHandler = $famous['famous/core/EventHandler'];

        $scope.ui = {
            eventHandler: new EventHandler(),
            navigate: function(item) {
                $state.go('details', { id: item.id });
            }
        };

        $scope.listing = {
            items: []
        };

        updateListing();
    });

});
