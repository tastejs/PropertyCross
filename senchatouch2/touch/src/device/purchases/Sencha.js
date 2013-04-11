/**
 * @private
 */
Ext.define('Ext.device.purchases.Sencha', {
    requires: [
        'Ext.data.Store'
    ],

    /**
     * Checks if the current user is able to make payments.
     * 
     * ## Example
     * 
     *     Ext.device.Purchases.canMakePayments({
     *         callback: function(flag) {
     *             console.log(flag ? 'Yup! :)' : 'Nope! :(');
     *         }
     *     });
     * 
     * @param {Object} config
     * @param {Function} config.callback
     * @param {Boolean} config.callback.flag whether current user is able to make payments.
     * @param {Object} config.scope
     */
    canMakePayments: function(config) {
        if (!config.callback) {
            Ext.Logger.error('You must specify a `callback` for `#canMakePayments` to work.');
            return false;
        }

        Ext.device.Communicator.send({
            command: 'Purchase#canMakePayments',
            callbacks: {
                callback: function(flag) {
                    config.callback.call(config.scope || this, flag);
                }
            },
            scope: config.scope || this
        });
    },

    /**
     * Returns a {@link Ext.data.Store} instance of all products available to purchase.
     * 
     * ## Example
     * 
     *     Ext.device.Purchases.getProducts({
     *         success: function(store) {
     *             console.log('Got the store! You have ' + store.getCount() + ' products.');
     *         },
     *         failure: function() {
     *             console.log('Oops. Looks like something went wrong.');
     *         }
     *     });
     * 
     * @param {Object} config
     * @param {Array[]} config.productInfos An array of all products productInfos
     * @param {Function} config.success
     * @param {Ext.data.Store} config.success.store A store of all products available to purchase.
     * @param {Function} config.failure
     * @param {Object} config.scope
     */
    getProducts: function(config) {
        if (!config.success) {
            Ext.Logger.error('You must specify a `success` callback for `#getProducts` to work.');
            return false;
        }

        if (!config.failure) {
            Ext.Logger.error('You must specify a `failure` callback for `#getProducts` to work.');
            return false;
        }

        Ext.device.Communicator.send({
            command: 'Purchase#getProducts',
            productInfos: JSON.stringify(config.productInfos),
            callbacks: {
                success: function(products) {
                    var store = Ext.create('Ext.data.Store', {
                        model: 'Ext.device.Purchases.Product',
                        data: products
                    });

                    config.success.call(config.scope || this, store);
                },
                failure: config.failure
            },
            scope: config.scope || this
        });
    },

    /**
     * Returns a {@link Ext.data.Store} instance of all purchases delivered to the current user.
     * 
     * @param {Object} config
     * @param {Function} config.callback
     * @param {Ext.data.Store} config.callback.store A store of all purchases delivered to the current user.
     * @param {Object} config.scope
     */
    getCompletedPurchases: function(config) {
        if (!config.callback) {
            Ext.Logger.error('You must specify a `callback` for `#getCompletedPurchases` to work.');
            return false;
        }

        Ext.device.Communicator.send({
            command: 'Purchase#getCompletedPurchases',
            callbacks: {
                callback: function(purchases) {
                    var ln = purchases.length,
                        i;

                    for (i = 0; i < ln; i++) {
                        purchases[i].state = 'completed';
                    }

                    var store = Ext.create('Ext.data.Store', {
                        model: 'Ext.device.Purchases.Purchase',
                        data: purchases
                    });

                    config.callback.call(config.scope || this, store);
                }
            },
            scope: config.scope || this
        });
    },

    /**
     * Returns a {@link Ext.data.Store} instance of all purchases the current user has been charged.
     * 
     * @param {Object} config
     * @param {Function} config.callback
     * @param {Ext.data.Store} config.callback.store  A store of all purchases the current user has been charged.
     * @param {Object} config.scope
     */
    getPurchases: function(config) {
        if (!config.callback) {
            Ext.Logger.error('You must specify a `callback` for `#getPurchases` to work.');
            return false;
        }

        Ext.device.Communicator.send({
            command: 'Purchase#getPurchases',
            callbacks: {
                callback: function(purchases) {
                    var ln = purchases.length,
                        i;

                    for (i = 0; i < ln; i++) {
                        purchases[i].state = 'charged';
                    }

                    var store = Ext.create('Ext.data.Store', {
                        model: 'Ext.device.Purchases.Purchase',
                        data: purchases
                    });

                    config.callback.call(config.scope || this, store);
                }
            },
            scope: config.scope || this
        });
    }
}, function() {
    /**
     * The product model class which is used when fetching available products using {@link Ext.device.Purchases#getProducts}.
     */
    Ext.define('Ext.device.Purchases.Product', {
        extend: 'Ext.data.Model',

        config: {
            fields: [
                'productIdentifier',
                'localizedTitle',
                'price',
                'localizedDescription'
            ]
        },

        /**
         * Will attempt to purchase this product.
         * 
         * ## Example
         * 
         *     product.purchase({
         *         success: function() {
         *             console.log(product.get('localizedTitle') + ' purchased!');
         *         },
         *         failure: function() {
         *             console.log('Something went wrong while trying to purchase ' + product.get('localizedTitle'));
         *         }
         *     });
         * 
         * @param {Object} config
         * @param {Ext.data.Model/String} config.product
         * @param {Function} config.success
         * @param {Function} config.failure
         */
        purchase: function(config) {
            if (!config.success) {
                Ext.Logger.error('You must specify a `success` callback for `#purchase` to work.');
                return false;
            }

            if (!config.failure) {
                Ext.Logger.error('You must specify a `failure` callback for `#purchase` to work.');
                return false;
            }

            Ext.device.Communicator.send({
                command: 'Purchase#purchase',
                identifier: this.get('productIdentifier'),
                callbacks: {
                    success: config.success,
                    failure: config.failure
                },
                scope: config.scope || this
            });
        }
    });

    /**
     *
     */
    Ext.define('Ext.device.Purchases.Purchase', {
        extend: 'Ext.data.Model',

        config: {
            fields: [
                'productIdentifier',
                'transactionIdentifier',
                'state'
            ]
        },

        /**
         * Attempts to mark this purchase as complete
         * @param {Object} config
         * @param {Function} config.success
         * @param {Function} config.failure
         * @param {Object} config.scope
         */
        complete: function(config) {
            var me = this;

            if (!config.success) {
                Ext.Logger.error('You must specify a `success` callback for `#complete` to work.');
                return false;
            }

            if (!config.failure) {
                Ext.Logger.error('You must specify a `failure` callback for `#complete` to work.');
                return false;
            }

            if (this.get('state') != 'charged') {
                config.failure.call(config.scope || this, 'purchase is not charged');
            }

            Ext.device.Communicator.send({
                command: 'Purchase#complete',
                identifier: me.get('transactionIdentifier'),
                callbacks: {
                    success: function() {
                        me.set('state', 'completed');
                        config.success.call(config.scope || this);
                    },
                    failure: function() {
                        me.set('state', 'charged');
                        config.failure.call(config.scope || this);
                    }
                },
                scope: config.scope || this
            });
        }
    });
});
