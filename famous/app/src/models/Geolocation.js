/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var deferred = require('zepto.deferred');

    var navigator = window.navigator;

    var Geolocation = {
        getCurrentPosition: function() {
            var defer = deferred.Deferred();

            navigator.geolocation.getCurrentPosition(
                function(result) {
                    var coordinates = {
                        latitude: result.coords.latitude,
                        longitude: result.coords.longitude
                    };
                    defer.resolve(coordinates);
                },
                function(error) {
                    var message = "";
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message = "The use of location is currently disabled.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                        case error.PERMISSION_DENIED_TIMEOUT:
                            message = "Unable to detect current location. " +
                                "Please ensure location is turned on in your phone settings and try again.";
                            break;
                    }
                    defer.reject(message);
                });
            return defer.promise();
        }
    };

    module.exports = Geolocation;
});
