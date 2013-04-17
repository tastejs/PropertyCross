/**
 * @private
 */
Ext.define('Ext.scroll.Indicator', {
    requires: [
        'Ext.scroll.indicator.CssTransform',
        'Ext.scroll.indicator.ScrollPosition',
        'Ext.scroll.indicator.Rounded'
    ],

    alternateClassName: 'Ext.util.Indicator',

    constructor: function(config) {
        var namespace = Ext.scroll.indicator;

        switch (Ext.browser.getPreferredTranslationMethod(config)) {
        case 'scrollposition':
            return new namespace.ScrollPosition(config);
        case 'csstransform':
            if (Ext.browser.is.AndroidStock4) {
                return new namespace.CssTransform(config);
            } else {
                return new namespace.Rounded(config);
            }
        }
    }
});
