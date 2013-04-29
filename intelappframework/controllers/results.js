$.mvc.controller.create("results", {
    views: {"propertyTpl": "views/property.tpl"},

    goToProperty: function(id) {
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
    }
});