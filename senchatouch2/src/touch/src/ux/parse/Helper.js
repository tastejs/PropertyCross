Ext.define('Ext.ux.parse.Helper', {
    alternateClassName: ["ParseHelper"],
    singleton: true,

    $objects: {},

    getObjectClass: function(name) {
        if(!this.$objects[name]) {
            this.$objects[name] = Parse.Object.extend(name)
        }
        return this.$objects[name];
    },

    getObject: function(name, options) {
        var objectClass = this.getObjectClass(name);
        return new objectClass(Ext.merge({}, options));
    },

    getQuery: function(name, options) {
        var obj = this.getObjectClass(name);
        return new Parse.Query(obj, Ext.merge({}, options));
    }
});