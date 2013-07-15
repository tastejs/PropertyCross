define(function(require) {

  var Disposable = require('lavaca/util/Disposable'),
      deepMixIn = require('mout/object/deepMixIn');

  /**
   * @class Lavaca.events.EventDispatcher
   * @super Lavaca.util.Disposable
   * Basic event dispatcher type
   *
   * @constructor
   */
  var EventDispatcher = Disposable.extend({
    /**
     * @field {Boolean} suppressEvents
     * @default false
     * When true, do not fire events
     */
    suppressEvents: false,
    /**
     * @method on
     *
     * Bind an event handler to this object
     *
     * @sig
     * @param {String} type  The name of the event
     * @param {Function} callback  The function to execute when the event occurs
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     *
     * @sig
     * @param {String} type  The name of the event
     * @param {Function} callback  The function to execute when the event occurs
     * @param {Object} thisp  The context of the handler
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    on: function(type, callback, thisp) {
      var calls = this.callbacks || (this.callbacks = {}),
          list = calls[type] || (calls[type] = []);
      list[list.length] = {fn: callback, thisp: thisp};
      return this;
    },
    /**
     * @method off
     *
     * @sig
     * Unbinds all event handler from this object
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     *
     * @sig
     * Unbinds all event handlers for an event
     * @param {String} type  The name of the event
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     *
     * @sig
     * Unbinds a specific event handler
     * @param {String} type  The name of the event
     * @param {Function} callback  The function handling the event
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     *
     * @sig
     * Unbinds a specific event handler
     * @param {String} type  The name of the event
     * @param {Function} callback  The function handling the event
     * @param {Object} thisp  The context of the handler
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    off: function(type, callback, thisp) {
      var calls = this.callbacks,
          list,
          handler,
          i = -1,
          newList,
          isCallback,
          isThisp;
      if (!type) {
        delete this.callbacks;
      } else if (calls) {
        if (!callback) {
          delete calls[type];
        } else {
          list = calls[type];
          if (list) {
            newList = calls[type] = [];
            while (!!(handler = list[++i])) {
              isCallback = handler.fn === callback ||
                           handler.fn.fn === callback ||
                           (handler.fn.guid && handler.fn.guid === callback.guid) || // Check if is jQuery proxy of callback
                           (handler.fn._zid && handler.fn._zid === callback._zid); // Check if is Zepto proxy of callback
              isThisp = thisp && (handler.thisp === thisp || handler.fn.thisp === thisp);
              if (!isCallback || (thisp && !isThisp)) {
                newList[newList.length] = handler;
              }
            }
          }
        }
      }
      return this;
    },
    /**
     * @method trigger
     * Dispatches an event
     *
     * @sig
     * @param {String} type  The type of event to dispatch
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     *
     * @sig
     * @param {String} type  The type of event to dispatch
     * @param {Object} params  Additional data points to add to the event
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    trigger: function(type, params) {
      if (!this.suppressEvents && this.callbacks) {
        var list = this.callbacks[type],
            event = this.createEvent(type, params),
            i = -1,
            handler;
        if (list) {
          while (!!(handler = list[++i])) {
            handler.fn.apply(handler.thisp || this, [event]);
          }
        }
      }
      return this;
    },
    /**
     * @method createEvent
     * Creates an event object
     *
     * @sig
     * @param {String} type  The type of event to create
     * @return {Object}  The event object
     *
     * @sig
     * @param {String} type  The type of event to create
     * @param {Object} params  Additional data points to add to the event
     * @return {Object}  The event object
     */
    createEvent: function(type, params) {
      return deepMixIn({}, params || {}, {
        type: type,
        target: params && params.target ? params.target : this,
        currentTarget: this
      });
    }
  });

  return EventDispatcher;

});
