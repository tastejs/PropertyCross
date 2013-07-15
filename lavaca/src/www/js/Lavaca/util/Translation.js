define(function(require) {

  var Cache = require('./Cache'),
      Map = require('./Map');

  var _cache = new Cache();

  function _construct(name, src, code) {
    if (code) {
      code = JSON.parse(code);
    }
    var map = new Translation(name, src, code);
    if (!_cache.get(map.language)) {
      _cache.set(map.language, map);
    }
    return map;
  }

  /**
   * @class Lavaca.util.Translation
   * @super Lavaca.util.Map
   * Translation dictionary
   *
   * @constructor
   * @param {String} name  The name of the map
   * @param {String} src  The URL of the map's data (or null if code is supplied)
   * @param {String} code  The raw string data for the map (or null if src is supplied)
   */
  var Translation = Map.extend(function(name) {
    Map.apply(this, arguments);
    var locale = name.toLowerCase().split('_');
    /**
     * @field {String} language
     * @default null
     * The ISO 639-2 code for the translation's language
     */
    this.language = locale[0];
    /**
     * @field {String} country
     * @default ''
     * The ISO 3166-1 code for the translation's country
     */
    this.country = locale[1] || '';
    /**
     * @field {String} locale
     * @default null
     * The locale of this translation (either lang or lang_COUNTRY)
     */
    this.locale = this.country
      ? this.language + '_' + this.country
      : this.language;
  }, {
    /**
     * @method is
     * Determines whether or not this translation works for a locale
     *
     * @sig
     * @param {String} language  The locale's language
     * @return {Boolean}  True if this translation applies
     *
     * @sig
     * @param {String} language  The locale's language
     * @param {String} country   (Optional) The locale's country
     * @return {Boolean}  True if this translation applies
     */
    is: function(language, country) {
      return language === this.language
        && (!country || !this.country || country === this.country);
    }
  });
  /**
   * @method setDefault
   * @static
   * Sets the application's default locale
   *
   * @param {String} locale  A locale string (ie, "en", "en_US", or "es_MX")
   */
  Translation.setDefault = function(locale) {
    _cache.remove('default');
    Map.setDefault(_cache, Translation.forLocale(locale));
  };
  /**
   * @method forLocale
   * @static
   * Finds the most appropriate translation for a given locale
   *
   * @param {String} locale  The locale
   * @return {Lavaca.util.Translation}  The translation
   */
  Translation.forLocale = function(locale) {
    locale = (locale || 'default').toLowerCase();
    return _cache.get(locale)
      || _cache.get(locale.split('_')[0])
      || _cache.get('default');
  };
  /**
   * @method get
   * @static
   * Finds the most appropriate translation of a message for the default locale
   *
   * @sig
   * @param {String} code  The code under which the message is stored
   * @return {Lavaca.util.Translation}  The translation
   *
   * @sig
   * @param {String} locale  The locale
   * @param {String} code  The code under which the message is stored
   * @return {Lavaca.util.Translation}  The translation
   */
  Translation.get = function(locale, code) {
    if (!code) {
      code = locale;
      locale = 'default';
    }
    var translation = Translation.forLocale(locale),
        result = null;
    if (translation) {
      result = translation.get(code);
    }
    if (result === null) {
      translation = Translation.forLocale(locale.split('_')[0]);
      if (translation) {
        result = translation.get(code);
      }
    }
    if (result === null) {
      translation = Translation.forLocale('default');
      if (translation) {
        result = translation.get(code);
      }
    }
    return result;
  };
  /**
   * @method init
   * @static
   * Scans the document for all translations and prepares them
   *
   * @sig
   * @param {String} locale  The default locale
   *
   * @sig
   * @param {String} locale  The default locale
   * @param {jQuery} scope  The element to which to limit the scan
   */
  Translation.init = function(locale, scope) {
    Map.init(_cache, 'text/x-translation', _construct, scope);
    Translation.setDefault(locale);
  };
  /**
   * @method dispose
   * @static
   * Disposes of all translations
   */
  Translation.dispose = function() {
    Map.dispose(_cache);
  };

  return Translation;

});
