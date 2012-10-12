/**
 * @aside guide forms
 *
 * Simple Select field wrapper. Example usage:
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'fieldset',
 *                 title: 'Select',
 *                 items: [
 *                     {
 *                         xtype: 'selectfield',
 *                         label: 'Choose one',
 *                         options: [
 *                             {text: 'First Option',  value: 'first'},
 *                             {text: 'Second Option', value: 'second'},
 *                             {text: 'Third Option',  value: 'third'}
 *                         ]
 *                     }
 *                 ]
 *             }
 *         ]
 *     });
 *
 */
Ext.define('Ext.field.Select', {
    extend: 'Ext.field.Text',
    xtype: 'selectfield',
    alternateClassName: 'Ext.form.Select',
    requires: [
        'Ext.Panel',
        'Ext.picker.Picker',
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.dataview.List'
    ],

    /**
     * @event change
     * Fires when an option selection has changed
     * @param {Ext.field.Select} this
     * @param {Mixed} newValue The new value
     * @param {Mixed} oldValue The old value
     */

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        ui: 'select',

        /**
         * @cfg {Boolean} useClearIcon
         * @hide
         */

        /**
         * @cfg {String/Number} valueField The underlying {@link Ext.data.Field#name data value name} (or numeric Array index) to bind to this
         * Select control. (defaults to 'value')
         * @accessor
         */
        valueField: 'value',

        /**
         * @cfg {String/Number} displayField The underlying {@link Ext.data.Field#name data value name} (or numeric Array index) to bind to this
         * Select control. This resolved value is the visibly rendered value of the available selection options.
         * (defaults to 'text')
         * @accessor
         */
        displayField: 'text',

        /**
         * @cfg {Ext.data.Store} store (Optional) store instance used to provide selection options data.
         * @accessor
         */
        store: null,

        /**
         * @cfg {Array} options (Optional) An array of select options.
    <pre><code>
        [
            {text: 'First Option',  value: 'first'},
            {text: 'Second Option', value: 'second'},
            {text: 'Third Option',  value: 'third'}
        ]
    </code></pre>
         * Note: option object member names should correspond with defined {@link #valueField valueField} and {@link #displayField displayField} values.
         * This config will be ignore if a {@link #store store} instance is provided
         * @accessor
         */
        options: null,

        /**
         * @cfg {String} hiddenName Specify a hiddenName if you're using the {@link Ext.form.Panel#standardSubmit standardSubmit} option.
         * This name will be used to post the underlying value of the select to the server.
         * @accessor
         */
        hiddenName: null,

        /**
         * @cfg {Object} component
         * @accessor
         * @hide
         */
        component: {
            useMask: true
        },

        /**
         * @cfg {Boolean} clearIcon
         * @hide
         * @accessor
         */
        clearIcon: false,

        /**
         * @cfg {String/Boolean} usePicker
         * `true` if you want this component to always use a {@link Ext.picker.Picker}.
         * `false` if you want it to use a popup overlay {@link Ext.List}.
         * `auto` if you want to show a {@link Ext.picker.Picker} only on phones.
         */
        usePicker: 'auto',

        /**
         * @cfg {Object} defaultPhonePickerConfig
         * The default configuration for the picker component when you are on a phone
         */
        defaultPhonePickerConfig: null,

        /**
         * @cfg {Object} defaultTabletPickerConfig
         * The default configuration for the picker component when you are on a tablet
         */
        defaultTabletPickerConfig: null,

        /**
         * @cfg
         * @inheritdoc
         */
        name: 'picker'
    },

    // @private
    initialize: function() {
        var me = this,
            component = me.getComponent();

        me.callParent();

        component.on({
            scope: me,
            masktap: 'onMaskTap'
        });

        component.input.dom.disabled = true;
    },

    /**
     * @private
     */
    updateDefaultPhonePickerConfig: function(newConfig) {
        var picker = this.picker;
        if (picker) {
            picker.setConfig(newConfig);
        }
    },

    /**
     * @private
     */
    updateDefaultTabletPickerConfig: function(newConfig) {
        var listPanel = this.listPanel;
        if (listPanel) {
            listPanel.setConfig(newConfig);
        }
    },

    /**
     * @private
     * Checks if the value is `auto`. If it is, it only uses the picker if the current device type
     * is a phone.
     */
    applyUsePicker: function(usePicker) {
        if (usePicker == "auto") {
            usePicker = (Ext.os.deviceType == 'Phone');
        }

        return Boolean(usePicker);
    },

    syncEmptyCls: Ext.emptyFn,

    /**
     * @private
     */
    applyValue: function(value) {
        var record = value,
            index, store;

        //we call this so that the options configruation gets intiailized, so that a store exists, and we can
        //find the correct value
        this.getOptions();

        store = this.getStore();

        if ((value && !value.isModel) && store) {
            index = store.find(this.getValueField(), value, null, null, null, true);

            if (index == -1) {
                index = store.find(this.getDisplayField(), value, null, null, null, true);
            }

            record = store.getAt(index);
        }

        return record;
    },

    updateValue: function(newValue, oldValue) {
        this.previousRecord = oldValue;
        this.record = newValue;

        this.callParent([(newValue && newValue.isModel) ? newValue.get(this.getDisplayField()) : '']);
    },

    getValue: function() {
        var record = this.record;
        return (record && record.isModel) ? record.get(this.getValueField()) : null;
    },

    /**
     * Returns the current selected {@link Ext.data.Model record} instance selected in this field.
     * @return {Ext.data.Model} the record.
     */
    getRecord: function() {
        return this.record;
    },

    // @private
    getPhonePicker: function() {
        var config = this.getDefaultPhonePickerConfig();

        if (!this.picker) {
            this.picker = Ext.create('Ext.picker.Picker', Ext.apply({
                slots: [{
                    align       : 'center',
                    name        : this.getName(),
                    valueField  : this.getValueField(),
                    displayField: this.getDisplayField(),
                    value       : this.getValue(),
                    store       : this.getStore()
                }],
                listeners: {
                    change: this.onPickerChange,
                    scope: this
                }
            }, config));
        }

        return this.picker;
    },

    // @private
    getTabletPicker: function() {
        var config = this.getDefaultTabletPickerConfig();

        if (!this.listPanel) {
            this.listPanel = Ext.create('Ext.Panel', Ext.apply({
                centered: true,
                modal: true,
                cls: Ext.baseCSSPrefix + 'select-overlay',
                layout: 'fit',
                hideOnMaskTap: true,
                items: {
                    xtype: 'list',
                    store: this.getStore(),
                    itemTpl: '<span class="x-list-label">{' + this.getDisplayField() + ':htmlEncode}</span>',
                    listeners: {
                        select : this.onListSelect,
                        itemtap: this.onListTap,
                        scope  : this
                    }
                }
            }, config));
        }

        return this.listPanel;
    },

    // @private
    onMaskTap: function() {
        if (this.getDisabled()) {
            return false;
        }

        this.showPicker();

        return false;
    },

    /**
     * Shows the picker for the select field, whether that is a {@link Ext.picker.Picker} or a simple
     * {@link Ext.List list}.
     */
    showPicker: function() {
        var store = this.getStore();
        //check if the store is empty, if it is, return
        if (!store || store.getCount() === 0) {
            return;
        }

        if (this.getReadOnly()) {
            return;
        }

        this.isFocused = true;

        //hide the keyboard
        //the causes https://sencha.jira.com/browse/TOUCH-1679
        // Ext.Viewport.hideKeyboard();

        if (this.getUsePicker()) {
            var picker = this.getPhonePicker(),
                name   = this.getName(),
                value  = {};

            value[name] = this.record.get(this.getValueField());
            picker.setValue(value);
            if (!picker.getParent()) {
                Ext.Viewport.add(picker);
            }
            picker.show();
        } else {
            var listPanel = this.getTabletPicker(),
                list = listPanel.down('list'),
                store = list.getStore(),
                index = store.find(this.getValueField(), this.getValue(), null, null, null, true),
                record = store.getAt((index == -1) ? 0 : index);

            if (!listPanel.getParent()) {
                Ext.Viewport.add(listPanel);
            }

            listPanel.showBy(this.getComponent());
            list.select(record, null, true);
        }
    },

    // @private
    onListSelect: function(item, record) {
        var me = this;
        if (record) {
            me.setValue(record);
        }
    },

    onListTap: function() {
        this.listPanel.hide({
            type : 'fade',
            out  : true,
            scope: this
        });
    },

    // @private
    onPickerChange: function(picker, value) {
        var me = this,
            newValue = value[me.getName()],
            store = me.getStore(),
            index = store.find(me.getValueField(), newValue, null, null, null, true),
            record = store.getAt(index);

        me.setValue(record);
    },

    onChange: function(component, newValue, oldValue) {
        var me = this,
            store = me.getStore(),
            index = (store) ? store.find(me.getDisplayField(), oldValue) : -1,
            valueField = me.getValueField(),
            record = (store) ? store.getAt(index) : null,
            oldValue = (record) ? record.get(valueField) : null;

        me.fireEvent('change', me, me.getValue(), oldValue);
    },

    /**
     * Updates the underlying &lt;options&gt; list with new values.
     * @param {Array} options An array of options configurations to insert or append.
<pre><code>
selectBox.setOptions(
    [   {text: 'First Option',  value: 'first'},
        {text: 'Second Option', value: 'second'},
        {text: 'Third Option',  value: 'third'}
    ]).setValue('third');
</code></pre>
     * Note: option object member names should correspond with defined {@link #valueField valueField} and
     * {@link #displayField displayField} values.
     * @return {Ext.field.Select} this
     */
    updateOptions: function(newOptions) {
        var store = this.getStore();

        if (!store) {
            this.setStore(true);
            store = this._store;
        }

        if (!newOptions) {
            store.clearData();
        }
        else {
            store.setData(newOptions);
            this.onStoreDataChanged(store);
        }
    },

    applyStore: function(store) {
        if (store === true) {
            store = Ext.create('Ext.data.Store', {
                fields: [this.getValueField(), this.getDisplayField()]
            });
        }

        if (store) {
            store = Ext.data.StoreManager.lookup(store);

            store.on({
                scope: this,
                addrecords: this.onStoreDataChanged,
                removerecords: this.onStoreDataChanged,
                updaterecord: this.onStoreDataChanged,
                refresh: this.onStoreDataChanged
            });
        }

        return store;
    },

    updateStore: function(newStore) {
        if (newStore) {
            this.onStoreDataChanged(newStore);
        }
    },

    /**
     * Called when the internal {@link #store}'s data has changed
     */
    onStoreDataChanged: function(store) {
        var initialConfig = this.getInitialConfig(),
            value = this.getValue();

        if (Ext.isDefined(value)) {
            this.updateValue(this.applyValue(value));
        }

        if (this.getValue() === null) {
            if (initialConfig.hasOwnProperty('value')) {
                this.setValue(initialConfig.value);
            }

            if (this.getValue() === null) {
                if (store.getCount() > 0) {
                    this.setValue(store.getAt(0));
                }
            }
        }
    },

    /**
     * @private
     */
    doSetDisabled: function(disabled) {
        Ext.Component.prototype.doSetDisabled.apply(this, arguments);
    },

    /**
     * @private
     */
    setDisabled: function() {
        Ext.Component.prototype.setDisabled.apply(this, arguments);
    },

    /**
     * Resets the Select field to the value of the first record in the store.
     * @return {Ext.field.Select} this
     */
    reset: function() {
        var store = this.getStore(),
            record = (this.originalValue) ? this.originalValue : store.getAt(0);

        if (store && record) {
            this.setValue(record);
        }

        return this;
    },

    onFocus: function(e) {
        this.fireEvent('focus', this, e);

        this.isFocused = true;

        this.showPicker();
    },

    destroy: function() {
        this.callParent(arguments);
        Ext.destroy(this.listPanel, this.picker, this.hiddenField);
    }
});
