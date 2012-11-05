var _ = require("lib/underscore");
var Property = require("model/Property");
var Location = require("model/Location");
var PropertyDataSourceResponse = require("model/PropertyDataSourceResponse");
var PropertySearchResponseCode = require("model/PropertySearchResponseCode");
var JSONDataSource = require("model/JSONDataSource");

function PropertyDataSource(config) {
	/// <summary>
	/// A service that allows property searches, returning the results as JavaScript objects. This class
	/// wraps a JSON datasource to create a more structured response that is de-coupled from the specifics
	/// of the Nestoria APIs.
	/// </summary>

	// ----- private variables

	// A source of JSON data.
	this.jsonDataSource = new JSONDataSource();

	// ----- private functions

	function parseResponse(result) {
		/// <summary>
		/// Parses the JSON response into an array of Property instances or
		/// Location instances.
		/// </summary>
		var properties = [], locations = [], responseCode = result.response.application_response_code, property, location, response;

		if (responseCode === "100" || /* one unambiguous location */
		responseCode === "101" || /* best guess location */
		responseCode === "110" /* large location, 1000 matches max */) {

			_.each(result.response.listings, function(value) {
				property = new Property({
					guid : value.guid,
					title : value.title,
					price : value.price_formatted.substr(0, value.price_formatted.lastIndexOf(" ")),
					bedrooms : value.bedroom_number,
					bathrooms : value.bathroom_number,
					propertyType : value.property_type,
					thumbnailUrl : value.img_url,
					summary : value.summary
				});
				properties.push(property);
			});

			response = new PropertyDataSourceResponse({
				responseCode : PropertySearchResponseCode.propertiesFound,
				data : properties,
				totalResults : result.response.total_results,
				pageNumber : result.response.page
			});

		} else if (responseCode === "200" || /* ambiguous location */
		responseCode === "202"/* mis-spelled location */) {

			_.each(result.response.locations, function(value) {
				location = new Location({
					longTitle : value.long_title,
					placeName : value.place_name,
					title : value.title
				});
				locations.push(location);
			});

			response = new PropertyDataSourceResponse({
				responseCode : PropertySearchResponseCode.ambiguousLocation,
				data : locations
			});
		} else {
			/*
			 201 - unkown location
			 210 - coordinate error
			 */
			response = new PropertyDataSourceResponse({
				responseCode : PropertySearchResponseCode.unknownLocation
			});
		}

		return response;
	}

	// ----- public functions

	this.findProperties = function(location, pageNumber, callback, errorCallback) {
		this.jsonDataSource.findProperties(location, pageNumber, function(results) {
			callback(parseResponse(results));
		}, errorCallback);
	};

	this.findPropertiesByCoordinate = function(latitude, longitude, pageNumber, callback, errorCallback) {
		this.jsonDataSource.findPropertiesByCoordinate(latitude, longitude, pageNumber, function(results) {
			callback(parseResponse(results));
		}, errorCallback);
	};
}

module.exports = PropertyDataSource;
