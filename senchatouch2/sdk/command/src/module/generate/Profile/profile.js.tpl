Ext.define('{appName}.profile.{name}', {
    extend: 'Ext.app.Profile',
    
    //define any additional classes your Profile needs here
    config: {
        views: [],
        models: [],
        stores: [],
        controllers: []
    {[ "\}"]},
    
    //this profile will be activated if we detect we're running on a {name}
    isActive: function(app) {
        return Ext.os.is.{name};
    {[ "\}"]}
});