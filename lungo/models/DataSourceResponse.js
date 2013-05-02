define([], function() {

    var DataSourceResponse = function(params) {
        this.code = params.code;
        this.properties = params.properties;
        this.total = params.total;
    }

    return DataSourceResponse;
});