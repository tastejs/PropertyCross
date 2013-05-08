define([], function() {

    var Search = function(params) {
        this.term = params.term;
        this.position = params.position;
        this.pageNumber = params.pageNumber;
        this.type = params.type;

        this.getTerm = function() {
            if(this.type === Search.Type.term) {
                return this.term;
            } else if(this.type === Search.Type.location) {
                return this.position.latitude() + ',' + this.position.longitude();
            }
        };
    };

    Search.Type = {
        'term': 0,
        'location': 1
    };

    return Search;
});