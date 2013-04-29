
function ResultsViewModel() {
    var that, searchService = new PropertyCrossSearchService();

    this.properties = [];
    this.totalResults = "";
    this.loadMoreText = "Load more ...";
    this.pageNumber = 1;
    this.displayName = "";
    this.searchTerm = "";


    function addProperties(listings) {
        $.each(listings, function(index, property) {
            that.properties.push({
                price: formatter.currency(property.price),
                title: formatter.title(property.title),
                img_url: property.img_url,
                thumb_url: property.thumb_url,
                bedroom_number: property.bedroom_number,
                bathroom_number: property.bathroom_number,
                summary: property.summary,
                guid: property.guid,
            });
        });
    };

    this.init = function(response, searchTerm, displayName) {
        that.set("properties", []);
        addProperties(response.listings);
        this.set("pageNumber", 1);
        this.set("totalResults", response.total_results);
        this.set("searchTerm", searchTerm);
        this.set("displayName", displayName);

    };

    this.propertyClicked = function(event) {
        propertyViewModel.init(event.dataItem);
        app.navigate("#propertyView");
    };

    this.loadMore = function() {
        this.set("pageNumber", this.pageNumber + 1);
        this.set("loadMoreText", "Loading ...");

        searchService.findProperties(this.searchTerm, this.pageNumber, function(response) {
            if (response.listings.length > 0) {
                addProperties(response.listings);
            }
            that.set("loadMoreText", "Load more ...");
        });

    };

    this.loadMoreVisible = function() {
        return that.get("properties").length < that.get("totalResults");
    };


    that = kendo.observable(this);
    return that;
}