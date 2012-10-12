/**
 * @class Command.preprocessor.statement.Deprecated
 * @author Jacky Nguyen <jacky@sencha.com>
 */
Ext.define('Command.preprocessor.statement.Deprecated', {
    extend: 'Command.preprocessor.statement.If',

    constructor: function() {
        var since, product;

        this.callParent(arguments);

        since = this.getProperty('since');
        product = this.getProperty('product');

        this.removeProperty('since');

        if (since == null) {
            this.setProperty('deprecated', 'true');
            return this;
            // throw new Error("[Parser.Statement.Deprecated] 'since' property is required for deprecated statement");
        }

        if (product != null) {
            if (this.preprocessor.evaluate('product', '=' + product)) {
                this.removeProperty('product');
            }
            else {
                this.setProperty('product', '!' + product);
                return;
            }
        }

        this.setProperty('minVersion', '<=' + since);
    }
});
