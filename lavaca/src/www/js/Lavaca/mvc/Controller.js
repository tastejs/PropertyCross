define(function(require) {

  var Connectivity = require('lavaca/net/Connectivity'),
      History = require('lavaca/net/History'),
      Disposable = require('lavaca/util/Disposable'),
      Promise = require('lavaca/util/Promise'),
      StringUtils = require('lavaca/util/StringUtils'),
      Translation = require('lavaca/util/Translation');

  /**
   * @class Lavaca.mvc.Controller
   * @super Lavaca.util.Disposable
   * Base type for controllers
   *
   * @constructor
   * @param {Lavaca.mvc.Controller} other  Another controller from which to take context information
   *
   * @constructor
   * @param {Lavaca.mvc.Router} router  The application's router
   * @param {Lavaca.mvc.ViewManager} viewManager  The application's view manager
   */
  var Controller = Disposable.extend(function(router, viewManager) {
    if (router instanceof Controller) {
      this.router = router.router;
      this.viewManager = router.viewManager;
    } else {
      this.router = router;
      this.viewManager = viewManager;
    }
  }, {
    /**
     * @field {Lavaca.mvc.Router} router
     * @default null
     * The application's router
     */
    router: null,
    /**
     * @field {Lavaca.mvc.ViewManager} viewManager
     * @default null
     * The application's view manager
     */
    viewManager: null,
    /**
     * @method exec
     * Executes an action on this controller
     *
     * @sig
     * @param {String} action  The name of the controller method to call
     * @param {Object} params  Key-value arguments to pass to the action
     * @return {Lavaca.util.Promise}  A promise
     *
     * @sig
     * @param {String} action  The name of the controller method to call
     * @param {Object} params  Key-value arguments to pass to the action
     * @param {Object} state  A history record object
     * @return {Lavaca.util.Promise}  A promise
     */
    exec: function(action, params, state) {
      this.params = params;
      this.state = state;
      var promise = new Promise(this),
          model,
          result;
      if (state) {
        model = state.state;
        promise.success(function() {
          document.title = state.title;
        });
      }
      result = this[action](params, model);
      if (result instanceof Promise) {
        promise.when(result);
      } else {
        promise.resolve();
      }
      return promise;
    },
    /**
     * @method ajax
     * Makes an AJAX request
     *
     * @param {Object} opts  jQuery AJAX options
     * @return {Lavaca.util.Promise}  A promise
     */
    ajax: function(opts) {
      return Promise.when(this, Connectivity.ajax(opts));
    },
    /**
     * @method view
     * Loads a view
     *
     * @param {String} cacheKey  The key under which to cache the view
     * @param {Function} TView  The type of view to load (should derive from [[Lavaca.mvc.View]])
     * @param {Object} model  The data object to pass to the view
     * @param {Number} layer  The integer indicating what UI layer the view sits on
     * @return {Lavaca.util.Promise}  A promise
     */
    view: function(cacheKey, TView, model, layer) {
      return Promise.when(this, this.viewManager.load(cacheKey, TView, model, layer));
    },
    /**
     * @method history
     * Adds a state to the browser history
     *
     * @param {Object} state  A data object associated with the page state
     * @param {String} title  The title of the page state
     * @param {String} url  The URL of the page state
     * @param {Boolean} useReplace  The bool to decide if to remove previous history
     */
    history: function(state, title, url, useReplace) {
      var needsHistory = !this.state;
      return function() {
        if (needsHistory) {
          History[useReplace ? 'replace' : 'push'](state, title, url);
        }
      };
    },
    /**
     * @method translate
     * Convenience method for accessing translated messages
     *
     * @sig
     * @param {String} code  The key of the translated message
     * @return {String} The translated message
     *
     * @sig
     * @param {String} code  The key of the translated message
     * @param {Array} args  Values to substitute into the message using [[Lavaca.util.StringUtils]].format()
     * @return {String}  The translated message
     */
    translate: function(code, args) {
      var result = Translation.get(code);
      if (result && args) {
        result = StringUtils.format.apply(null, [result].concat(args));
      }
      return result;
    },
    /**
     * @method url
     * Convenience method for formatting URLs
     *
     * @param {String} str  The URL string
     * @param {Array} args  Format arguments to insert into the URL
     * @return {String}  The formatted URL
     */
    url: function(str, args) {
      return StringUtils.format(str, args, encodeURIComponent);
    },
    /**
     * @method redirect
     * Directs the user to another route
     *
     * @sig
     * @param {String} str  The URL string
     * @return {Lavaca.util.Promise}  A promise
     *
     * @sig
     * @param {String} str  The URL string
     * @param {Array} args  Format arguments to insert into the URL
     * @return {Lavaca.util.Promise}  A promise
     */
    redirect: function(str, args) {
      return this.router.unlock().exec(this.url(str, args || []));
    },
    /**
     * @method dispose
     * Readies the controller for garbage collection
     */
    dispose: function() {
      // Do not dispose of view manager or router
      this.router
        = this.viewManager
        = null;
      Disposable.prototype.dispose.apply(this, arguments);
    }
  });

  return Controller;

});
