define(function(require) {

  var Cache = require('./Cache'),
      Map = require('./Map');

  var _cache = new Cache();

  function _construct(name, src, code) {
    if (code) {
      code = JSON.parse(code);
    }
    return new Config(name, src, code);
  }

  /**
   * @class Lavaca.util.Config
   * @super Lavaca.util.Map
   * Configuration management type
   */
  var Config = Map.extend({
    // Empty (no overrides)
  });
  /**
   * @method setDefault
   * @static
   * Sets the application's default config
   *
   * @param {String} name  The name of the default config
   */
  Config.setDefault = function(name) {
    Map.setDefault(_cache, name);
  };
  /**
   * @method currentEnvironment
   * @static
   * Gets the application's current config environment name
   *
   * @return {String} The name of the current environment
   */
  Config.currentEnvironment = function() {
    return _cache.get('default').name;
  };
  /**
   * @method get
   * @static
   * Retrieves a value from the configuration
   *
   * @sig
   * @param {String} code  The name of the parameter
   * @return {Object}  The value of the parameter
   *
   * @sig
   * @param {String} name  The name of the config
   * @param {String} code  The name of the parameter
   * @return {Object}  The value of the parameter
   */
  Config.get = function(name, code) {
    return Map.get(_cache, name, code, 'default');
  };
  /**
   * @method init
   * @static
   * Scans the document for all translations and prepares them
   *
   * @sig
   *
   * @sig
   * @param {jQuery} scope  The element to which to limit the scan
   */
  Config.init = function(scope) {
    Map.init(_cache, 'text/x-config', _construct, scope);
  };
  /**
   * @method dispose
   * @static
   * Disposes of all translations
   */
  Config.dispose = function() {
    Map.dispose(_cache);
  };

  Config.init();

  return Config;

});
