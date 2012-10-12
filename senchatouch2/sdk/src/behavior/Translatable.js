/**
 * @private
 */
Ext.define('Ext.behavior.Translatable', {

    extend: 'Ext.behavior.Behavior',

    requires: [
        'Ext.util.Translatable'
    ],

    constructor: function() {
        this.listeners = {
            painted: 'onComponentPainted',
            scope: this
        };

        this.callParent(arguments);
    },

    onComponentPainted: function() {
        this.translatable.refresh();
    },

    setConfig: function(config) {
        var translatable = this.translatable,
            component = this.component;

        if (config) {
            if (!translatable) {
                this.translatable = translatable = new Ext.util.Translatable(config);
                translatable.setElement(component.renderElement);
                translatable.on('destroy', 'onTranslatableDestroy', this);

                if (component.isPainted()) {
                    this.onComponentPainted(component);
                }

                component.on(this.listeners);
            }
            else if (Ext.isObject(config)) {
                translatable.setConfig(config);
            }
        }
        else if (translatable) {
            translatable.destroy();
        }

        return this;
    },

    getTranslatable: function() {
        return this.translatable;
    },

    onTranslatableDestroy: function() {
        var component = this.component;

        delete this.translatable;
        component.un(this.listeners);
    },

    onComponentDestroy: function() {
        var translatable = this.translatable;

        if (translatable) {
            translatable.destroy();
        }
    }
});
