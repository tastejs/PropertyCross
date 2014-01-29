Favourites = new $.mvc.model.extend("favourites", {
    property: '',

    //executes the supplied callback function passing whether the supplied id is favourite
    isFave: function(id, callback) {
        this.fetch(id, function(fave) {
            callback(fave.property !== '');
        });
    }
});
var favourites = new Favourites();
