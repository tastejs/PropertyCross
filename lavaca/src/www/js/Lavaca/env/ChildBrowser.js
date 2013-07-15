define(function(require) {

  var Device = require('lavaca/env/Device'),
      EventDispatcher = require('lavaca/events/EventDispatcher'),
      Promise = require('lavaca/util/Promise');

  /**
   * @class Lavaca.env.ChildBrowser
   * @super Lavaca.events.EventDispatcher
   * A sub-browser management utility (also accessible via window.plugins.childBrowser)
   *
   * @event open
   * @event close
   * @event change
   *
   * @constructor
   */
  var ChildBrowser = EventDispatcher.extend({
    /**
     * @method showWebPage
     * Opens a web page in the child browser (or navigates to it)
     *
     * @param {String} loc  The URL to open
     * @return {Lavaca.util.Promise}  A promise
     */
    showWebPage: function(loc) {
      if (Device.isCordova()) {
        return Device
          .exec('ChildBrowser', 'showWebPage', [loc])
          .error(function() {
            window.location.href = loc;
          });
      } else {
        window.open(loc);
        return new Promise(window).resolve();
      }
    },
    /**
     * @method close
     * Closes the child browser, if it's open
     *
     * @return {Lavaca.util.Promise}  A promise
     */
    close: function() {
      return Device.exec('ChildBrowser', 'close', []);
    }
  });

  Device.register('childBrowser', ChildBrowser);

  return ChildBrowser;

});
