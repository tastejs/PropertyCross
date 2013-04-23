function PropertyViewModel() {

    var that;

    this.property = {};
    this.fave = false;
    this.notFave = true //I can't believe this is needed, but can't see a way round it!

    this.init = function(property) {
        this.set("property", property);
        var isFave = favouritesService.isFave(this.property);
        this.set("fave", isFave);
        this.set("notFave", !isFave);
    };

    this.addRemoveFave = function(event) {
        var isFave = favouritesService.addRemoveFave(that.property);
        this.set("fave", isFave);
        this.set("notFave", !isFave);
    };

    that = kendo.observable(this);
    return that;

}