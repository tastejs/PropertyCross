/**
 * Example for a sender:
 *
 *      Ext.require('Ext.device.Tunnel', function(Tunnel) {
 *          var broadcast = Tunnel.broadcast('time'),
 *              connectToFirstReceiver = broadcast.then(function(receivers){
 *                  return Tunnel.connect(receivers[0].id);
 *              }),
 *              send = connectToFirstReceiver.then(function(connection) {
 *                  // 'true' as second argument to bring the receiver app to the foreground
 *                  // otherwise, it will simply run in the background
 *                  return connection.send('You are summoned!', true);
 *              });
 *
 *          send.then(function(reply){
 *              console.log(reply);
 *          });
 *      });
 *
 * Example for a receiver:
 *
 *      Ext.require('Ext.device.Tunnel', function(Tunnel) {
 *          Tunnel.onConnect(function(appId) {
 *              console.log('Got connection from ' + appId);
 *
 *              // Accept all
 *              return true;
 *          });
 *
 *          Tunnel.onMessage(function(appId, message) {
 *              console.log('Got message from ' + appId + ' ' + message);
 *
 *              return 'Yeah I got it';
 *          });
 *      });
 *
 * For aync message handling:
 *
 *       Tunnel.onMessage(function(appId, message) {
 *          var promise = new Ext.Promise();
 *
 *          console.log('Got message from ' + appId + ' ' + message);
 *
 *          // Do whatever needed asynchronously before return the result (fulfilling the promise)
 *          setTimeout(function(){
 *             promise.fulfill('Yeah I got it');
 *          }, 3000);
 *
 *          return promise;
 *      });
 */
Ext.define('Ext.device.tunnel.Abstract', {
    requires: ['Ext.Promise'],

    messageId: 0,

    constructor: function() {
        this.pendingReceivePromises = {};
        this.connections = {};
        this.connectQueue = [];
        this.messageQueue = [];
    },

    /**
     * Broadcast a message (intent) to look for receivers who can respond to it
     * @param {String} message
     *
     * @returns {Ext.Promise} A promise which provides an array of objects upon fulfilled. Each object contains information about
     * a receiver, with 'id', 'name' and 'icon' keys.
     */
    broadcast: function(message) {
        return Ext.Promise.from([]);
    },

    /**
     * Create a connection to another application with the given id
     * @param {String} receiverId The id of the application to connect to. Get this id from #broadcast
     * @returns {Ext.Promise}
     */
    connect: function(receiverId) {
        var connections = this.connections,
            connection = connections[receiverId];

        if (connection) {
            return Ext.Promise.from(connection);
        }
        else {
            return this.send(receiverId, '__CONNECT__').then(function() {
                connections[receiverId] = connection = new Ext.device.tunnel.Connection(receiverId);
                return connection;
            });
        }
    },

    /**
     * Send a message
     * @param {String} receiverId The id of the application to connect to. Get this id from #broadcast
     * @param {*} message The message to send, can be an object, as long as it is JSON-able.
     * @param {Boolean} [foreground] Whether or not to bring the receiver app to the foreground
     * @returns {Ext.Promise}
     */
    send: function(receiverId, message, foreground) {
        var messageId = this.messageId++,
            receivePromise = new Ext.Promise(),
            sendPromise = this.doSend(receiverId, messageId, message, foreground),
            pendingReceivePromises = this.pendingReceivePromises;

        pendingReceivePromises[messageId] = receivePromise;

        sendPromise.error(function(reason) {
            delete pendingReceivePromises[messageId];
            receivePromise.reject(reason);
        });

        return receivePromise;
    },

    /**
     * Assign the callback to handle new connection. The boolean returned value dertermine whether or not to accept
     * the connection
     * @param {Function} callback
     */
    onConnect: function(callback) {
        var queue = this.connectQueue.slice(0),
            i, ln, args;

        this.connectQueue.length = 0;

        if (callback) {
            this.connectCallback = callback;

            for (i = 0, ln = queue.length; i < ln; i++) {
                args = queue[i];
                this.onReceived.apply(this, args);
            }
        }
    },

    /**
     * Assign the callback to handling incoming messages. The returned value will be passed back to the sender.
     * If the operation needs to be async, simply return an instance of Ext.Promise
     * @param {Function} callback
     */
    onMessage: function(callback) {
        var queue = this.messageQueue.slice(0),
            i, ln, args;

        this.messageQueue.length = 0;

        if (callback) {
            this.messageCallback = callback;

            for (i = 0, ln = queue.length; i < ln; i++) {
                args = queue[i];
                this.onReceived.apply(this, args);
            }
        }
    },

    /**
     * @private
     */
    onAppConnect: function() {
        return this.connectCallback.apply(this, arguments);
    },

    /**
     * @private
     */
    onAppMessage: function(appId, message) {
        var connection = this.connections[appId],
            response;

        if (connection) {
            response = connection.receive(message);
        }

        if (typeof response == 'undefined') {
            response = this.messageCallback.apply(this, arguments);
        }

        return response;
    },

    /**
     * @private
     */
    onReceived: function(data) {
        var appId = data.appId,
            message = data.message,
            messageId = data.id,
            foreground = data.foreground,
            pendingReceivePromises = this.pendingReceivePromises,
            pendingPromise = pendingReceivePromises[messageId],
            connectCallback = this.connectCallback,
            messageCallback = this.messageCallback,
            response;

        delete pendingReceivePromises[messageId];

        // A response
        if (pendingPromise) {
            if (message.error) {
                pendingPromise.reject(message.error);
            }
            else {
                pendingPromise.fulfill(message.success);
            }
        }
        // A request
        else {
            try {
                if (message === '__CONNECT__') {
                    if (!connectCallback) {
                        this.connectQueue.push(arguments);
                        return;
                    }
                    else {
                        response = this.onAppConnect(appId);
                    }
                }
                else {
                    if (!messageCallback) {
                        this.messageQueue.push(arguments);
                        return;
                    }
                    else {
                        response = this.onAppMessage(appId, message);
                    }
                }

                if (response instanceof Ext.Promise) {
                    response.then(this, function(result) {
                        this.doSend(appId, messageId, {
                            success: result
                        }, foreground);
                    }, function(reason) {
                        this.doSend(appId, messageId, {
                            error: reason
                        }, foreground);
                    });
                }
                else {
                    this.doSend(appId, messageId, {
                        success: response
                    }, foreground);
                }
            }
            catch (e) {
                this.doSend(appId, messageId, {
                    error: e
                }, foreground);
            }
        }

    },

    /**
     * @private
     */
    doSend: Ext.emptyFn
});
