function FavouritesService() {
    this.favourites = [];

    function saveState() {
        localStorage.setItem("favourites", JSON.stringify(that.favourites));
    };

    function loadState() {
        var state = localStorage.getItem("favourites");

        if (typeof (state) === 'string') {
            that.set("favourites", JSON.parse(state));
        }
    };

    this.faveIndex = function(property) {
        var fave = -1;
        $.each(that.favourites, function (index, favourite) {
            if (favourite.guid === property.guid) {
                fave = index;
                return false;
            }
        });
        return fave;
    };

    this.isFave = function(property) {
        return this.faveIndex(property) !== -1;
    };

    this.addRemoveFave = function(property) {
        var currentIndex = this.faveIndex(property);
        var isFave;
        if (currentIndex === -1) {
            isFave = true;
            that.favourites.push(property);
        } else {
            isFave = false;
            that.favourites.splice(currentIndex, 1);
        }
        saveState();
        return isFave;
    };

    var that = kendo.observable(this);
    loadState();
    return that;
}