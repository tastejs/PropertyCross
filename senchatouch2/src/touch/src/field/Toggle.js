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
        cls: 'x-toggle-field',

        /* @cfg {String} labelAlign The position to render the label relative to the field input.
         * Available options are: 'top', 'left', 'bottom' and 'right'
         * @accessor
         */
        labelAlign: 'left',

        /**
         * @cfg {String} activeLabel The label to add to the toggle field when it is toggled on.
         * Only available in the Blackberry theme.
         * @accessor
         */
        activeLabel: null,

        /**
         * @cfg {String} inactiveLabel The label to add to the toggle field when it is toggled off.
         * Only available in the Blackberry theme.
         * @accessor
         */
        inactiveLabel: null
    },

    platformConfig: [{
        theme: ['Windows'],
        labelAlign: 'left'
    }, {
        theme: ['Blackberry', 'MountainView'],
        activeLabel: 'On',
        inactiveLabel: 'Off'
    }],

    /**
     * @event change
     * Fires when an option selection has changed.
     *
     *     Ext.Viewport.add({
     *         xtype: 'togglefield',
     *         label: 'Event Example',
     *         listeners: {
     *             change: function(field, newValue, oldValue) {
     *                 console.log('Value of this toggle has changed:', (newValue) ? 'ON' : 'OFF');
     *             }
     *         }
     *     });
     *
     * @param {Ext.field.Toggle} this
     * @param {Number} newValue the new value of this thumb
     * @param {Number} oldValue the old value of this thumb
     */

    /**
    * @event dragstart
    * @hide
    */

    /**
    * @event drag
    * @hide
    */

    /**
    * @event dragend
    * @hide
    */

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

    // @private
    updateActiveLabel: function(newActiveLabel, oldActiveLabel) {
        if (newActiveLabel != oldActiveLabel) {
            this.getComponent().element.dom.setAttribute('data-activelabel', newActiveLabel);
        }
    },

    // @private
    updateInactiveLabel: function(newInactiveLabel, oldInactiveLabel) {
        if (newInactiveLabel != oldInactiveLabel) {
            this.getComponent().element.dom.setAttribute('data-inactivelabel', newInactiveLabel);
        }
    },

    /**
     * Sets the value of the toggle.
     * @param {Number} newValue **1** for toggled, **0** for untoggled.
     * @return {Object} this
     */
    setValue: function(newValue) {
        if (newValue === true) {
            newValue = 1;
        }

        var oldValue = this.getValue();
        if (oldValue != newValue) {
            this.getComponent().setValue(newValue);

            this.fireEvent('change', this, newValue, oldValue);
        }

        return this;
    },

    getValue: function() {
        return (this.getComponent().getValue() == 1) ? 1 : 0;
    },

    onSliderChange: function(component, thumb, newValue, oldValue) {
        this.fireEvent.call(this, 'change', this, newValue, oldValue);
    },

    /**
     * Toggles the value of this toggle field.
     * @return {Object} this
     */
    toggle: function() {
        // We call setValue directly so the change event can be fired
        var value = this.getValue();
        this.setValue((value == 1) ? 0 : 1);

        return this;
    },

    onChange: function(){
        this.setLabel((this.getValue() == 1) ? this.toggleOnLabel : this.toggleOffLabel);
    }
});
