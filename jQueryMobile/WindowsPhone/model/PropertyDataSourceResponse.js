/// <reference path="..//intellisense.js" />

/*global $, Model */

Model.PropertyDataSourceResponse = function (config) {
  /// <summary>
  /// A model that represents the response from PropertyDataSource
  /// </summary>

  this.responseCode = config.responseCode;
  this.data = config.data;
  this.totalResults = config.totalResults;
  this.pageNumber = config.pageNumber;
};
