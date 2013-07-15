define(function(require) {

  var $ = require('$'),
      Promise = require('lavaca/util/Promise'),
      resolve = require('lavaca/util/resolve');

  /**
   * @class Lavaca.net.Connectivity
   * A utility type for working under different network connectivity situatioConnectivity.
   */

  var _navigatorOnlineSupported = typeof navigator.onLine === 'boolean',
      _offlineAjaxHandlers = [],
      _offlineErrorCode = 'offline';

  function _onAjaxError(arg) {
    if (arg === _offlineErrorCode) {
      var i = -1,
          callback;
      while (!!(callback = _offlineAjaxHandlers[++i])) {
        callback(arg);
      }
    }
  }

  var Connectivity = {};

  /**
   * @method isOffline
   * @static
   * Attempts to detect whether or not the browser is connected
   *
   * @return {Boolean}  True if the browser is offline; false if the browser is online
   *    or if connection status cannot be determined
   */
  Connectivity.isOffline = function() {
    var connectionType = resolve('navigator.connection.type');
    if (connectionType !== null) {
      return connectionType === resolve('Connection.NONE');
    } else {
      return _navigatorOnlineSupported ? !navigator.onLine : false;
    }
  };

  /**
   * @method ajax
   * @static
   * Makes an AJAX request if the user is online. If the user is offline, the returned
   * promise will be rejected with the string argument "offline"
   *
   * @param {Object} opts  jQuery-style AJAX options
   * @return {Lavaca.util.Promise}  A promise
   */
  Connectivity.ajax = function(opts) {
    var promise = new Promise(),
        origSuccess = opts.success,
        origError = opts.error;
    opts.success = function() {
      if (origSuccess) {
        origSuccess.apply(this, arguments);
      }
      promise.resolve.apply(promise, arguments);
    };
    opts.error = function() {
      if (origError) {
        origError.apply(this, arguments);
      }
      promise.reject.apply(promise, arguments);
    };
    if (Connectivity.isOffline()) {
      promise.reject(_offlineErrorCode);
    } else {
      $.ajax(opts);
    }
    promise.error(_onAjaxError);
    return promise;
  };

  /**
   * @method registerOfflineAjaxHandler
   * @static
   * Adds a callback to be executed whenever any Lavaca.net.Connectivity.ajax() call is
   * blocked as a result of a lack of internet connection.
   *
   * @param {Function} callback  The callback to execute
   */
  Connectivity.registerOfflineAjaxHandler = function(callback) {
    _offlineAjaxHandlers.push(callback);
  };

  return Connectivity;

});
