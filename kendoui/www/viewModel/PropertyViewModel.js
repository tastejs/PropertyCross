function PropertyViewModel() {

    var that;

    this.property = {};
    this.fave = false;

    this.init = function(property) {
        this.set("property", property);
        var isFave = favouritesService.isFave(this.property);
        this.set("fave", isFave);
    };

    this.addRemoveFave = function(event) {
        var isFave = favouritesService.addRemoveFave(that.property);
        this.set("fave", isFave);
    };

    this.isFave = function() {
        return this.get("fave");
    };

    this.notFave = function() {
        return !this.get("fave");
    };

    that = kendo.observable(this);
    return that;

}