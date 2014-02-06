angular.module('propertycross.services', ['ionic', 'ngResource'])

.factory('Nestoria', function($resource, $q) {
    var service = $resource("http://api.nestoria.co.uk/api",
                            { country: "uk",
                              pretty: "1",
                              action: "search_listings",
                              encoding: "json",
                              listing_type: "buy",
                              callback: "JSON_CALLBACK",
                              page: 1 },
                            { search: { method: "JSONP" } });
    return {
        search: function(location) {
            var q = $q.defer();
            service.search({
                place_name: location
            },
            function(response) {
                q.resolve(response);
            },
            function(error) {
                q.reject(error);
            });
            return q.promise;
        }
    };
});
