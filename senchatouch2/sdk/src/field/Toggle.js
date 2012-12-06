/**
 * @aside guide forms
 *
 * Specialized {@link Ext.field.Slider} with a single thumb which only supports two {@link #value values}.
 *
 * ## Examples
 *
 *     @example miniphone preview
 *     Ext.Viewport.add({
 *         xtype: 'togglefield',
 *         name: 'awesome',
 *         label: 'Are you awesome?',
 *         labelWidth: '40%'
 *     });
 *
 * Having a default value of 'toggled':
 *
 *     @example miniphone preview
 *     Ext.Viewport.add({
 *         xtype: 'togglefield',
 *         name: 'awesome',
 *         value: 1,
 *         label: 'Are you awesome?',
 *         labelWidth: '40%'
 *     });
 *
 * And using the {@link #value} {@link #toggle} method:
 *
 *     @example miniphone preview
 *     Ext.Viewport.add([
 *         {
 *             xtype: 'togglefield',
 *             name: 'awesome',
 *             value: 1,
 *             label: 'Are you awesome?',
 *             labelWidth: '40%'
 *         },
 *         {
 *             xtype: 'toolbar',
 *             docked: 'top',
 *             items: [
 *                 {
 *                     xtype: 'button',
 *                     text: 'Toggle',
 *                     flex: 1,
 *                     handler: function() {
 *                         Ext.ComponentQuery.query('togglefield')[0].toggle();
 *                     }
 *                 }
 *             ]
 *         }
 *     ]);
 */
Ext.define('Ext.field.Toggle', {
    extend: 'Ext.field.Slider',
    xtype : 'togglefield',
    alternateClassName: 'Ext.form.Toggle',
    requires: ['Ext.slider.Toggle'],

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        cls: 'x-toggle-field'
    },

    proxyConfig: {
        /**
         * @cfg {String} minValueCls See {@link Ext.slider.Toggle#minValueCls}
         * @accessor
         */
        minValueCls: 'x-toggle-off',

        /**
         * @cfg {String} maxValueCls  See {@link Ext.slider.Toggle#maxValueCls}
         * @accessor
         */
        maxValueCls: 'x-toggle-on'
    },

    // @private
    applyComponent: function(config) {
        return Ext.factory(config, Ext.slider.Toggle);
    },

    /**
     * Sets the value of the toggle.
     * @param {Number} value **1** for toggled, **0** for untoggled.
     */
    setValue: function(newValue) {
        if (newValue === true) {
            newValue = 1;
        }

        this.getComponent().setValue(newValue);

        return this;
    },

    getValue: function() {
        return (this.getComponent().getValue() == 1) ? 1 : 0;
    },

    /**
     * Toggles the value of this toggle field.
     * @return this
     */
    toggle: function() {
        this.getComponent().toggle();
        return this;
    }
});
