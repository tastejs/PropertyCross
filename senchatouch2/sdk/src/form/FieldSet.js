/**
 * @aside guide forms
 *
 * A FieldSet is a great way to visually separate elements of a form. It's normally used when you have a form with
 * fields that can be divided into groups - for example a customer's billing details in one fieldset and their shipping
 * address in another. A fieldset can be used inside a form or on its own elsewhere in your app. Fieldsets can
 * optionally have a title at the top and instructions at the bottom. Here's how we might create a FieldSet inside a
 * form:
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'fieldset',
 *                 title: 'About You',
 *                 instructions: 'Tell us all about yourself',
 *                 items: [
 *                     {
 *                         xtype: 'textfield',
 *                         name : 'firstName',
 *                         label: 'First Name'
 *                     },
 *                     {
 *                         xtype: 'textfield',
 *                         name : 'lastName',
 *                         label: 'Last Name'
 *                     }
 *                 ]
 *             }
 *         ]
 *     });
 *
 * Above we created a {@link Ext.form.Panel form} with a fieldset that contains two text fields. In this case, all
 * of the form fields are in the same fieldset, but for longer forms we may choose to use multiple fieldsets. We also
 * configured a {@link #title} and {@link #instructions} to give the user more information on filling out the form if
 * required.
 */
Ext.define('Ext.form.FieldSet', {
    extend  : 'Ext.Container',
    alias   : 'widget.fieldset',
    requires: ['Ext.Title'],

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'form-fieldset',

        /**
         * @cfg {String} title Optional fieldset title, rendered just above the grouped fields
         * @accessor
         */
        title: null,

        /**
         * @cfg {String} instructions Optional fieldset instructions, rendered just below the grouped fields
         * @accessor
         */
        instructions: null
    },

    // @private
    applyTitle: function(title) {
        if (typeof title == 'string') {
            title = {title: title};
        }

        Ext.applyIf(title, {
            docked : 'top',
            baseCls: this.getBaseCls() + '-title'
        });

        return Ext.factory(title, Ext.Title, this.getTitle());
    },

    // @private
    updateTitle: function(newTitle, oldTitle) {
        if (newTitle) {
            this.add(newTitle);
        }
        if (oldTitle) {
            this.remove(oldTitle);
        }
    },

    // @private
    applyInstructions: function(instructions) {
        if (typeof instructions == 'string') {
            instructions = {title: instructions};
        }

        Ext.applyIf(instructions, {
            docked : 'bottom',
            baseCls: this.getBaseCls() + '-instructions'
        });

        return Ext.factory(instructions, Ext.Title, this.getInstructions());
    },

    // @private
    updateInstructions: function(newInstructions, oldInstructions) {
        if (newInstructions) {
            this.add(newInstructions);
        }
        if (oldInstructions) {
            this.remove(oldInstructions);
        }
    }
});
