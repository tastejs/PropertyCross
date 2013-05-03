define(
    [
        'ko'
    ],

    function(ko) {

        var PropertyViewModel = function(application) {

            this.model = null;

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

            this.stats = ko.computed(function() {
                return this.bedrooms() + ' bed, ' + this.bathrooms() + ' bathrooms';
            }, this);

            this.location = ko.computed(function() {
                var split = this.title().split(',');
                return split[0] + ', ' + split[1];
            }, this, {
                deferEvaluation: true
            });

            this.initialize = function(property) {
                this.model = property;

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

            this.isFavourited = function() {
                return application.getFavouriteByGuid(this.model.guid) !== null;
            };

            this.toggleFavourited = function() {
                application.toggleFavourited(this.model);
            };
        };

        return PropertyViewModel;

});