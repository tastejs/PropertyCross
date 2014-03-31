Ext.define('Ext.ux.parse.Proxy', {
    extend: 'Ext.data.proxy.Server',
    alias: 'proxy.parse',
    requires: ['Ext.data.Request', 'Ext.ux.parse.Reader', 'Ext.ux.parse.Helper'],

    config: {
        reader: "parse",
        loadAllPointers: false
    },

    checkParse: function() {
        if (window.Parse && window.Parse.applicationId) return true;

        if (window.Parse) {
            // <debug>
            Ext.Logger.warn('You must set your Parse ApplicationID prior to calling any Proxy Functions');
            // </debug>
        } else {
            // <debug>
            Ext.Logger.warn('Parse not found, please include parse in your app.json or via script tag');
            // </debug>
        }
        return false;
    },

    create: function(operation, callback, scope) {
        this.write(operation, callback, scope);
    },
    read: function(operation, callback, scope) {
        if (this.checkParse() === false) return;
        var me = this,
            model = operation.getModel(),
            parseClassName = model.getParseClass(),
            cb = me.createCallback(operation, callback, scope),
            filters = operation.getFilters(),
            limit = operation.getLimit(),
            sorters = operation.getSorters(),
            params = operation.getParams() || {},
            page = operation.getPage(),
            queryModifier = params.queryModifier,
            queryModifierScope = params.queryModifierScope,
            query = params.query || ParseHelper.getQuery(parseClassName);

        if (Ext.isFunction(query)) {
            query = query.call(params.queryScope || this);
        }

        // Pointers are a type of relational data in parse, this include all associations
        // that are hasMany or hasOne in the query
        // Many to Many relationships will not work through this method

        //Applying pointers will automatically apply field restrictions so only data used is returned
        me.applyPointers(query, model, params.loadAllPointers);

        if (params && params.query) {
            query.find({
                success: function(response) {
                    cb.apply(me, [true, response]);
                },
                error: function(response, error) {
                    cb.apply(me, false, response, error);
                }
            });
        } else if (params && params.id) {
            query.get(params.id, {
                success: function(response) {
                    cb.apply(me, [true, response]);
                },
                error: function(response, error) {
                    cb.apply(me, [false, response, error]);
                }
            });
        } else {
            me.applyFilters(query, filters);
            me.applyLimit(query, limit);
            me.applySorters(query, sorters);
            me.applyQueryModifier(query, queryModifier, queryModifierScope);

            if (limit && page) {
                me.applySkip(query, (page - 1) * limit);
            }

            var collection = query.collection();
            collection.fetch({
                success: function(response) {
                    cb.apply(me, [true, response]);
                },
                error: function(response, error) {
                    cb.apply(me, false, response, error);
                }
            });
        }
    },
    update: function(operation, callback, scope) {
        this.write(operation, callback, scope);
    },
    destroy: function(operation, callback, scope) {
        this.write(operation, callback, scope);
    },

    write: function(operation, callback, scope) {
        if (this.checkParse() === false) return;
        var queue = Ext.Array.clone(operation.getRecords()),
            me = this,
            models = [],
            action = operation.getAction(),
            fn = action === "destroy" ? Parse.Object.destroyAll : Parse.Object.saveAll,
            cb = me.createCallback(operation, callback, scope);

        Ext.Array.forEach(queue, function(item) {
            if (item.isParseModel) {
                models.push(item.getParseObject());
            }
        });

        fn(models, {
            success: function(response) {
                if (action == "destroy") {
                    cb.apply(me, [true, models]);
                } else {
                    cb.apply(me, [true, response]);
                }
            },
            error: function(error) {
                cb.apply(me, [false, [], error]);
            }
        });
    },

    batch: function(options) {
        var me = this,
            operations = options.operations,
            complete = options.listeners && options.listeners.complete ? options.listeners.complete : null,
            completeScope = options.listeners && options.listeners.scope ? options.listeners.scope : null,
            model = me.getModel(),
            createRecords = operations.create || [],
            updateRecords = operations.update || [],
            destroyRecords = operations.destroy || [],
            createOperation = new Ext.data.Operation({
                action: "create",
                records: createRecords,
                model: model
            }),
            updateOperation = new Ext.data.Operation({
                action: "update",
                records: updateRecords,
                model: model
            }),
            destroyOperation = new Ext.data.Operation({
                action: "destroy",
                records: destroyRecords,
                model: model
            }),
            queue = [createOperation, updateOperation, destroyOperation],
            batch = {operations:Ext.Array.clone(queue), hasException: false},
            operation, fn,
            processQueue = function() {
                operation = queue.shift();
                if (operation) {
                    if (operation.getRecords().length > 0) {
                        fn = me[operation.getAction()];
                        fn.call(me, operation, function(operation) {
                            if (operation.hasException()) {
                                batch.hasException = true
                            }
                            processQueue();
                        }, me);
                    } else {
                        processQueue();
                    }
                } else {
                    if(complete) {
                        complete.apply(completeScope, [batch]);
                    }
                    me.onBatchComplete.apply(me, [options, batch]);
                }
            };

        processQueue();
    },

    createCallback: function(operation, callback, scope) {
        var me = this;
        return function(success, response, error) {
            if (!success) response = error;
            me.processResponse(success, operation, {}, response, callback, scope);
        };
    },

    applyFields: function(query, model) {
        var name = model.getParseClass(),
            fields = model.getFields(),
            include;

        fields.each(function(field) {
            include = name + "." + field.getName();
            query.include(include);
        });
    },

    applyPointers: function(query, model, force) {
        var me = this,
            included = [model.getParseClass()],
            processedModels = [],
            associations, aModel, aName, aType, aInclude,
            loadPointers = (force === true || this.getLoadAllPointers() === true);

        function applyRecursivePointers(model) {
            if (processedModels.indexOf(model) >= 0) return;
            processedModels.push(model);
            me.applyFields(query, model);

            associations = model.getAssociations();
            associations.each(function(association) {
                aModel = association.getAssociatedModel();
                aName = association.getName();
                aType = association.getType();
                aInclude = aType === "pointer" ? association.getInclude() : false;
                if ((aInclude || loadPointers) && (aType === "pointer" && included.indexOf(aName) === -1)) {
                    query.include(aName);
                    included.push(aName);
                }
                applyRecursivePointers(aModel);
            })
        }

        applyRecursivePointers(model);
    },

    applyFilters: function(query, filters) {
        if (filters) {
            var property, value, anyMatch, caseSensitive;
            Ext.Array.forEach(filters, function(item) {
                property = item.getProperty();
                value = item.getValue();
                anyMatch = item.getAnyMatch();
                caseSensitive = item.getCaseSensitive();

                if (Ext.isString(value) && caseSensitive && anyMatch) {
                    if (anyMatch) {
                        query.contains(property, value);
                    } else {
                        query.equalTo(property, value);
                    }
                } else if (Ext.isString(value)) {
                    value = new RegExp((!anyMatch ? "^" : "") + value);
                }

                if (value instanceof RegExp) {
                    console.log("RegExp");
                    query.matches(property, value, !caseSensitive ? "i" : "");
                }
            });
        }
    },

    applyLimit: function(query, limit) {
        query.limit(limit);
    },

    applySkip: function(query, skip) {
        query.skip(skip);
    },

    applyQueryModifier: function(query, modifier, scope) {
        if (modifier && Ext.isFunction(modifier)) {
            modifier.call(scope || this, query);
        }
    },

    applySorters: function(query, sorters) {
        if (sorters) {
            var property, direction;
            Ext.Array.forEach(filters, function(item) {
                property = item.getProperty();
                direction = item.getDirection();
                if (direction === "DESC") {
                    query.descending(property);
                } else {
                    query.ascending(property);
                }
            });
        }
    },

    setException: function(operation, response) {
        if (Ext.isObject(response)) {
            operation.setException({
                status: response.code,
                statusText: response.message
            });
        }
    }
});