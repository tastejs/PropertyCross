define(function(require) {

  var extend = require('./extend');

  /**
   * @class Lavaca.util.Promise
   * Utility type for asynchronous programming
   *
   * @constructor
   *
   * @param {Object} thisp  What the "this" keyword resolves to in callbacks
   */
  var Promise = extend(function(thisp) {
    /**
     * @field {Object} thisp
     * @default null
     * What the "this" keyword resolves to in callbacks
     */
    this.thisp = thisp;
    /**
     * @field {Array} resolvedQueue
     * @default []
     * Pending handlers for the success event
     */
    this.resolvedQueue = [];
    /**
     * @field {Array} rejectedQueue
     * @default []
     * Pending handlers for the error event
     */
    this.rejectedQueue = [];
  }, {
    /**
     * @field {Boolean} succeeded
     * @default false
     * Flag indicating that the promise completed successfully
     */
    succeeded: false,
    /**
     * @field {Boolean} failed
     * @default false
     * Flag indicating that the promise failed to complete
     */
    failed: false,
    /**
     * @method success
     * Queues a callback to be executed when the promise succeeds
     *
     * @param {Function} callback  The callback to execute
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    success: function(callback) {
      if (callback) {
        if (this.succeeded) {
          callback.apply(this.thisp, this.resolveArgs);
        } else {
          this.resolvedQueue.push(callback);
        }
      }
      return this;
    },
    /**
     * @method error
     * Queues a callback to be executed when the promise fails
     *
     * @param {Function} callback  The callback to execute
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    error: function(callback) {
      if (callback) {
        if (this.failed) {
          callback.apply(this.thisp, this.rejectArgs);
        } else {
          this.rejectedQueue.push(callback);
        }
      }
      return this;
    },
    /**
     * @method always
     * Queues a callback to be executed when the promise is either rejected or resolved
     *
     * @param {Function} callback  The callback to execute
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    always: function(callback) {
      return this.then(callback, callback);
    },
    /**
     * @method then
     * Queues up callbacks after the promise is completed
     *
     * @param {Function} resolved  A callback to execute when the operation succeeds
     * @param {Function} rejected  A callback to execute when the operation fails
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    then: function(resolved, rejected) {
      return this
        .success(resolved)
        .error(rejected);
    },
    /**
     * @method resolve
     * Resolves the promise successfully
     *
     * @params {Object} value  Values to pass to the queued success callbacks
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    resolve: function(/* value1, value2, valueN */) {
      if (!this.succeeded && !this.failed) {
        this.succeeded = true;
        this.resolveArgs = [].slice.call(arguments, 0);
        var i = -1,
            callback;
        while (!!(callback = this.resolvedQueue[++i])) {
          callback.apply(this.thisp, this.resolveArgs);
        }
      }
      return this;
    },
    /**
     * @method reject
     * Resolves the promise as a failure
     *
     * @params {String} err  Failure messages
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    reject: function(/* err1, err2, errN */) {
      if (!this.succeeded && !this.failed) {
        this.failed = true;
        this.rejectArgs = [].slice.call(arguments, 0);
        var i = -1,
            callback;
        while (!!(callback = this.rejectedQueue[++i])) {
          callback.apply(this.thisp, this.rejectArgs);
        }
      }
      return this;
    },
    /**
     * @method when
     * Queues this promise to be resolved only after several other promises
     *   have been successfully resolved, or immediately rejected when one
     *   of those promises is rejected
     *
     * @params {Lavaca.util.Promise}  promise  One or more other promises
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    when: function(/* promise1, promise2, promiseN */) {
      var self = this,
          values = [],
          i = -1,
          pendingPromiseCount = arguments.length,
          promise;
      while (!!(promise = arguments[++i])) {
        (function(index) {
          promise
            .success(function(v) {
              values[index] = v;
              if (--pendingPromiseCount < 1) {
                self.resolve.apply(self, values);
              }
            })
            .error(function() {
              self.reject.apply(self, arguments);
            });
        })(i);
      }
      promise = null;
      return this;
    },
    /**
     * @method resolver
     * Produces a callback that resolves the promise with any number of arguments
     *
     * @return {Function}  The callback
     */
    resolver: function() {
      var self = this;
      return function() {
        self.resolve.apply(self, arguments);
      };
    },
    /**
     * @method rejector
     * Produces a callback that rejects the promise with any number of arguments
     *
     * @return {Function}  The callback
     */
    rejector: function() {
      var self = this;
      return function() {
        self.reject.apply(self, arguments);
      };
    }
  });
  /**
   * @method when
   * @static
   * Creates a promise to be resolved only after several other promises
   *   have been successfully resolved, or immediately rejected when one
   *   of those promises is rejected
   *
   * @sig
   * @params {Lavaca.util.Promise}  promise  One or more other promises
   * @return {Lavaca.util.Promise}  The new promise
   *
   * @sig
   * @param {Object} thisp  The execution context of the promise
   * @params {Lavaca.util.Promise}  promise  One or more other promises
   * @return {Lavaca.util.Promise}  The new promise
   */
  Promise.when = function(thisp/*, promise1, promise2, promiseN */) {
    var thispIsPromise = thisp instanceof Promise,
        promise = new Promise(thispIsPromise ? window : thisp),
        args = [].slice.call(arguments, thispIsPromise ? 0 : 1);
    return promise.when.apply(promise, args);
  };

  return Promise;

});
