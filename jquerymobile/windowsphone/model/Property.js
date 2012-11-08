define(function (require, exports, module) {
  module.exports = function (config) {
    /// <summary>
    /// A model that represents a single property listing.
    /// </summary>
    this.guid = config.guid;
    this.price = config.price;
    this.bedrooms = config.bedrooms;
    this.bathrooms = config.bathrooms;
    this.propertyType = config.propertyType;
    this.title = config.title;
    this.thumbnailUrl = config.thumbnailUrl;
    this.imgUrl = config.imgUrl;
  };
});
