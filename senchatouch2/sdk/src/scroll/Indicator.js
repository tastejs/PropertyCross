/**
 * @private
 */
Ext.define('Ext.scroll.Indicator', {
    requires: [
        'Ext.scroll.indicator.Default',
        'Ext.scroll.indicator.ScrollPosition',
        'Ext.scroll.indicator.CssTransform'
    ],

    alternateClassName: 'Ext.util.Indicator',

    constructor: function(config) {
        if (Ext.os.is.Android2 || Ext.browser.is.ChromeMobile) {
            return new Ext.scroll.indicator.ScrollPosition(config);
        }
        else if (Ext.os.is.iOS) {
            return new Ext.scroll.indicator.CssTransform(config);
        }
        else {
            return new Ext.scroll.indicator.Default(config);
        }
    }
});
