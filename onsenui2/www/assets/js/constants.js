/**
 * Global constants
 * @return {[type]} [description]
 */
(function() {
    'use strict';

    app.constant('PROPERTY_API', {
        baseUrl: 'http://api.nestoria.co.uk/api?country=uk&pretty=0&action=search_listings&encoding=json&listing_type=buy',
        error: {
            messages: {
                ZERO_PROPERTIES: 'There were no properties found for the given location.',
                GENERIC_ERROR: 'An error occurred while searching. Please check your network connection and try again.',
                LOCATION_DISABLED: 'The use of location is currently disabled.',
                LOCATION_UNAVAILABLE: 'Unable to detect current location. Please ensure location is turned on in your phone settings and try again.'
            }
        },
        status: {
            SUCCESS: 1,
            AMBIGUOUS: 2,
            ERROR: 0
        }
    });
})(window.app);