Ext.define('Ext.ux.parse.association.Relation', {
    extend: 'Ext.data.association.Association',
    alias: 'association.relation',

    config: {
        /**
         * @cfg {Object} store
         * Optional configuration object that will be passed to the generated Store. Defaults to an empty Object.
         */
        store: undefined,

        /**
         * @cfg {String} storeName
         * Optional The name of the store by which you can reference it on this class as a property.
         */
        storeName: undefined,

        /**
         * @cfg {Boolean} autoLoad
         * `true` to automatically load the related store from a remote source when instantiated.
         */
        autoLoad: false,

        /**
         * @cfg {Boolean} autoSync
         * true to automatically synchronize the related store with the remote source
         */
        autoSync: false
    },

    getStore:function(model) {
        if(model[this.getName()]){
            return model[this.getName()]();
        }
        return null;
    },

    getData: function(model){
        var items = [],
            store = this.getStore(model);
        if(store){
            var collection = store.getData(), data;
            collection.each(function(model){
                data = model.isParseModel ? model.getDataFlat() : model.getData();
                items.push(data);
            });
        }
        return items;
    },

    getStatus: function(model){
        var store = this.getStore(model);
        if(store){
            if (store.isLoaded()){
                return "loaded"
            } else if (store.isLoading()){
                return "loading"
            }
        }
        return "unloaded";
    },

    applyAssociationKey: function(associationKey) {
        if (!associationKey) {
            var associatedName = this.getName();
            associationKey = associatedName.toLowerCase();
        }
        return associationKey;
    },

    applyName: function(name) {
        if (!name) {
            name = Ext.util.Inflector.pluralize(this.getAssociatedName().toLowerCase());
        }
        return name;
    },

    applyStoreName: function(name) {
        if (!name) {
            name = this.getName() + 'Store';
        }
        return name;
    },

    /**
     * @private
     * @deprecated as of v2.0.0 on an association. Instead use the store configuration.
     *
     * Creates a function that returns an Ext.data.Store which is configured to load a set of data filtered
     * by the owner model's primary key - e.g. in a `hasMany` association where Group `hasMany` Users, this function
     * returns a Store configured to return the filtered set of a single Group's Users.
     * @return {Function} The store-generating function.
     */
    applyStore: function(storeConfig) {
        var me = this,
            associatedModel = me.getAssociatedModel(),
            storeName       = me.getStoreName(),
            autoLoad        = me.getAutoLoad(),
            autoSync        = me.getAutoSync();

        return function() {
            var record = this,
                config, store,
                listeners = {
                    addrecords: me.onAddRecords,
                    removerecords: me.onRemoveRecords,
                    write: me.onStoreWrite,
                    scope: me
                };

            if (record[storeName] === undefined) {

                config = Ext.apply({}, storeConfig, {
                    model        : associatedModel,
                    params       : {
                        query: function() {
                            return record.$parseObject.relation(me.getName()).query();
                        }
                    },
                    autoSync     : autoSync,
                    listeners    : listeners
                });

                store = record[storeName] = Ext.create('Ext.data.Store', config);
                store.boundTo = record;

                if (autoLoad) {
                    record[storeName].load();
                }
            }

            return record[storeName];
        };
    },

    updateStore: function(store) {
        this.getOwnerModel().prototype[this.getName()] = store;
    },

    /**
     * Read associated data
     * @private
     * @param {Ext.data.Model} record The record we're writing to.
     * @param {Ext.data.reader.Reader} reader The reader for the associated model.
     * @param {Object} associationData The raw associated data.
     */
    read: function(record, reader, associationData) {
        var store = record[this.getName()](),
            records = reader.read(associationData).getRecords();

        store.add(records);
    },

    onAddRecords: function(store, records) {
        this.syncRelation(store, 'create', records);
    },

    onRemoveRecords: function(store, records) {
        this.syncRelation(store, 'destroy', records);
    },

    onStoreWrite: function(store, operation){
        this.syncRelation(store, operation.getAction(), operation.getRecords());
    },

    syncRelation: function(store, type, records) {
        if(type != "create" && type != "destroy") return;

        var model = store.boundTo,
            parse = model.getParseObject(),
            relationFn = type == "destroy" ? "remove" : "add",
            dirty = false,
            ln = records.length, i, record, relatedParse,
            relation = parse.relation(this.getName());

        for (i = 0; i < ln; i++) {
            record = records[i];
            if(record.isParseModel) {
                relatedParse = record.getParseObject();
                if(!relatedParse.isNew()) {
                    relation[relationFn].call(relation, relatedParse);
                    dirty = true;
                } else if(type === "create") {
                    // <debug>
                    Ext.Logger.warn('You cannot make relationships to Models that do not exist on parse. Save this model Prior to adding, record will be removed');
                    // </debug>
                    store.remove(record);
                }
            }
        }

        if(!model.dirty && dirty) model.setDirty(dirty);
    }
});