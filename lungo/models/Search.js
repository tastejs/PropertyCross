define([], function() {

    var Search = function(params) {
        this.term = params.term;
        this.pageNumber = params.pageNumber;
    };

    return Search;
});