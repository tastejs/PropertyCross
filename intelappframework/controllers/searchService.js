$.mvc.controller.create("searchService", {

    buildUrl: function(placeNameOrCoords, pageNumber) {
        var placeName = placeNameOrCoords.latitude && placeNameOrCoords.longitude ? "" : placeNameOrCoords;

        return "http://api.nestoria.co.uk/api?" +
            "callback=?&" +
            "country=uk&" +
            "pretty=1&" +
            "encoding=json&" +
            "listing_type=buy&" +
            "action=search_listings&" +
            "page=" + pageNumber + "&" +
            "place_name=" + placeName + "&" +
            "centre_point=" + placeNameOrCoords.latitude + "," + placeNameOrCoords.longitude;

    },

    findProperties: function(placeNameOrCoords, pageNumber, callback, errorCallback) {
        var url = this.buildUrl(placeNameOrCoords, pageNumber);
        $.jsonP({
            url: url,
            success: function(response) {
                callback(response.response);
            },
            error: function() {
                errorCallback();
            }
        });
    }
});