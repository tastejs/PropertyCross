"use strict";

PropertyFinder.views.Results = function (params) {
    if (!PropertyFinder.nestoriaSource.isLoaded())
        PropertyFinder.app.navigate("Home");

    var title = ko.computed(function() {
        return Globalize.format(PropertyFinder.nestoriaSource.items().length, "n0")
            + " of "
            + Globalize.format(PropertyFinder.nestoriaTotalCount(), "n0");
    });

    function handleItemClick(e) {
        PropertyFinder.currentProperty(e.itemData);
        PropertyFinder.app.navigate("Details");
    }

    return {
        title: title,
        handleItemClick: handleItemClick
    };
};