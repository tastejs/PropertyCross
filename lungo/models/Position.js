define([], function() {

    var Position = function(params) {

        this.coords = params.coords;
        this.timestamp = params.timestamp;

        this.latitude = function() {
            return this.coords.latitude;
        };

        this.longitude = function() {
            return this.coords.longitude;
        }

        this.getSearchTerm = function() {
            return this.latitude().toFixed(2) + ', ' + this.longitude().toFixed(2);
        }
    };

    return Position;

});