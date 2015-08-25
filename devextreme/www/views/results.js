"use strict";

PropertyFinder.views.Results = function (params) {
    if (!PropertyFinder.nestoriaSource.isLoaded())
        PropertyFinder.app.navigate("Home");

    var title = ko.computed(function () {
        var count = PropertyFinder.nestoriaSource.pageSize() * (PropertyFinder.nestoriaSource.pageIndex() + 1),
            total = PropertyFinder.nestoriaTotalCount();
        if(count > total) count = total;
        return Globalize.format(count, "n0")
            + " of "
            + Globalize.format(total, "n0");
    });

    function handleItemClick(e) {
        PropertyFinder.currentProperty(e.itemData);
        PropertyFinder.app.navigate("Details");
    }

    function listReady(e) {
        if(PropertyFinder.updateList) {
            e.component.scrollTo(0);
            PropertyFinder.updateList = false;
        }
    }

    return {
        title: title,
        handleItemClick: handleItemClick,
        listReady: listReady
    };
};