$.mvc.controller.create("favourites", {

    show: function() {
        this.refreshFavesList(function() {
            $("#resultListHeader h1").html("Favourites");
            $("#loadMore").hide();
            //transition to results view
            $.ui.loadContent("results", false, false, "slide");
        });
    },

    refreshFavesList: function(callback) {
        var $resultList = $("#resultList");
        $resultList.empty();

        favourites.fetchAll(function(faves) {

            if (faves.length === 0) {
                $resultList.html("You have not added any properties to your favourites");
            } else {
                $.each(faves, function(index, fave) {
                    var property = new Property();
                    var prop = fave.property;
                    property.id = prop.id;
                    property.set({
                        thumb_url: prop.thumb_url,
                        price: prop.price,
                        title: prop.title,
                        summary: prop.summary,
                        img_url: prop.img_url,
                        bedroom_number: prop.bedroom_number,
                        bathroom_number: prop.bathroom_number
                    });
                    property.save(function() {
                        $resultList.append($.template("resultsTpl", {
                            property: prop,
                            fave: true
                        }));
                    });
                });
            }
            callback();
        });

    },

    addRemove: function(id) {
        var that = this;
        favourites.fetch(id, function(fave) {
            //if property doesn't exist as a favourite then add it
            if (fave.property === '') {

                properties.fetch(id, function(property) {

                    var fave = new Favourites();
                    fave.id = id;
                    fave.set({
                        property: property
                    });
                    fave.save(function() {
                        $("#addRemoveFave").addClass("fave");
                    });
                });
            } else {
                //else remove from favourites
                fave.remove(function() {
                    $("#addRemoveFave").removeClass("fave");
                });
            }
        });
    }
});
