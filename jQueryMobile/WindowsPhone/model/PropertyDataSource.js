/// <reference path="..//intellisense.js" />

/*global $, Property, Location, setTimeout, Model */

Model.PropertySearchResponseCode = 
  {
    propertiesFound : 1,
    ambiguousLocation : 2,
    unknownLocation : 3
  };

Model.PropertyDataSource = function (config) {
  /// <summary>
  /// A service that allows property searches, returning the results as JavaScript objects. This class
  /// wraps a JSON datasource to create a more structured response that is de-coupled from the specifics
  /// of the Nestoria APIs.
  /// </summary>

  // ----- private variables

  // A source of JSON data.
  var jsonDataSource = config.dataSource;

  // ----- private functions

  function parseResponse(result) {
    /// <summary>
    /// Parses the JSON response into an array of Property instances or
    /// Location instances.
    /// </summary>
    var properties = [],
    locations = [],
    responseCode = result.response.application_response_code,
    property, location, response;

    if (responseCode === "100" || /* one unambiguous location */
        responseCode === "101" || /* best guess location */
        responseCode === "110" /* large location, 1000 matches max */) {

      $.each(result.response.listings, function (index, value) {
        property = new Model.Property({
          guid: value.guid,
          title: value.title,
          price: value.price_formatted.substr(0, value.price_formatted.lastIndexOf(" ")),
          bedrooms: value.bedroom_number,
          bathrooms: value.bathroom_number,
          propertyType: value.property_type,
          thumbnailUrl: value.img_url,
          summary: value.summary
        }); 
        properties.push(property);
      });

      response = new Model.PropertyDataSourceResponse({
        responseCode: Model.PropertySearchResponseCode.propertiesFound,
        data: properties,
        totalResults: result.response.total_results,
        pageNumber: result.response.page
      });

    } else if (responseCode === "200" || /* ambiguous location */
                responseCode === "202"/* mis-spelled location */) {

      $.each(result.response.locations, function (index, value) {
        location = new Model.Location({
          longTitle: value.long_title,
          placeName: value.place_name,
          title: value.title
        });
        locations.push(location);
      });

      response = new Model.PropertyDataSourceResponse({
        responseCode: Model.PropertySearchResponseCode.ambiguousLocation,
        data: locations
      });

    } else {
      /*
      201 - unkown location
      210 - coordinate error
      */
      response = new Model.PropertyDataSourceResponse({
        responseCode: Model.PropertySearchResponseCode.unknownLocation
      });
    }

    return response;
  }

  // ----- public functions

  this.findProperties = function (location, pageNumber, callback, errorCallback) {
    jsonDataSource.findProperties(location, pageNumber, function (results) {
      callback(parseResponse(results));
    }, errorCallback);
  };

  this.findPropertiesByCoordinate = function (latitude, longitude, pageNumber, callback, errorCallback) {
    jsonDataSource.findPropertiesByCoordinate(latitude, longitude, pageNumber, function (results) {
      callback(parseResponse(results));
    }, errorCallback);
  };
};






    