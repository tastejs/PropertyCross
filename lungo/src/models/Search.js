define(
    [
        'models/Position'
    ],

    function(Position) {

    var Search = function(params) {
        this.term = params.term;
        this.position = params.position && new Position(params.position);
        this.pageNumber = params.pageNumber;
        this.type = params.type;

        this.getTerm = function() {
            if(this.type === Search.Type.term) {
                return this.term;
            } else if(this.type === Search.Type.location) {
                return this.position.latitude() + ',' + this.position.longitude();
            }
        };

        this.getNextPageSearch = function() {
            return new Search({
                term: this.term,
                position: this.position,
                pageNumber: this.pageNumber + 1,
                type: this.type
            });
        };
    };

    Search.Type = {
        'term': 0,
        'location': 1
    };

    return Search;
});