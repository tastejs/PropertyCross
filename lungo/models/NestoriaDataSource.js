define(
    [
        'models/DataSourceResponse',
        'models/DataSourceResponseCode',
        'models/Property',
        'models/Location',
        'models/Search'
    ],

    function(DataSourceResponse, DataSourceResponseCode, Property, Location, Search) {

        var NestoriaDataSource = function() {

            this.rootUrl = 'http://api.nestoria.co.uk/api';

            this.defaultParams = {
                country: 'uk',
                pretty: 1,
                action: 'search_listings',
                encoding: 'json',
                listing_type: 'buy',

                // Used to signify we are using jsonp
                callback: '?'
            };

            var parseResponse = function(xhr, search) {
                var response = xhr.response,
                    responseCode = response.application_response_code;

                if(responseCode === '100' ||    // One ambigious location
                    responseCode === '101' ||   // Best guess location
                    responseCode === '110') {   // Large location, many matches
                    var listings = [];

                    response.listings.forEach(function(listing) {
                        listings.push(new Property({
                            guid: listing.guid,
                            price: listing.price,
                            bedrooms: listing.bedroom_number ? parseInt(listing.bedroom_number) : 0,
                            bathrooms: listing.bathroom_number ? parseInt(listing.bathroom_number) : 0,
                            propertyType: listing.property_type,
                            title: listing.title,
                            thumbnailUrl: listing.thumb_url,
                            imgUrl: listing.img_url,
                            summary: listing.summary
                        }));
                    });

                    return new DataSourceResponse({
                        code: DataSourceResponseCode.PROPERTIES_FOUND,
                        data: listings,
                        total: response.total_results,
                        pageNumber: parseInt(response.page),
                        search: search
                    });
                } else if(responseCode === '200' || // Ambigious Location
                    responseCode === '202') {       // Misspelled location

                    var suggestedLocations = [];

                    // response.locations will contain a list of suggested locations, parse
                    // these and return them to the user
                    response.locations.forEach(function(location) {
                        suggestedLocations.push(new Location({
                            longTitle: location.long_title,
                            placeName: location.place_name
                        }));
                    });

                    return new DataSourceResponse({
                        code: DataSourceResponseCode.AMBIGIOUS_LOCATION,
                        data: suggestedLocations,
                        total: 0,
                        pageNumber: 0,
                        search: search
                    });
                } else {
                    // 201 - unknown location
                    // 210 - coordinate error
                    return new DataSourceResponse({
                        code: DataSourceResponseCode.UNKNOWN_LOCATION,
                        data: [],
                        total: 0,
                        pageNumber: 0,
                        search: search
                    });
                }
            };

            var perform = Lungo.Core.bind(this, function(search, callback, errorCallback, options) {
                Quo.ajax({
                    url: this.rootUrl,
                    timeout: 5000,
                    dataType: 'json',
                    data: Lungo.Core.mix(this.defaultParams, options),
                    success: function(response) {
                        callback.call(this, parseResponse(response, search))
                    },
                    error: function() {
                        errorCallback.call(this, 'An error occurred while searching. Please check your network connection and try again.');
                    }
                })
            });

            this.performSearch = function(search, callback, errorCallback) {
                var opts;

                if(search.type === Search.Type.location) {
                    opts = {
                        'centre_point': search.position.latitude() + ',' + search.position.longitude(),
                        'page': search.pageNumber
                    }
                } else if(search.type === Search.Type.term) {
                    opts = {
                        'place_name': search.term,
                        'page': search.pageNumber
                    }
                }

                perform(search, callback, errorCallback, opts);
            };
        };

        return NestoriaDataSource;
    }
);