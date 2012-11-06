module.exports = function () {
  var _ = require("lib/underscore");

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
    var client = Ti.Network.createHTTPClient({
      onload:function (e) {
        //Titanium.API.log("response(" + this.status + "):" + this.responseText);
        callback(JSON.parse(this.responseText));
      },
      onerror:function (e) {
        errorCallback("datasource error [" + e.error + "]");
      },
      timeout:5000 // in milliseconds
    });
    var url = uri + "?" + _.map(params,function (value, key) {
      return key + "=" + value;
    }).join("&");
    //Titanium.API.log("request:" + url);
    client.open("GET", url);
    client.send();
  }

  // ----- public functions

  this.findProperties = function (location, pageNumber, callback, errorCallback) {
    /// <summary>
    /// Finds properties based on a location string
    /// </summary>
    var query = "http://api.nestoria.co.uk/api", params = {
      country:"uk",
      pretty:"1",
      action:"search_listings",
      encoding:"json",
      listing_type:"buy",
      page:pageNumber,
      place_name:location
    };

    ajaxRequest(query, params, callback, errorCallback);
  };

  this.findPropertiesByCoordinate = function (latitude, longitude, pageNumber, callback, errorCallback) {
    /// <summary>
    /// Finds properties based on lat / long values
    /// </summary>
    var query = "http://api.nestoria.co.uk/api", params = {
      country:"uk",
      pretty:"1",
      action:"search_listings",
      encoding:"json",
      listing_type:"buy",
      page:pageNumber,
      centre_point:latitude + "," + longitude
    };

    ajaxRequest(query, params, callback, errorCallback);
  };
};
