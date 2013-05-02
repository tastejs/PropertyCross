define([], function() {

    var Property = function(params) {
        this.guid = params.guid;
        this.price = params.price;
        this.bedrooms = params.bedrooms;
        this.bathrooms = params.bathrooms;
        this.propertyType = params.propertyType;
        this.title = params.title;
        this.thumbnailUrl = params.thumbnailUrl;
        this.imgUrl = params.imgUrl;
        this.summary = params.summary;
    };

    return Property;

});