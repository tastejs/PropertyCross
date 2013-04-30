$.mvc.controller.create("results", {
    views: {"propertyTpl": "views/property.tpl"},
    favesPage: false,

    goToProperty: function(id, favesPage) {
        this.favesPage = favesPage === "true";
        properties.get(id, function(property) {
            $("#property").html($.template("propertyTpl",{property:property}));
            var $addRemoveFaveButton = $("#addRemoveFave");
            $addRemoveFaveButton.attr("href", "/favourites/addRemove/" + id);
            favourites.isFave(id, function(isFave) {
                if (isFave) {
                    $addRemoveFaveButton.addClass("fave");
                } else {
                    $addRemoveFaveButton.removeClass("fave");
                }
            });
            if (property.bedroom_number == 0) {
                $("#bedroomNumber").hide();
            } else {
                $("#bedroomNumber").show();
            }
            if (property.bathroom_number == 0) {
                $("#bathroomNumber").hide();
            } else {
                $("#bathroomNumber").show();
            }
            $.ui.loadContent("property",false,false,"slide");
        });
    },

    backToResults: function() {
        if (this.favesPage) { //if came from faves page, need to refresh the faves list before going back in case favourite was removed
            $.mvc.controller.favourites.refreshFavesList(function() {
                $.ui.goBack();
            });
        } else {
            $.ui.goBack();
        }
    }
});