module.exports = function (config) {
  /// <summary>
  /// A model that represents a location. This is composed of a human readable display string and a
  /// placename, which is the string sent to Nestoria in order to perform a search.
  ///
  /// e.g. longTitle='Albury, Guildford', placename = 'albury_guildford'
  /// </summary>

  // this display name
  this.longTitle = config.longTitle;
  // the query name
  this.placeName = config.placeName;
};
