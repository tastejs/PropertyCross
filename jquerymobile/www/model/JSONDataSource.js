define(function (require, exports, module) {
  module.exports = function () {
    var $ = require("lib/jquery");

    /// <summary>
    /// A service that allows property searches, returning the results in JSON format. This service
    /// uses the Nestoria APIs.
    /// </summary>

    // ----- private functions

    function ajaxRequest(uri, params) {
      /// <summary>
      /// Performs a JSON request via jQuery
      /// https://learn.jquery.com/ajax/working-with-jsonp/
      /// </summary>
      return $.ajax({
        url: uri,
        // Tell jQuery we're expecting JSONP
        dataType: "jsonp",
        data:params,
        timeout:5000
      });
    }

    // ----- public functions

    this.findProperties = function (location, pageNumber) {
      /// <summary>
      /// Finds properties based on a location string
      /// </summary>
      var query = "http://api.nestoria.co.uk/api",
          params = {
            country:"uk",
            pretty:"1",
            action:"search_listings",
            encoding:"json",
            listing_type:"buy",
            page:pageNumber,
            place_name:location
          };

      return ajaxRequest(query, params);
    };

    this.findPropertiesByCoordinate = function (latitude, longitude, pageNumber) {
      /// <summary>
      /// Finds properties based on lat / long values
      /// </summary>
      var query = "http://api.nestoria.co.uk/api",
          params = {
            country:"uk",
            pretty:"1",
            action:"search_listings",
            encoding:"json",
            listing_type:"buy",
            page:pageNumber,
            centre_point:latitude + "," + longitude
          };

      return ajaxRequest(query, params);
    };
  };
});
