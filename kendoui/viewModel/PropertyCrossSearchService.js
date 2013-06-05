function PropertyCrossSearchService() {

    this.findProperties = function (placeNameOrCoords, pageNumber, callback, errorCallback) {
        $.ajax({
            dataType: "jsonp",
            data: {
                country: "uk",
                pretty: "1",
                encoding: "json",
                listing_type: "buy",
                action: "search_listings",
                page: pageNumber,
                place_name: placeNameOrCoords,
                centre_point: placeNameOrCoords.latitude + "," + placeNameOrCoords.longitude
            },
            url: "http://api.nestoria.co.uk/api",
            timeout: 5000,
            success: function(response) {
                callback(response.response);
            },
            error: function() {
                errorCallback();
            }
        });

    };

}