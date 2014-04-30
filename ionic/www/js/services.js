angular.module('propertycross.services', ['ngResource'])

.factory('Nestoria', function($resource, $q, RecentSearches) {
    var service = $resource('http://api.nestoria.co.uk/api',
                            { country: 'uk',
                              pretty: '1',
                              action: 'search_listings',
                              encoding: 'json',
                              listing_type: 'buy',
                              callback: 'JSON_CALLBACK' },
                            { search: { method: 'JSONP' } }),
        validCodes = [ '100', '101', '110' ],
        ambiguousCodes = [ '200', '202' ];

    return {

        search: function(placeName, page) {
            var q = $q.defer();
            service.search({
                place_name: placeName,
                page: page
            },
            function(response) {
                response = response.response;
                if (validCodes.indexOf(response.application_response_code) != -1) {
                    RecentSearches.add(placeName);
                    q.resolve(response);
                }
                else if (ambiguousCodes.indexOf(response.application_response_code) != -1) {
                    q.reject(response.locations.map(function(item) {
                        return { key: item.place_name, value: item.long_title };
                    }));
                }
                else {
                    q.reject('An error occurred while searching. Please check your network connection and try again.');
                }
            },
            function(error) {
                q.reject(error);
            });
            return q.promise;
        },

        searchByCoordinates: function(latitude, longitude, page) {
            var q = $q.defer();
            var searchTerm = latitude.toFixed(2) + ',' + longitude.toFixed(2);
            service.search({
                centre_point: searchTerm,
                page: page
            },
            function(response) {
                RecentSearches.add(searchTerm);
                q.resolve(response.response);
            },
            function(error) {
                q.reject(error);
            });
            return q.promise;
        }

    };
})

.factory('Geolocation', function($q) {

    return {

        getCurrentPosition: function() {
            var q = $q.defer();
            navigator.geolocation.getCurrentPosition(
                function(result) {
                    q.resolve(result);
                },
                function(error) {
                    q.reject(error);
                });
            return q.promise;
        }

    };
})

.factory('Properties', function($q, Nestoria, Geolocation) {

    var lastSearch = '',
        lastSearchPage = 1,
        lastResponse,
        properties = [];

    function toProperties(listings) {

        function simplifyTitle(title) {
            var parts = title.split(', ');
            parts.length = 2;
            return parts.join(', ');
        }
        function formatPrice(price) {
            return '£' + price.split(' ')[0];
        }

        return listings.map(function(listing) {
            return {
                guid: listing.guid,
                title: simplifyTitle(listing.title),
                price: formatPrice(listing.price_formatted),
                thumbnailURL: listing.thumb_url,
                imageURL: listing.img_url,
                summary: listing.summary,
                rooms: listing.bedroom_number + ' bed, ' + listing.bathroom_number + ' bathroom'
            };
        });
    }

    function search(page, placeName) {
        var q = $q.defer();
        Nestoria.search(placeName, page).then(
            function(response) {
                var responseProperties = toProperties(response.listings);
                if (!responseProperties.length) {
                    q.reject('There were no properties found for ' + placeName);
                    return;
                }
                if (placeName != lastSearch) {
                    properties = responseProperties;
                }
                else {
                    properties = properties.concat(responseProperties);
                }
                lastSearch = placeName;
                lastSearchPage = page;
                lastResponse = response;
                q.resolve(properties);
            },
            function(error) {
                q.reject(error);
            }
        );
        return q.promise;
    }

    function searchByCurrentLocation(page, coordinates) {
        var q = $q.defer();
        var doSearchByCoordinates = function(coords) {
            Nestoria.searchByCoordinates(coords.latitude,
                                         coords.longitude,
                                         page).then(
                function(response) {
                    var responseProperties = toProperties(response.listings);
                    if (!responseProperties.length) {
                        q.reject('There were no properties found for ' + placeName);
                        return;
                    }
                    if (coords != lastSearch) {
                        properties = responseProperties;
                    }
                    else {
                        properties = properties.concat(responseProperties);
                    }
                    lastSearch = coords;
                    lastSearchPage = page;
                    lastResponse = response;
                    q.resolve(properties);
                },
                function(error) {
                    q.reject(error);
                }
            );
        };

        if (!coordinates) {
            Geolocation.getCurrentPosition().then(
                function(result) {
                    var coords = { latitude: result.coords.latitude,
                                   longitude: result.coords.longitude };
                    doSearchByCoordinates(coords);
                },
                function(error) {
                    q.reject(error);
                }
            );
        }
        else {
            doSearchByCoordinates(coordinates);
        }

        return q.promise;
    }

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
            lastResponse = null;
            properties = [];
            return search(1, placeName);
        },

        searchByCurrentLocation: function() {
            lastResponse = null;
            properties = [];
            return searchByCurrentLocation(1);
        },

        more: function() {
            if (typeof lastSearch === 'string') {
                return search(lastSearchPage + 1, lastSearch);
            }
            else {
                return searchByCurrentLocation(lastSearchPage + 1, lastSearch);
            }
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
})

.factory('Favourites', function($q) {
    var properties = [];

    function save() {
        try {
            localStorage['favourites'] = JSON.stringify(properties);
        }
        catch(error) {
            console.error('Failed to save favourites', error);
        }
    }

    return {

        properties: function() {
            return properties;
        },

        load: function() {
            var q = $q.defer();
            if (!properties || !properties.length) {
                var json = localStorage['favourites'];
                properties = json ? JSON.parse(json) : [];
            }
            q.resolve(properties);
            return q.promise;
        },

        add: function(property) {
            if (!property) {
                return;
            }
            properties.push(property);
            save();
            return properties;
        },

        remove: function(property) {
            var index = properties.indexOf(property);
            if (index == -1) {
                return index;
            }
            properties.splice(index, 1);
            save();
            return properties;
        },

        get: function(id) {
            for (var i = 0, len = properties.length; i < len; i++) {
                if (properties[i].guid == id) {
                    return properties[i];
                }
            }
            return null;
        },

        isFavourite: function(property) {
            return properties.indexOf(property) != -1;
        }
    };
})

.factory('RecentSearches', function($q, $rootScope) {
    var searches = [];

    function save() {
        try {
            localStorage['searches'] = JSON.stringify(searches);
        }
        catch(error) {
            console.error('Failed to save recent searches', error);
        }
    }

    return {

        get: function() {
            var q = $q.defer();
            var json = localStorage['searches'];
            searches = json ? JSON.parse(json) : [];
            q.resolve(searches);
            return q.promise;
        },

        add: function(search) {
            if (!search) {
                return;
            }
            var index = searches.indexOf(search);
            if (index != -1) {
                searches.splice(index, 1);
            }
            searches.unshift(search);
            if (searches.length > 5) {
                searches.length = 5;
            }
            save();
            return searches;
        }

    };
})

;
