define(function() {

  var _uuidMap = {};
  /**
   * @class Lavaca.util.uuid
   * Produces a app specific unique identifier
   *
   * @method uuid
   * @static
   * Produces a unique identifier
   * @param {String} namespace  A string served the namespace of a uuid
   *
   * @return {Number}  A number that is unique to this page
   */
  var uuid = function(namespace) {
    namespace = namespace || '__defaultNS';
    if (typeof _uuidMap[namespace] !== 'number') {
      _uuidMap[namespace] = 0;
    }
    return _uuidMap[namespace]++;
  };

  return uuid;

});
