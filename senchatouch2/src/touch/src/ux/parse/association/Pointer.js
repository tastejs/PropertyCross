Ext.define('Ext.ux.parse.association.Pointer', {
    extend: 'Ext.data.association.Association',
    alias: 'association.pointer',

    config: {
        include: false
    },

    applyAssociationKey: function(associationKey) {
        if (!associationKey) {
            var associatedName = this.getAssociatedName();
            associationKey = associatedName.toLowerCase();
        }
        return associationKey;
    },

    getData: function(model){
        var pointerModel = model.get(this.getName());
        if(pointerModel && pointerModel.isModel){
            return pointerModel.data;
        }

        return null;
    },

    read: function(record, reader, associationData) {
        var newRecord = reader.read([associationData]).getRecords()[0];

        newRecord.boundTo = record;
        newRecord.on("dirty", this.onDirty);

        record.on("fieldupdate", this.onFieldUpdate, this);
        record.set(this.getName(), newRecord);
    },

    onFieldUpdate: function(model, newValue, fieldName){
        if(fieldName == this.getName()){
            model.un("dirty", this.onDirty);
            newValue.boundTo = model;
            model.setDirty();
        }
    },

    onDirty: function(model){
        if(model.boundTo) {
            var record = model.boundTo;
            record.setDirty();
        }
    }
});