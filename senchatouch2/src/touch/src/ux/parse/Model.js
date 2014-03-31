Ext.define('Ext.ux.parse.Model', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.ux.parse.Helper',
        'Ext.ux.parse.Proxy',
        'Ext.Promise',
        'Ext.ux.parse.association.Pointer',
        'Ext.ux.parse.association.Relation'
    ],

    config: {
        proxy: "parse"
    },

    inheritableStatics: {
        getParseClass: function() {
            if (!this.$parseClass) {
                this.$parseClass = this.getName().split(".").pop();
            }
            return this.$parseClass;
        }
    },

    isParseModel: true,

    $parseObject: null,
    getParseObject: function() {
        return this.$parseObject;
    },
    setParseObject: function(value) {
        this.$parseObject = value;
    },

    $parseClass: null,
    getParseClass: function() {
        if (!this.$parseClass) {
            var modelClass = Ext.ModelManager.getModel(this.$className);
            this.$parseClass = modelClass.getParseClass();
        }

        return this.$parseClass;
    },

    constructor: function(data, id, raw, convertedData) {
        if (data instanceof Parse.Object) {
            this.setParseObject(data);
            id = id || data.id || null;
            data = data.attributes;
        } else {
            var _data = raw || data || {};
            id = _data.id || id || null;
            this.setParseObject(ParseHelper.getObject(this.getParseClass(), _data));
        }

        return this.callParent([data, id, raw, convertedData]);
    },

    monitorRelations: function(config) {
        config = config || {};
        var me = this,
            promise = new Ext.Promise,
            callback = config.callback || Ext.emptyFn,
            scope = config.scope || this;

        (function run() {
            var status = me.getRelationsStatus();
            if(status.loading){
                var association = status.loading.shift(),
                    store = association.getStore(me);

                store.on("load", run, me, {single:true})
            } else {
                promise.fulfill();
                callback.apply(scope);
            }
        })();

        return promise;
    },

    getRelationsStatus: function() {
        var me = this,
            status = {relations: {}},
            associations = this.getAssociations(),
            relationStatus, relationStore;

        associations.each(function(association) {
            if (association.getType() === "relation" && association.getStatus) {
                relationStatus = association.getStatus(me);
                relationStore = association.getStore(me);

                if(!Ext.isArray(status[relationStatus])){
                    status[relationStatus] = []
                }
                status[relationStatus].push(association);
                status.relations[association.getName()] = {store:relationStore, status: relationStatus};
            }
        });

        return status;
    },

    relationsLoaded: function() {
        var associations = this.getAssociations(),
            loaded = true,
            relationStatus;

        associations.each(function(association) {
            if (association.getType() === "relation" && association.getStatus) {
                relationStatus = association.getStatus(this);
                loaded = status === "loading" || status === "unloaded";
            }
        });

        return loaded;
    },

    getDataFlat: function() {
        var me = this,
            data = Ext.merge({}, this.data),
            associations = this.getAssociations();

        associations.each(function(association) {
            if (association.getData) {
                data[association.getName()] = association.getData(me);
            }
        });

        return data;
    },

    load: function(options) {
        options = options || {};
        var me = this,
            id = me.get("id") || options.id || null;

        if (id && id.indexOf("ext-record") === -1) {
            var modelClass = Ext.ModelManager.getModel(me.$className);
            modelClass.load(id, {
                success: function(record, operation) {
                    me.syncParse(me.getFields().all);
                    if (options.success) options.success.apply(options.scope || me, [me, operation]);
                },
                failure: function(record, operation) {
                    if (options.failure) options.failure.apply(options.scope || me, [me, operation]);
                }
            });
        } else {
            // <debug>
            Ext.Logger.warn('You cannot load Parse models without a Parse ID');
            // </debug>
        }
    },

    syncParse: function(fields) {
        var me = this, value;

        Ext.Array.forEach(fields, function(field) {
            if (field.isField) {
                value = me.get(field.getName());
                field = field.getName();
            } else {
                value = me.get(field);
            }

            if (value && value.isParseModel) {
                value = value.getParseObject();
            }

            me.$parseObject.set(field, value);
        });
    },

    afterEdit: function(modifiedFieldNames, modified) {
        this.callParent(arguments);
        this.syncParse(modifiedFieldNames);
    },

    /**
     * Sets the given field to the given value, marks the instance as dirty.
     * @param {String/Object} fieldName The field to set, or an object containing key/value pairs.
     * @param {Object} value The value to set.
     */
    set: function(fieldName, value) {
        var me = this,
        // We are using the fields map since it saves lots of function calls
            fieldMap = me.fields.map,
            modified = me.modified,
            notEditing = !me.editing,
            modifiedCount = 0,
            modifiedFieldNames = [],
            field, key, i, ln, currentValue, convert;

        /*
         * If we're passed an object, iterate over that object. NOTE: we pull out fields with a convert function and
         * set those last so that all other possible data is set before the convert function is called
         */
        if (arguments.length == 1) {
            for (key in fieldName) {
                if (fieldName.hasOwnProperty(key)) {
                    //here we check for the custom convert function. Note that if a field doesn't have a convert function,
                    //we default it to its type's convert function, so we have to check that here. This feels rather dirty.
                    field = fieldMap[key];
                    if (field && field.hasCustomConvert()) {
                        modifiedFieldNames.push(key);
                        continue;
                    }

                    if (!modifiedCount && notEditing) {
                        me.beginEdit();
                    }
                    ++modifiedCount;

                    if (!field) field = this.get(key);
                    if (field && field.isModel) {
                        field.set(fieldName[key]);
                    } else {
                        me.set(key, fieldName[key]);
                    }
                }
            }

            ln = modifiedFieldNames.length;
            if (ln) {
                if (!modifiedCount && notEditing) {
                    me.beginEdit();
                }
                modifiedCount += ln;
                for (i = 0; i < ln; i++) {
                    field = modifiedFieldNames[i];
                    me.set(field, fieldName[field]);
                }
                me.dirty = true;
            }

            if (notEditing && modifiedCount) {
                me.endEdit(false, modifiedFieldNames);
            }
        } else if (modified) {
            field = fieldMap[fieldName];
            convert = field && field.getConvert();
            if (convert) {
                value = convert.call(field, value, me);
            }

            currentValue = me.data[fieldName];
            if (currentValue && currentValue != value) {
                me.fireEvent("fieldupdate", this, value, fieldName);
            }
            me.data[fieldName] = value;

            if (field && !me.isEqual(currentValue, value)) {
                if (modified.hasOwnProperty(fieldName)) {
                    if (me.isEqual(modified[fieldName], value)) {
                        // the original value in me.modified equals the new value, so the
                        // field is no longer modified
                        delete modified[fieldName];
                        // we might have removed the last modified field, so check to see if
                        // there are any modified fields remaining and correct me.dirty:
                        me.dirty = false;
                        for (key in modified) {
                            if (modified.hasOwnProperty(key)) {
                                me.dirty = true;
                                break;
                            }
                        }
                    }
                } else {
                    me.dirty = true;
                    // We only go one level back?
                    modified[fieldName] = currentValue;
                }
            }

            if (notEditing) {
                me.afterEdit([fieldName], modified);
            }
        }

        if (this.dirty) this.fireEvent("dirty", this);
    }
});