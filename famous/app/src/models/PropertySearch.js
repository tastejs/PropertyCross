/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var ajax = require('zepto.ajax');
    var zepto = require('zepto');

    var PropertyStore = require('models/PropertyStore');

    var defaultErrorMessage = 'An error occurred while searching. Please check your network connection and try again.';

    var cache = {};

    function _listingMapper(item) {
        var titleShortener = /^[^,]*,[^,]*/;

        var listing = {
            bathrooms : item.bathroom_number,
            bedrooms : item.bedroom_number,
            guid : item.guid,
            img: {
                size: [item.img_width, item.img_height],
                url : item.img_url
            },
            price : '£' + item.price_formatted.replace(/ GBP$/, ''),
            summary : item.summary,
            thumb : {
                size: [item.thumb_width, item.thumb_height],
                url : item.thumb_url
            },
            title : titleShortener.test(item.title) ? titleShortener.exec(item.title)[0] : item.title
        };

        PropertyStore.store(listing);

        return listing;
    }

    function _locationMapper(item) {
        return {
            place_name: item.place_name,
            title: item.long_title
        };
    }

    function _queryNestoria(query) {

        var urlParameters = {
            country: 'uk',
            pretty: '1',
            action: 'search_listings',
            encoding: 'json',
            listing_type: 'buy'
        };

        for(var param in query) {
            urlParameters[param] = query[param];
        }

        var url = 'http://api.nestoria.co.uk/api?' + ajax.param(urlParameters) + "&callback=?";

        if(cache[url] !== undefined) {
            var cacheDefer = zepto.Deferred();

            cacheDefer.resolve(cache[url]);
            return cacheDefer.promise();
        } else {
            return ajax.ajax({ url: url }).then(function(data, status) {
                var response = {};

                switch(data.response.application_response_code) {
                    case '100':
                    case '101':
                    case '110':
                        return {
                            location : zepto.map(data.response.locations, _locationMapper)[0],
                            listings : zepto.map(data.response.listings, _listingMapper),
                            state : 'unambiguous',
                            total: data.response.total_results
                        };
                    case '200':
                    case '202':
                        return {
                            locations : zepto.map(data.response.locations, _locationMapper),
                            state : 'ambiguous'
                        };
                    default:
                        return { state : 'fail' };
                };
            }, function(_, errorType, error) {
                return {
                    error: error || defaultErrorMessage,
                    errorType: errorType
                };
            }).then(function(result) {
                cache[url] = result;
                return result;
            });
        }
    }

    module.exports.coordinateBasedSearch = function(latitude, longitude) {
        var searchTerm = latitude.toFixed(2) + ',' + longitude.toFixed(2);

        return _queryNestoria({
            centre_point: searchTerm,
            page: 1
        });
    };

    module.exports.textBasedSearch = function(query) {
        return _queryNestoria({
            place_name: query,
            page: 1
        });
    };

    module.exports.queryProperties = function(query, page) {
        return _queryNestoria({
            place_name: query,
            page: page
        });
    };
});
