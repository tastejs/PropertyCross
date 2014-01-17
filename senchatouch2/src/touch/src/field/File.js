/**
 * @private
 */
Ext.define('Ext.field.File', {
    extend: 'Ext.field.Input',
    xtype : 'file',

    cachedConfig: {
        type: 'file'
    },

    // @private
    getTemplate: function() {
        var items = [
            {
                reference: 'input',
                tag: this.tag,
                type: 'file'
            }
        ];

        items.push({
            reference: 'mask',
            classList: [this.config.maskCls]
        });

        return items;
    },

    updateType: function(newType, oldType) {
        var prefix = Ext.baseCSSPrefix + 'input-';
        this.input.replaceCls(prefix + oldType, prefix + newType);
    }
});
