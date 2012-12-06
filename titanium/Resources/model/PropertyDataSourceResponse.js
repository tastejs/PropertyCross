module.exports = function (config) {
  /// <summary>
  /// A model that represents the response from PropertyDataSource
  /// </summary>

  this.responseCode = config.responseCode;
  this.data = config.data;
  this.totalResults = config.totalResults;
  this.pageNumber = config.pageNumber;
};
