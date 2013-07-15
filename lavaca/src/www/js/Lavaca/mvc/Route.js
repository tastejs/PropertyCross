define(function(require) {

  var Disposable = require('lavaca/util/Disposable'),
      delay = require('lavaca/util/delay'),
      clone = require('mout/lang/deepClone'),
      merge = require('mout/object/merge');

  function _multivariablePattern() {
    return new RegExp('\\{\\*(.*?)\\}', 'g');
  }

  function _variablePattern() {
    return new RegExp('\\{([^\\/]*?)\\}', 'g');
  }

  function _variableCharacters() {
    return new RegExp('[\\{\\}\\*]', 'g');
  }

  function _datePattern() {
    return new RegExp('^\\d{4}-[0-1]\\d-[0-3]\\d$', 'g');
  }

  function _patternToRegExp(pattern) {
    if (pattern === '/') {
      return new RegExp('^\\/(\\?.*)?(#.*)?$', 'g');
    }
    if (pattern.charAt(0) === '/') {
      pattern = pattern.slice(1);
    }
    pattern = pattern.split('/');
    var exp = '^',
        i = -1,
        part;
    while (!!(part = pattern[++i])) {
      if (_multivariablePattern().test(part)) {
        exp += '(/([^/?#]+))*?';
      } else if (_variablePattern().test(part)) {
        exp += '/([^/?#]+)';
      } else {
        exp += '/' + part;
      }
    }
    exp += '(\\?.*)?(#\\.*)?$';
    return new RegExp(exp, 'g');
  }

  function _scrubURLValue(value) {
    value = decodeURIComponent(value);
    if (!isNaN(value)) {
      value = Number(value);
    } else if (value.toLowerCase() === 'true') {
      value = true;
    } else if (value.toLowerCase() === 'false') {
      value = false;
    } else if (_datePattern().test(value)) {
      value = value.split('-');
      value = new Date(Number(value[0]), Number(value[1]) - 1, Number(value[2]));
    }
    return value;
  }

  /**
   * @class Lavaca.mvc.Route
   * @super Lavaca.util.Disposable
   * A relationship between a URL pattern and a controller action
   *
   * @constructor
   * @param {String} pattern  The route URL pattern
   *   Route URL patterns should be in the form /path/{foo}/path/{*bar}.
   *   The path variables, along with query string parameters, will be passed
   *   to the controller action as a params object. In this case, when passed
   *   the URL /path/something/path/1/2/3?abc=def, the params object would be
   *   {foo: 'something', bar: [1, 2, 3], abc: 'def'}.
   * @param {Function} TController  The type of controller that performs the action
   *   (Should derive from [[Lavaca.mvc.Controller]])
   * @param {String} action  The name of the controller method to call
   * @param {Object} params  Key-value pairs that will be merged into the params
   *   object that is passed to the controller action
   */
  var Route = Disposable.extend(function(pattern, TController, action, params) {
    Disposable.call(this);
    this.pattern = pattern;
    this.TController = TController;
    this.action = action;
    this.params = params || {};
  }, {
    /**
     * @method matches
     * Tests if this route applies to a URL
     *
     * @param {String} url  The URL to test
     * @return {Boolean}  True when this route matches the URL
     */
    matches: function(url) {
      return _patternToRegExp(this.pattern).test(url);
    },
    /**
     * @method parse
     * Converts a URL into a params object according to this route's pattern
     *
     * @param {String} url  The URL to convert
     * @return {Object}  The params object
     */
    parse: function(url) {
      var result = clone(this.params),
          pattern = this.pattern.slice(1),
          urlParts = url.split('#'),
          i,
          query,
          path,
          pathItem,
          patternItem,
          name;
      result.url = url;
      result.route = this;
      urlParts = urlParts[1] ? urlParts[1].split('?') : urlParts[0].split('?');
      query = urlParts[1];
      if (query) {
        i = -1;
        query = query.split('&');
        while (!!(pathItem = query[++i])) {
          pathItem = pathItem.split('=');
          name = decodeURIComponent(pathItem[0]);
          if (result[name] !== undefined) {
            if (!(result[name] instanceof Array)) {
              result[name] = [result[name]];
            }
            result[name].push(_scrubURLValue(pathItem[1]));
          } else {
            result[name] = _scrubURLValue(pathItem[1]);
          }
        }
      }
      i = 0;
      path = urlParts[0].replace(/(^(http(s?)\:\/\/[^\/]+)?\/?)|(\/$)/, '');
      var breakApartPattern = new RegExp(pattern.replace(_multivariablePattern(), '(.+)').replace(_variablePattern(), '([^/]+)')),
          brokenPath = breakApartPattern.exec(path),
          brokenPattern = breakApartPattern.exec(pattern);
      while (!!(pathItem = brokenPath[++i])) {
        patternItem = brokenPattern[i];
        if (_multivariablePattern().test(patternItem)) {
          pathItem = pathItem.split('/');
        }
        result[patternItem.replace(_variableCharacters(), '')] = pathItem;
      }
      return result;
    },
    /**
     * @method exec
     * Executes this route's controller action
     *
     * @sig
     * @param {String} url  The URL that supplies parameters to this route
     * @param {Lavaca.mvc.Router} router  The router used by the application
     * @param {Lavaca.mvc.ViewManager}  viewManager The view manager used by the application
     * @return {Lavaca.util.Promise}  A promise
     *
     * @sig
     * @param {String} url  The URL that supplies parameters to this route
     * @param {Lavaca.mvc.Router} router  The router used by the application
     * @param {Lavaca.mvc.ViewManager}  viewManager The view manager used by the application
     * @param {Object} state  A history record object
     * @return {Lavaca.util.Promise}  A promise
     *
     * @sig
     * @param {String} url  The URL that supplies parameters to this route
     * @param {Lavaca.mvc.Router} router  The router used by the application
     * @param {Lavaca.mvc.ViewManager}  viewManager The view manager used by the application
     * @param {Object} state  A history record object
     * @param {Object} params  Additional parameters to pass to the controller action
     * @return {Lavaca.util.Promise}  A promise
     */
    exec: function(url, router, viewManager, state, params) {
      var controller = new this.TController(router, viewManager),
          urlParams = this.parse(url),
          promise = controller.exec(this.action, merge(urlParams, params), state);
      function dispose() {
        delay(controller.dispose, controller);
      }
      promise.then(dispose, dispose);
      return promise;
    }
  });

  return Route;

});
