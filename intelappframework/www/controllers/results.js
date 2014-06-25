$.mvc.controller.create("results", {
    views: {
        "propertyTpl": "views/property.html"
    },
    favesPage: false,

    goToProperty: function(id, favesPage) {
        this.favesPage = favesPage === "true";
        properties.fetch(id, function(property) {
            $.ui.updatePanel("#propertyContent", $.template("propertyTpl", {
                property: property
            }));
            var faveController = $.mvc.controller.favourites;
            
            var propertyFaveButton = $("#propertyFaveButton");
            propertyFaveButton.attr("href", "/favourites/addRemove/" + id);
            favourites.isFave(id, function(isFave) {
                if (isFave) {
                    faveController.styleFaved(propertyFaveButton);
                } else {
                    faveController.styleUnfaved(propertyFaveButton);
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
            $.ui.loadContent("property", false, false, "slide");
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
