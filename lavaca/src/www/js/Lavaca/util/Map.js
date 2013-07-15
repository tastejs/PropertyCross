define(function(require) {

  var $ = require('$'),
      Cache = require('./Cache'),
      Disposable = require('./Disposable'),
      Connectivity = require('lavaca/net/Connectivity');

  function _absolute(url) {
    if (url && url.indexOf('http') !== 0) {
      if (url.charAt(0) === '/') {
        url = location.protocol + '//'
          + location.hostname
          + (location.port ? ':' + location.port : '')
          + (url.indexOf('/') === 0 ? url : '/' + url);
      } else {
        url = location.toString().split('#')[0].split('?')[0].replace(/\w+\.\w+$/, '') + url;
      }
    }
    return url;
  }

  /**
   * @class Lavaca.util.Map
   * @super Lavaca.util.Disposable
   * Abstract type for lookup tables
   *
   * @constructor
   * @param {String} name  The name of the map
   * @param {String} src  The URL of the map's data (or null if code is supplied)
   * @param {String} code  The raw string data for the map (or null if src is supplied)
   */
  var Map = Disposable.extend(function(name, src, code) {
    Disposable.call(this);
    /**
     * @field {Boolean} hasLoaded
     * @default false
     * Whether or not the map has loaded
     */
    this.hasLoaded = false;
    /**
     * @field {String} name
     * @default null
     * The name of the map
     */
    this.name = name;
    /**
     * @field {String} src
     * @default null
     * The source URL for the map
     */
    this.src = _absolute(src);
    /**
     * @field {String} code
     * @default null
     * The raw string data for the map
     */
    this.code = code;
    /**
     * @field {Lavaca.util.Cache} cache
     * @default new Lavaca.util.Cache()
     * The cache in which this map stores data
     */
    this.cache = new Cache();
  }, {
    /**
     * @method is
     * Determines whether or not this is the desired lookup
     *
     * @param {String} name  The name of the lookup
     * @return {Boolean}  True if this is the lookup
     */
    is: function(name) {
      return this.name === name;
    },
    /**
     * @method get
     * Gets the value stored under a code
     *
     * @param {String} code  The code
     * @return {Object}  The value (or null)
     */
    get: function(code) {
      if (!this.hasLoaded) {
        if (this.code) {
          this.add(this.code);
        } else if (this.src) {
          this.load(this.src);
        }
        this.hasLoaded = true;
      }
      return this.cache.get(code);
    },
    /**
     * @method add
     * Adds parameters to this map
     *
     * @param {Object} data  The parameters to add
     */
    add: function(data) {
      for (var n in data) {
        this.cache.set(n, data[n]);
      }
    },
    /**
     * @method process
     * Processes server data to include in this lookup
     *
     * @param {String} text  The server data string
     */
    process: function(text) {
      this.add(typeof text === 'string' ? JSON.parse(text) : text);
    },
    /**
     * @method load
     * Adds JSON data to this map (synchronous)
     *
     * @param {String} url  The URL of the data
     */
    load: function(url) {
      var self = this;
      Connectivity.ajax({
        async: false,
        url: url,
        success: function(resp) {
          self.process(resp);
        }
      });
    }
  });
  /**
   * @method setDefault
   * @static
   * Sets the application's default config
   *
   * @param {Lavaca.util.Cache} cache  The map cache
   * @param {String} name  The name of the config
   */
  Map.setDefault = function(cache, name) {
    var map = name;
    if (typeof map === 'string') {
      map = cache.get(name);
    }
    cache.set('default', map);
  };
  /**
   * @method get
   * @static
   * Finds the most appropriate value for a code
   *
   * @param {Lavaca.util.Cache} cache  The maps cache
   * @param {String} name  The name of the map
   * @param {String} code  The name of the parameter
   * @param {String} defaultName  The name of the default map
   * @return {Object}  The value of the parameter
   */
  Map.get = function(cache, name, code, defaultName) {
    if (!code) {
      code = name;
      name = defaultName;
    }
    if (name) {
      var map = cache.get(name);
      if (map) {
        return map.get(code);
      }
    }
    return null;
  };
  /**
   * @method init
   * @static
   * Scans the document for all maps and prepares them
   *
   * @param {Lavaca.util.Cache} cache  The map cache
   * @param {String} mimeType  The MIME type of the scripts
   * @param {Function} construct  A function that returns a new map, in
   *   the form construct(name, src, code)
   * @param {jQuery} scope  The element to which to limit the scan
   */
  Map.init = function(cache, mimeType, construct, scope) {
    $(scope || document.documentElement)
      .find('script[type="' + mimeType + '"]')
      .each(function() {
        var item = $(this),
            src = item.attr('data-src'),
            name = item.attr('data-name'),
            isDefault = typeof item.attr('data-default') === 'string',
            code = item.text(),
            map;
        map = construct(name, src, code);
        cache.set(map.name, map);
        if (isDefault) {
          Map.setDefault(cache, name);
        }
      });
  };
  /**
   * @method dispose
   * @static
   * Disposes of all maps
   *
   * @param {Lavaca.util.Cache} cache  The map cache
   */
  Map.dispose = function(cache) {
    cache.dispose();
  };

  return Map;

});
