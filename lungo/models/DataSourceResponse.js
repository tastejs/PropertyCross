define([], function() {

    var DataSourceResponse = function(params) {
        this.code = params.code;
        this.data = params.data;
        this.total = params.total;
        this.pageNumber = params.pageNumber;
        this.search = params.search;
    };

    return DataSourceResponse;
});