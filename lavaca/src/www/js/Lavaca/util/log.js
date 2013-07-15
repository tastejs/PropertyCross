define(function() {
  /**
   * @class Lavaca.util.log
   * Logs to the console (or alerts if no console exists)
   *
   *
   * @method log
   * @static
   * Logs to the console (or alerts if no console exists)
   *
   * @params {Object} arg  The content to be logged
   */
  var log = function() {
    if (window.console) {
      console.log.apply(console, arguments);
    } else {
      alert([].join.call(arguments, ' '));
    }
  };

  return log;

});
