/**
 * @private
 */
Ext.define('Ext.field.FileInput', {
    extend: 'Ext.field.Input',
    xtype: 'fileinput',

    config: {
        type: "file",
        accept: null,
        capture: null,
        name: null,
        multiple: false
    },

    /**
     * @property {Object} Lookup of capture devices to accept types
     * @private
     */
    captureLookup: {
        video: "camcorder",
        image: "camera",
        audio: "microphone"
    },

    // @private
    initialize: function() {
        var me = this;

        me.callParent();

        me.input.on({
            scope: me,
            change: 'onInputChange'
        });
    },

    /**
     * Returns the field data value.
     * @return {String} value The field value.
     */
    getValue: function() {
        var input = this.input;

        if (input) {
            this._value = input.dom.value;
        }

        return this._value;
    },

    /**
     * Sets the internal value. Security restrictions prevent setting file values on the input element
     * @cfg newValue {string} New Value
     * @returns {String}
     */
    setValue: function(newValue) {
        var oldValue = this._value;
        this._value = newValue;

        if (String(this._value) != String(oldValue) && this.initialized) {
            this.onChange(this, this._value, oldValue);
        }

        return this;
    },

    /**
     * Returns the field files.
     * @return {FileList} List of the files selected.
     */
    getFiles: function() {
        var input = this.input;

        if (input) {
            this.$files = input.dom.files;
        }

        return this.$files;
    },

    // @private
    onInputChange: function(e) {
        this.setValue(e.target.value);
    },

    /**
     * Called when the value changes on this input item
     * @cfg me {Ext.field.FileInput}
     * @cfg value {String} new Value
     * @cfg startValue {String} Original Value
     */
    onChange: function(me, value, startValue) {
        this.fireEvent('change', me, value, startValue);
    },

    /**
     * Called when the name being changed
     * @cfg value   new value
     * @returns {*}
     */
    applyName: function(value) {
        if(this.getMultiple() && value.substr(-2, 2) !== "[]") {
            value += "[]";
        }else if((!this.getMultiple()) && value.substr(-2, 2) === "[]") {
            value = value.substr(0, value.length-2)
        }

        return value;
    },

    /**
     * Applies the multiple attribute to the input
     * @cfg value {boolean}
     * @returns {boolean}
     */
    applyMultiple: function(value) {
        this.updateFieldAttribute('multiple', value ? '' : null);
        return value;
    },

    /**
     * Called when the multiple property is updated. The name will automatically be toggled to an array if needed.
     */
    updateMultiple: function() {
        var name = this.getName();
        if(!Ext.isEmpty(name)) {
            this.setName(name);
        }
    },

    /*
     * Updates the accept attribute with the {@link #accept} configuration.
     * 
     */
    applyAccept: function(value) {
        switch (value) {
            case "video":
            case "audio":
            case "image":
                value = value + "/*";
                break;
        }

        this.updateFieldAttribute('accept', value);
    },

    /**
     * Updated the capture attribute with the {@ink capture} configuration
     */
    applyCapture: function(value) {
        this.updateFieldAttribute('capture', value);
        return value;
    }
});
