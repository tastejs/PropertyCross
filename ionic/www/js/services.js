angular.module('propertycross.services', ['ngResource'])

.factory('Nestoria', function($resource, $q) {
    var service = $resource("http://api.nestoria.co.uk/api",
                            { country: "uk",
                              pretty: "1",
                              action: "search_listings",
                              encoding: "json",
                              listing_type: "buy",
                              callback: "JSON_CALLBACK" },
                            { search: { method: "JSONP" } }),
        lastSearchTerm,
        page = 1,
        lastResponse;

    return {

        // YUCK, can this be done as a property instead?
        lastResponse: function() {
            return lastResponse;
        },

        search: function(term) {
            lastSearchTerm = term;
            page = 1;

            var q = $q.defer();
            service.search({
                place_name: term,
                page: page
            },
            function(response) {
                lastResponse = response.response;
                q.resolve(response.response);
            },
            function(error) {
                lastResponse = null;
                q.reject(error);
            });
            return q.promise;
        },

        more: function() {
            var q = $q.defer();
            service.search({
                place_name: lastSearchTerm,
                page: ++page
            },
            function(response) {
                lastResponse = response.response;
                q.resolve(response.response);
            },
            function(error) {
                lastResponse = null;
                q.reject(error);
            });
            return q.promise;
        }
    };
});
