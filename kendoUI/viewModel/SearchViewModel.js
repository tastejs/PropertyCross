
function SearchViewModel() {

    var that,
        searchService = new PropertyCrossSearchService(),
        coords = {};

    this.searchTerm = "";
    this.recentSearches = [];
    this.locations = [];
    this.loading = false;

    function saveState() {
        localStorage.setItem("recentSearches", JSON.stringify(that.recentSearches));
    };

    function loadState() {
        var state = localStorage.getItem("recentSearches");

        if (typeof (state) === 'string') {
            that.set("recentSearches", JSON.parse(state));
        }
    };

    function getDisplayName(location) {
        function to2DP(value) {
            return (Math.round(value * 100))/100;
        }

        if (coords.latitude && coords.longitude) {
            return to2DP(coords.latitude) + "," + to2DP(coords.longitude);
        } else {
            return location.long_title;
        }
    };

    function addToRecentSearches(location, total_results) {

        // check whether we already have this item in our recent searches list
        var existing = -1;
        $.each(that.recentSearches, function (index, search) {
            if (search.place_name === location.place_name) {
                existing = index;
            }
        });

        // if there is no match, add it
        if (existing === -1) {
            that.recentSearches.unshift({
                place_name: location.place_name,
                long_title: getDisplayName(location),
                coords: coords,
                total_results: total_results
            });

            //ensure array doesn't grow past 4
            while (that.recentSearches.length > 4) {
                that.recentSearches.pop();
            }
        } else {
            //else move existing to the front of the array
            var existingSearch = that.recentSearches.splice(existing, 1)[0];
            existingSearch.total_results = total_results; //total may have changed since last searched
            that.recentSearches.unshift(existingSearch);
        }
        saveState();
    };

    function listLocations(response) {
        $.each(response.locations, function (index, location) {
            that.locations.push({
                place_name: location.place_name,
                long_title: location.long_title,
                coords: {}
            });
        });
    };

    function locationNotFound() {
        that.set("locations", []);
        that.set("errorMessage", "The location given was not recognised.");
    };

    function locationFound(response) {
        if (!response.listings || response.listings.length === 0) {
            that.set("errorMessage", "There were no properties found for the given location.");
        } else {
            var location = response.locations[0];
            var displayName = getDisplayName(location);
            resultsViewModel.init(response, location.place_name, displayName);
            app.navigate("#resultsView");
            addToRecentSearches(location, response.total_results);
        }
    };

    //callback function for when search has been completed
    function searchComplete(response) {
        switch (response.application_response_code) {
            case "100":
            case "101":
            case "110":
                locationFound(response);
                break;
            default:
                if (!response.locations || response.locations.length === 0) {
                    locationNotFound();
                } else if (response.locations.length > 1) {
                    listLocations(response);
                }
                break;
        }
        that.set("loading", false);
    };

    function error() {
        that.set("errorMessage", "An error occurred while searching. Please check your network connection and try again.");
        that.set("loading", false);
    };

    function search(placeNameOrCoords, coordinates) {
        that.set("loading", true);
        that.set("locations", []);
        that.set("errorMessage", "");

        coords = coordinates;
        searchService.findProperties(placeNameOrCoords, 1, searchComplete, error);
    };

    this.recentSearchTitleVisible = function() {
        return this.get("recentSearches").length > 0;
    };

    this.listedLocationsTitleVisible = function() {
        return this.get("locations").length > 0;
    };

    //executes a string search for the given location
    this.stringSearch = function(event) {
        event.preventDefault();
        search(this.searchTerm, {});
    };

    //executes a geolocation search for the current location
    this.locationSearch = function() {
        function success(loc) {
            search(loc.coords, loc.coords)
        };

        function error(msg) {
            that.set("errorMessage", "Unable to detect current location. Please ensure location is turned on in your phone settings and try again.");
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            that.set("errorMessage", "The use of location is currently disabled.");
        }
    };

    this.listedLocationClicked = function(event) {
        this.set("searchTerm", event.dataItem.place_name);
        search(event.dataItem.place_name, event.dataItem.coords);
    };

    this.recentSearchClicked = function(event) {
        search(event.dataItem.place_name, event.dataItem.coords);
    };

    this.goToFaves = function(event) {
        app.navigate("#favouritesView");
    };

    that = kendo.observable(this);
    loadState();
    return that;
}