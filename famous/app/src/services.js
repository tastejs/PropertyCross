
 define(['angular', 'angular-resource'], function(angular) {
    'use strict';

    angular.module('propertycross.services', ['ngResource'])

    .factory('NestoriaApi', ['$resource', '$q', function($resource, $q) {
        function validResponse(q, response) { q.resolve(response.response); }
        function ambiguousResponse(q, response) { q.reject(response.response); }
        function errorResponse(q, errorDetails) { q.reject({ error: errorDetails }); }

        var routes = {
            '100' : validResponse,
            '101' : validResponse,
            '110' : validResponse,
            '200' : ambiguousResponse,
            '202' : ambiguousResponse
        };

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
            load: function(place_name) {
                return angular.copy(cache.lookup[place_name]);
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
    }]);

});
