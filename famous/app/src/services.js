
 define(['angular', 'angular-resource'], function(angular) {
    'use strict';

    angular.module('propertycross.services', ['ngResource'])

    .factory('NestoriaApi', ['$resource', '$q', function($resource, $q) {

        var urlParameters = {
            country: 'uk',
            pretty: '1',
            action: 'search_listings',
            encoding: 'json',
            listing_type: 'buy',
            callback: 'JSON_CALLBACK'
        };
        
        var actions = {
            search: { method: 'JSONP' }
        }

        var service = $resource('http://api.nestoria.co.uk/api', urlParameters, actions);

        var routes = {
            '100' : validResponse,
            '101' : validResponse,
            '110' : validResponse,
            '200' : ambiguousResponse,
            '202' : ambiguousResponse
        };

        function validResponse(q, response) { q.resolve(response.response); }
        function ambiguousResponse(q, response) { q.reject(response.response); }
        function errorResponse(q, errorDetails) { q.reject({ error: errorDetails }); }

        function queryNestoria(searchParameters) {
            var q = $q.defer();

            service.search(searchParameters,
                function(response) {
                    var responseCode = response.response.application_response_code;

                    if (routes[responseCode] !== undefined) {
                        routes[responseCode](q, response);
                    } else {
                        errorResponse(q, 'An error occurred while searching. Please check your network connection and try again.');
                    }
                },
                function(error) { errorResponse(q, error); }
            );

            return q;
        }

        return {
            textBasedSearch: function(query, page) {
                var response = queryNestoria({
                    place_name: query,
                    page: page
                });

                return response.promise;
            },

            coordinateBasedSearch: function(latitude, longitude, page) {
                var searchTerm = latitude.toFixed(2) + ',' + longitude.toFixed(2);

                var response = queryNestoria({
                    centre_point: searchTerm,
                    page: page
                });

                return response.promise;
            }

        };
    }])
    
    .factory('PropertySearch', ['NestoriaApi', 'Properties', '$q', function(NestoriaApi, Properties, $q) {
        
        function shortenPropertyTitle(title) {
            var titleShortner = /^[^,]*,[^,]*/;

            if (titleShortner.test(title)) {
                return titleShortner.exec(title)[0];
            }

            return title;
        }

        function convertToSearchResult(response) {
            var location = response.locations[0];

            var result = {
                place_name: location.place_name,
                retrieved: [],
                title: location.long_title,
                total: response.total_results
            };
            

            angular.forEach(response.listings, function(listing) {

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
                    title : shortenPropertyTitle(listing.title)
                };

                Properties.store(property);
                this.retrieved.push(property.guid);
            }, result);

            return result;
        }

        function convertToAmbigousResult(response) {
            var results = {
                locations: []
            };
            
            angular.forEach(response.locations, function(location) {
                this.locations.push({
                    place_name: location.place_name,
                    title: location.long_title
                });
            }, results);
            
            return results;
        }
        
        function nestoriaApiWrapper(nestoriaApiAction) {
                var q = $q.defer();

                nestoriaApiAction().then(function(response) {
                    q.resolve(convertToSearchResult(response));
                }, function(response) {
                    if (response.error === undefined) {
                        q.resolve(convertToAmbigousResult(response));
                    } else {
                        q.reject(response);
                    }
                });

                return q.promise;
        }

        return {
            queryByPlaceName: function(query, page) {
                return nestoriaApiWrapper(function() {
                    return NestoriaApi.textBasedSearch(query, page);
                });
            },

            queryByCoordinates: function(latitude, longitude, page) {
                return nestoriaApiWrapper(function() {
                    return NestoriaApi.coordinateBasedSearch(latitude, longitude, page);
                });
            },
            
            getNextPage: function() {
                
            }

        };
    }])

    .factory('Favourites', ['$q', function($q) {

        var favourites = [];

        return {
            load: function(guid) {
                return favourites.indexOf(guid) ? guid : undefined;
            },
            query: function() {
                return angular.copy(favourites);
            },
            remove: function(entity) {
                var index = favourites.indexOf(entity.guid);
                if (index !== -1) {
                    favourites.splice(index, 1);
                }
            },
            store: function(entity) {
                if (!entity) return;
                favourites.push(entity.guid);
            }
        };
        
    }])

    .factory('Properties', ['$q', function($q) {

        var cache = {
            data: [],
            lookup: {}
        };

        return {
            load: function(guid) {
                return angular.copy(cache.lookup[guid]);
            },
            query: function() {
                return angular.copy(cache.data);
            },
            remove: function(entity) {
                var index = cache.data.indexOf(entity.guid);
                if (index !== -1) {
                    cache.data.splice(index, 1);
                }
                cache.lookup[entity.guid] = undefined;
            },
            store: function(entity) {
                if (!entity) return;
                var cachedEntity = angular.copy(entity);

                cache.data.push(cachedEntity);
                cache.lookup[cachedEntity.guid] = cachedEntity;
            }
        };
    }])

    .factory('SearchResults', ['$q', function($q) {

        var cache = {
            data: [],
            lookup: {}
        };

        return {
            load: function(placeName) {
                var q = $q.defer();
                
                var lookup = angular.copy(cache.lookup[placeName]);

                lookup !== undefined ? q.resolve(lookup) : q.reject(lookup);
                
                return q.promise;
            },
            query: function() {
                return angular.copy(cache.data);
            },
            remove: function(entity) {
                var index = cache.data.indexOf(entity.place_name);
                if (index !== -1) {
                    cache.data.splice(index, 1);
                }
                cache.lookup[entity.place_name] = undefined;
            },
            store: function(entity) {
                if (!entity) return;
                var cachedEntity = angular.copy(entity);

                cache.data.push(cachedEntity);
                cache.lookup[cachedEntity.place_name] = cachedEntity;
            }
        };
    }])

    .factory('UiUtils', [function() {

        return {
            hideLoadingIndicator: function() {
                console.log("Hiding UI Indicator ...");
            },
            displayLoadingIndicator: function() {
                console.log("Displaying UI Indicator ...");
            }
        };
    }]);

});
