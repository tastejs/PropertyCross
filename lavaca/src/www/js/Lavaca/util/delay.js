define(function() {
  /**
   * @class Lavaca.util.delay
   * Wraps setTimeout and delays the execution of a function
   *
   * @method delay
   * @static
   * Delays the execution of a function
   *
   * @param {Function} callback  A callback to execute on delay
   *
   * @sig
   * @param {Function} callback  A callback to execute on delay
   * @param {Object} thisp  The object to use as the "this" keyword
   * @return {Number}  The timeout ID
   *
   * @sig
   * @param {Function} callback  A callback to execute on delay
   * @param {Object} thisp  The object to use as the "this" keyword
   * @param {Number} ms  The number of milliseconds to delay execution
   * @return {Number}  The timeout ID
   */
  var delay = function(callback, thisp, ms) {
    return setTimeout(function() {
      callback.call(thisp);
    }, ms || 0);
  };

  return delay;

});
