"use strict";

PropertyFinder.views.Details = function (params) {
    if (!PropertyFinder.currentProperty())
        PropertyFinder.app.navigate("Home");

    var faves = PropertyFinder.faves,
        isFave = ko.observable(false);

    var favesIconSrc = ko.computed(function() {
        return "images/fav_" + (isFave() ? "on" : "off") + ".png";
    });

    var favesText = ko.computed(function() {
        if (!PropertyFinder.isWinPhone)
            return "";
        return isFave() ? "remove" : "add";
    });

    function initializeIsFave() {
        var property = PropertyFinder.currentProperty(),
            favedProperty = PropertyFinder.findFavedProperty(property);
        isFave(!!favedProperty);
    }

    function handleFaveClick(e) {
        var wasFave = isFave(),
            property = PropertyFinder.currentProperty();

        if (wasFave) {
            var favedProperty = PropertyFinder.findFavedProperty(property)
            faves.remove(favedProperty);
        } else {
            faves.push(property);
        }

        isFave(!wasFave);
    }


    function formatRoomInfo(property) {
        var type = property.property_type,
            bedrooms = Number(property.bedroom_number),
            bathrooms = Number(property.bathroom_number),
            list = [ ];


        list.push(bedrooms, " bed");

        if(type)
            list.push(" ", type);

        if(bathrooms)
            list.push(", ", bathrooms, " bathroom")
        if(bathrooms > 1)
            list.push("s");

        return list.join("");
    }

    var propertyView = ko.computed(function() {
        var property = PropertyFinder.currentProperty();
        property = property || {};
        return {
            imageSrc: property.img_url,
            price: Globalize.format(property.price, "c0"),
            title: property.title,
            roomInfo: formatRoomInfo(property),
            summary: property.summary
        };
    });

    return {
        viewShown: function() {
            initializeIsFave();
        },

        favesIconSrc: favesIconSrc,
        favesText: favesText,
        handleFaveClick: handleFaveClick,
        propertyView: propertyView
    };
};