define(function(require) {

  var $ = require('$'),
      Cordova = require('cordova'),
      Promise = require('lavaca/util/Promise');

  /**
   * @class Lavaca.env.Device
   * Static utility type for working with Cordova (aka PhoneGap) and other non-standard native functionality
   */

  var _initHasRun = false,
      _onInit = [];

  var Device = {};

  /**
   * @method isCordova
   * @static
   * Indicates whether or not the app is being run through Cordova
   *
   * @return {Boolean}  True if app is being run through Cordova
   */
  Device.isCordova = function() {
    return !!Cordova;
  };
  /**
   * @method register
   * @static
   * Registers a plugin to be initialized when the device is ready
   *
   * @param {String} name
   * @param {Function} TPlugin  The plugin to register. The plugin should be a constructor function
   */
  Device.register = function(name, TPlugin) {
    function install() {
      if (!window.plugins) {
        window.plugins = {};
      }
      window.plugins[name] = new TPlugin();
    }
    if (_initHasRun) {
      install();
    } else {
      _onInit.push(install);
    }
  };

  /**
   * @method exec
   * @static
   * Executes a Cordova command, if Cordova is available
   *
   * @param {String} className  The name of the native class
   * @param {String} methodName  The name of the class method to call
   * @param {Array} args  Arguments to pass the method
   * @return {Lavaca.util.Promise}  A promise
   */
  Device.exec = function(className, methodName, args) {
    var promise = new Promise(window);
    if (Cordova) {
      Cordova.exec(promise.resolver(), promise.rejector(), className, methodName, args);
    } else {
      promise.reject();
    }
    return promise;
  };

  /**
   * @method init
   * @static
   * Executes a callback when the device is ready to be used
   *
   * @param {Function} callback  The handler to execute when the device is ready
   */
  Device.init = function(callback) {
    if (!Cordova) {
      $(document).ready(callback);
    }
    else if (document.addEventListener) {
      // Android fix
      document.addEventListener('deviceready', callback, false);
    } else {
      $(document).on('deviceready', callback);
    }
  };

  $(document).ready(function() {
    var i = -1,
        installPlugin;
    while (!!(installPlugin = _onInit[++i])) {
      installPlugin();
    }
    _initHasRun = true;
  });

  return Device;

});
