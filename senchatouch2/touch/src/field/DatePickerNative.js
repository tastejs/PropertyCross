Ext.define('Ext.field.DatePickerNative', {
    extend: 'Ext.field.DatePicker',
    alternateClassName: 'Ext.form.DatePickerNative',
    xtype: 'datepickernativefield',

    initialize: function() {

        this.callParent();

    },

    onFocus: function(e) {
        var me = this;

        if (!(navigator.plugins && navigator.plugins.dateTimePicker)){

            me.callParent();
            return;
        }

        var success = function (res) {
            me.setValue(res);
        };

        var fail = function (e) {
            console.log("DateTimePicker: error occurred or cancelled: " + e);
        };

        try {

            var dateTimePickerFunc = me.getName() == 'date' ? navigator.plugins.dateTimePicker.selectDate :
                navigator.plugins.dateTimePicker.selectTime;

            dateTimePickerFunc(success, fail, { value: me.getValue()});

        } catch (ex) {
            fail(ex);
        }
    }
});
