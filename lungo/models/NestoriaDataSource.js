define(
    [
        'lungo',
        'models/DataSourceResponse',
        'models/Property'
    ],

    function(Lungo, DataSourceResponse, Property) {

        var NestoriaDataSource = function() {

            this.rootUrl = 'http://api.nestoria.co.uk/api';

            this.defaultParams = {
                country: 'uk',
                pretty: 1,
                action: 'search_listings',
                encoding: 'json',
                listing_type: 'buy',
                page: 1,

                // Used to signify we are using jsonp
                callback: '?'
            };

            var parseResponse = function(xhr) {
                var response = xhr.response;
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
                    code: parseInt(response.application_response_code),
                    properties: listings,
                    total: response.total_results
                });
            };

            this.performSearch = function(search, callback) {
                Quo.json(
                    this.rootUrl,
                    Lungo.Core.mix(this.defaultParams, {
                        'place_name': search.name
                    }),
                    function(response) {
                        callback.call(this, parseResponse(response));
                    });
            };
        };

        return NestoriaDataSource;
    }
);