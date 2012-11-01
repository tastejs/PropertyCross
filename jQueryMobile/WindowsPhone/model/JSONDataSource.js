define("model/JSONDataSource", function (require) {
  var $ = require("lib/jquery");
  return function () {
    /// <summary>
    /// A service that allows property searches, returning the results in JSON format. This service
    /// uses the Nestoria APIs.
    /// </summary>

    // ----- private functions

    function ajaxRequest(uri, params, callback, errorCallback) {
      /// <summary>
      /// Performs a JSON request via the jQuery-JSONP library
      /// http://code.google.com/p/jquery-jsonp/
      /// </summary>
      $.jsonp({
        dataType: "jsonp",
        data: params,
        url: uri,
        timeout: 5000,
        success: function (result) {
          callback(result);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          errorCallback("datasource error [" + textStatus + "] [" + errorThrown + "]");
        }
      });
    }

    // ----- public functions

    this.findProperties = function (location, pageNumber, callback, errorCallback) {
      /// <summary>
      /// Finds properties based on a location string
      /// </summary>
      var query = "http://api.nestoria.co.uk/api",
          params = {
            country: "uk",
            pretty: "1",
            action: "search_listings",
            encoding: "json",
            listing_type: "buy",
            page: pageNumber,
            place_name: location,
            callback: "_jqjsp"
          };

      ajaxRequest(query, params, callback, errorCallback);
    };

    this.findPropertiesByCoordinate = function (latitude, longitude, pageNumber, callback, errorCallback) {
      /// <summary>
      /// Finds properties based on lat / long values
      /// </summary>
      var query = "http://api.nestoria.co.uk/api",
          params = {
            country: "uk",
            pretty: "1",
            action: "search_listings",
            encoding: "json",
            listing_type: "buy",
            page: pageNumber,
            centre_point: latitude + "," + longitude,
            callback: "_jqjsp"
          };

      ajaxRequest(query, params, callback, errorCallback);
    };
  };
});