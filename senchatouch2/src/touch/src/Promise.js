/**
 * @private
 */
Ext.define('Ext.Promise', {
    statics: {
        when: function() {
            var ret = new this,
                promises = Array.prototype.slice.call(arguments),
                index = -1,
                results = [],
                promise;

            function onRejected(e) {
                ret.reject(e);
            }

            function onFulfilled(result) {
                promise = promises.shift();

                if (index >= 0) {
                    results[index] = result;
                }

                index++;

                if (promise) {
                    promise.then(onFulfilled, onRejected);
                }
                else {
                    ret.fulfill.apply(ret, results);
                }
            }

            onFulfilled();

            return ret;
        },

        whenComplete: function(promises) {
            var ret = new this,
                index = -1,
                fulfilledResults = [],
                rejectedReasons = [],
                promise;

            function onRejected(reason) {
                promise = promises.shift();
                rejectedReasons.push(reason);
                next(promise);
            }

            function onFulfilled(result) {
                promise = promises.shift();
                fulfilledResults.push(result);
                next(promise);
            }

            function next(promise) {
                index++;

                if (promise) {
                    promise.then(onFulfilled, onRejected);
                }
                else {
                    ret.fulfill.call(ret, {
                        fulfilled: fulfilledResults,
                        rejected: rejectedReasons
                    });
                }
            }

            next(promises.shift());

            return ret;
        },

        from: function() {
            var promise = new this;
            promise.completed = 1;
            promise.lastResults = arguments;
            return promise;
        },

        fail: function(reason) {
            var promise = new this;
            promise.completed = -1;
            promise.lastReason = reason;
            return promise;
        }
    },

    completed: 0,

    getListeners: function(init) {
        var listeners = this.listeners;

        if (!listeners && init) {
            this.listeners = listeners = [];
        }

        return listeners;
    },

    then: function(scope, success, error) {
        if (typeof scope == 'function') {
            error = success;
            success = scope;
            scope = null;
        }

        if (typeof success == 'string') {
            success = scope[success];
        }

        if (typeof error == 'string') {
            error = scope[error];
        }

        return this.doThen(scope, success, error);
    },

    doThen: function(scope, success, error) {
        var Promise = Ext.Promise,
            completed = this.completed,
            promise, result;

        if (completed === -1) {
            if (error) {
                error.call(scope, this.lastReason);
            }
            return this;
        }

        if (completed === 1 && !this.isFulfilling) {
            if (!success) {
                return this;
            }

            result = success.apply(scope, this.lastResults);

            if (result instanceof Promise) {
                promise = result;
            }
            else {
                promise = Promise.from(result);
            }
        }
        else {
            promise = new Promise;
            promise.$owner = this;

            this.getListeners(true).push({
                scope: scope,
                success: success,
                error: error,
                promise: promise
            });
        }

        return promise;
    },

    error: function(scope, error) {
        if (typeof scope == 'function') {
            error = scope;
            scope = null;
        }

        if (typeof error == 'string') {
            error = scope[error];
        }

        return this.doThen(scope, null, error);
    },

    fulfill: function() {
        var results = arguments,
            listeners, listener, scope, success, promise, callbackResults;

        this.lastResults = results;
        this.completed = 1;

        while (listeners = this.getListeners()) {
            delete this.listeners;
            this.isFulfilling = true;

            while (listener = listeners.shift()) {
                success = listener.success;
                scope = listener.scope;
                promise = listener.promise;
                delete promise.$owner;

                if (success) {
                    callbackResults = success.apply(scope, results);

                    if (callbackResults instanceof Ext.Promise) {
                        callbackResults.connect(promise);
                    }
                    else {
                        promise.fulfill(callbackResults);
                    }
                }
                else {
                    promise.fulfill(results);
                }
            }

            this.isFulfilling = false;
        }

        return this;
    },

    connect: function(promise) {
        var me = this;

        me.then(promise, function(result) {
            this.fulfill(result);
            return result;
        }, 'reject');
    },

    reject: function(reason) {
        var listeners = this.getListeners(),
            listener, error, promise;

        this.lastReason = reason;
        this.completed = -1;

        if (listeners) {
            delete this.listeners;
            while (listener = listeners.shift()) {
                error = listener.error;
                promise = listener.promise;
                delete promise.$owner;

                if (error) {
                    error.call(listener.scope, reason);
                }

                promise.reject(reason);
            }
        }

        return this;
    },

    cancel: function() {
        var listeners = this.getListeners(),
            owner = this.$owner,
            i, ln, listener;

        if (listeners) {
            for (i = 0, ln = listeners.length; i < ln; i++) {
                listener = listeners[i];
                listener.promise.cancel();
            }
            listeners.length = 0;
            delete this.listeners;
        }

        if (owner) {
            delete this.$owner;
            owner.cancel();
        }
    }
});
