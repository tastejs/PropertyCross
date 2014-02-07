angular.module('propertycross.services', ['ngResource'])

.factory('Nestoria', function($resource, $q) {
    var service = $resource("http://api.nestoria.co.uk/api",
                            { country: "uk",
                              pretty: "1",
                              action: "search_listings",
                              encoding: "json",
                              listing_type: "buy",
                              callback: "JSON_CALLBACK" },
                            { search: { method: "JSONP" } });

    return {

        search: function(placeName, page) {
            var q = $q.defer();
            service.search({
                place_name: placeName,
                page: page
            },
            function(response) {
                q.resolve(response.response);
            },
            function(error) {
                q.reject(error);
            });
            return q.promise;
        },

        searchByCoordinates: function(coordinates, page) {
            var q = $q.defer();
            service.search({
                centre_point: coordinates,
                page: page
            },
            function(response) {
                q.resolve(response.response);
            },
            function(error) {
                q.reject(error);
            });
            return q.promise;
        }

    };
})

.factory('Properties', function($q, Nestoria) {

    var lastSearch = '',
        page = 1,
        lastResponse,
        properties = [];

    return {
        current: function() {
            return properties;
        },

        count: function() {
            return properties.length;
        },

        total: function() {
            return Number(lastResponse.total_results);
        },

        location: function() {
            return lastSearch;
        },

        search: function(placeName) {
            lastSearch = placeName;
            page = 1;
            lastResponse = null;
            properties = [];

            var q = $q.defer();
            Nestoria.search(placeName, page).then(
                function(response) {
                    lastResponse = response;
                    properties = response.listings;
                    q.resolve(properties);
                },
                function(error) {
                    q.reject(error);
                }
            );
            return q.promise;
        },

        searchByCurrentLocation: function() {
            // TODO
        },

        moreProperties: function() {
            var q = $q.defer();
            Nestoria.search(lastSearch, ++page).then(
                function(response) {
                    lastResponse = response;
                    properties.append(response.listings);
                    q.resolve(properties);
                },
                function(error) {
                    q.reject(error);
                }
            );
            return q.promise;
        },

        get: function(id) {
            for (var i = 0, len = properties.length; i < len; i++) {
                if (properties[i].guid == id) {
                    return properties[i];
                }
            }
            return null;
        }
    };
});
