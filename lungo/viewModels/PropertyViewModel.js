define(
    [
        'ko'
    ],

    function(ko) {

        var PropertyViewModel = function() {

            this.guid = ko.observable();
            this.price = ko.observable();
            this.bedrooms = ko.observable();
            this.bathrooms = ko.observable();
            this.propertyType = ko.observable();
            this.title = ko.observable();
            this.thumbnailUrl = ko.observable();
            this.imgUrl = ko.observable();
            this.summary = ko.observable();

            this.formattedPrice = ko.computed(function() {
                return '£' + this.price();
            }, this);

            this.initialize = function(property) {
                this.guid(property.guid);
                this.price(property.price);
                this.bedrooms(property.bedrooms);
                this.bathrooms(property.bathrooms);
                this.propertyType(property.propertyType);
                this.title(property.title);
                this.thumbnailUrl(property.thumbnailUrl);
                this.imgUrl(property.imgUrl);
                this.summary(property.summary);
            };

        };

        return PropertyViewModel;

});