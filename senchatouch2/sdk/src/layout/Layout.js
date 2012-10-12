/**
 * @aside guide layouts
 * @aside video layouts
 *
 * Factory class which returns an instance of the provided layout.
 */
Ext.define('Ext.layout.Layout', {

    requires: [
        'Ext.layout.Fit',
        'Ext.layout.Card',
        'Ext.layout.HBox',
        'Ext.layout.VBox'
    ],

    /**
     * Creates a new Layout for the specified container using the config object's layout to determine
     * layout to instantiate.
     * @param {Ext.Container} container A configuration object for the Component you wish to create.
     * @param {Object} [config] The alias to provide the Layout type; if none is
     * specified, Ext.layout.Default will be used.
     * @return {Ext.layout.Default} The newly instantiated Layout.
     */
    constructor: function(container, config) {
        var layoutClass = Ext.layout.Default,
            type, layout;

        if (typeof config == 'string') {
            type = config;
            config = {};
        }
        else if ('type' in config) {
            type = config.type;
        }

        if (type) {
            layoutClass = Ext.ClassManager.getByAlias('layout.' + type);

            //<debug error>
            if (!layoutClass) {
                Ext.Logger.error("Unknown layout type of: '" + type + "'");
            }
            //</debug>
        }

        return new layoutClass(container, config);
    }
});

