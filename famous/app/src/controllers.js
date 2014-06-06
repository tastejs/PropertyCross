
 define(['angular'], function(angular) {
    'use strict';

    angular.module('propertycross.controllers', ['propertycross.services'])

    .controller('HomeCtrl', function($scope, $state, NestoriaApi, SearchResults, Properties) {
        function successNestoriaResponse(response) {
            var location = response.locations[0];

            var searchResult = {
                place_name: location.place_name,
                retrieved: [],
                title: location.long_title,
                total: response.total_results
            };
            
            var titleShortner = /^[^,]*,[^,]*/;

            angular.forEach(response.listings, function(listing) {
                var title = listing.title;
                if (titleShortner.test(title)) {
                    title = titleShortner.exec(title)[0];
                }

                var property = {
                    bathrooms : listing.bathroom_number,
                    bedrooms : listing.bedroom_number,
                    guid : listing.guid,
                    img: {
                        size: [listing.img_width, listing.img_height],
                        url : listing.img_url
                    },
                    price : '£' + listing.price_formatted.replace(/ GBP$/, ''),
                    summary : listing.summary,
                    thumb : {
                        size: [listing.thumb_width, listing.thumb_height],
                        url : listing.thumb_url
                    },
                    title : title
                };

                Properties.store(property);
                this.retrieved.push(property.guid);
                
            }, searchResult);

            SearchResults.store(searchResult);
//            UiUtils.hideLoadingIndicator();
            $state.go('listing', { location: searchResult.place_name });
        }

        function rejectNestoriaResponse(response) {
            console.log("Search results [error]");
            console.log(angular.toJson(response));
        }

        $scope.ui = {
            buttongrid: {
                dimensions: [2,1]
            }
        };
        
        $scope.search = {
            query: '',
            basicSearch: function() {
//                UiUtils.displayLoadingIndicator();
                var query = $scope.search.query;
                var page = 1;
                NestoriaApi.textBasedSearch(query, page).then(
                    successNestoriaResponse,
                    rejectNestoriaResponse);
            },
            geoLocatedSearch: function() {
//                UiUtils.displayLoadingIndicator();
                var page = 1;
                var latitude = 51.454513;
                var longitude = -2.587910;
                NestoriaApi.coordinateBasedSearch(latitude, longitude, page).then(
                    successNestoriaResponse,
                    rejectNestoriaResponse);
            }
        };
    })

    .controller('ListingCtrl', function($scope, $state, $stateParams, $famous, Properties, SearchResults) {

        var searchResults = SearchResults.load($stateParams.location);
        var count = 0;
        var total = searchResults.total;

        function updateListing() {
            angular.forEach(searchResults.retrieved, function(entity) {
                var property = Properties.load(entity);
                if(property !== undefined) {
                    this.push(property);
                }
            }, $scope.listing.items);

            count += searchResults.retrieved.length;
            $scope.listing.heading = count + ' of ' + total + ' matches';
        }

//        $scope.loadMore = function() {
//            UiUtils.displayLoadingIndicator();
//            searchResults.fetchMore().then(function() {
//                updateListing();
//                UiUtils.hideLoadingIndicator();
//            });
//        };

        var EventHandler = $famous['famous/core/EventHandler'];

        $scope.ui = {
            eventHandler: new EventHandler(),
            navigate: function(item) {
                $state.go('details', { id: item.id });
            }
        };

        $scope.listing = {
            heading: '',
            items: []
        };

        updateListing();
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
