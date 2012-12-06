/**
 * @private
 */
Ext.define('Ext.behavior.Draggable', {

    extend: 'Ext.behavior.Behavior',

    requires: [
        'Ext.util.Draggable'
    ],

    constructor: function() {
        this.listeners = {
            painted: 'onComponentPainted',
            scope: this
        };

        this.callParent(arguments);
    },

    onComponentPainted: function() {
        this.draggable.refresh();
    },

    setConfig: function(config) {
        var draggable = this.draggable,
            component = this.component;

        if (config) {
            if (!draggable) {
                component.setTranslatable(true);
                this.draggable = draggable = new Ext.util.Draggable(config);
                draggable.setTranslatable(component.getTranslatable());
                draggable.setElement(component.renderElement);
                draggable.on('destroy', 'onDraggableDestroy', this);

                if (component.isPainted()) {
                    this.onComponentPainted(component);
                }

                component.on(this.listeners);
            }
            else if (Ext.isObject(config)) {
                draggable.setConfig(config);
            }
        }
        else if (draggable) {
            draggable.destroy();
        }

        return this;
    },

    getDraggable: function() {
        return this.draggable;
    },

    onDraggableDestroy: function() {
        var component = this.component;

        delete this.draggable;
        component.un(this.listeners);
    },

    onComponentDestroy: function() {
        var draggable = this.draggable;

        if (draggable) {
            draggable.destroy();
        }
    }
});
