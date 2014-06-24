$.mvc.controller.create("search", {
    views: {
        "resultsTpl": "views/result.html",
        "recentSearchTpl": "views/recentSearch.html",
        "headerTpl": "views/resultListHeader.html",
        "locationTpl": "views/locationList.html",
        "loadMoreTpl": "views/loadMore.html"
    },
    $resultList: $("#resultList"),
    $errorMessage: $("#errorMessage"),
    $locList: $("#locList"),
    $recentSearches: $("#recentSearches"),
    $loadMore: $("#loadMore"),
    $loadingSpinner: $("#loadingSpinner"),
    placeName: '',
    displayName: '',
    pageNum: 1,
    searchResults: [],
    totalResults: 1,

    /* Sets the display name locally - this is either the long_title of the location object, or formatted coordinates in the case of geo search */
    setDisplayName: function(location, placeNameOrCoords) {
        function to2DP(value) {
            return (Math.round(value * 100)) / 100;
        }
        if (this.displayName === '') {
            if (placeNameOrCoords.latitude && placeNameOrCoords.longitude) {
                this.displayName = to2DP(placeNameOrCoords.latitude) + "," + to2DP(placeNameOrCoords.longitude);
            } else {
                this.displayName = location.long_title;
            }
        }
    },

    /* Adds a search to the recent search list */
    addToRecentSearches: function(response) {
        var loc = response.locations[0];
        var recentSearchId = loc.place_name;
        var recentSearch = new RecentSearch();
        var that = this;

        recentSearch.fetch(recentSearchId, function(existing) {
            if (existing.display_name !== "") {
                //if recent search already exists, needs to move to top
                recentSearch.remove(function() {
                    $('li[data-recent-search-id="' + recentSearchId + '"]').remove();
                });
                that.displayName = existing.display_name;
            }
            recentSearch.id = recentSearchId;
            recentSearch.set({
                display_name: that.displayName,
                total_results: $.mvc.controller.formatter.number(response.total_results),
                searchTimeMS: new Date().getTime()
            });
            recentSearch.save(function() {
                that.$recentSearches.prepend($.template("recentSearchTpl", {
                    search: recentSearch
                }));
                that.$recentSearches.find($(":nth-child(5)")).remove();
                recentSearch.prune();
            });
            $("#recentSearchLabel").show();
        });
    },

    /* Sets an error message and displays the element */
    setErrorMessage: function(message) {
        this.$errorMessage.html(message);
        this.$errorMessage.show();
    },

    /* Adds properties to the model, updates the results view and transitions to results view */
    updatePropertiesList: function(response) {
        var that = this, i, prop;
        for (i = 0; i < response.listings.length; i++) {
            prop = response.listings[i];
            var property = new Property();
            property.id = prop.guid;
            property.set({
                thumb_url: prop.thumb_url,
                price: $.mvc.controller.formatter.currency(prop.price),
                title: $.mvc.controller.formatter.title(prop.title),
                summary: prop.summary,
                img_url: prop.img_url,
                bedroom_number: prop.bedroom_number,
                bathroom_number: prop.bathroom_number
            });
            property.save(function() {
                that.searchResults.push(property);
                that.$resultList.append($.template("resultsTpl", {
                    property: property,
                    fave: false
                }));
            });
        }
        this.totalResults = response.total_results;

        this.refreshResultsHeader();

    },

    refreshResultsHeader: function() {
        var numResults = $.mvc.controller.formatter.number(this.searchResults.length);
        var totalResults = $.mvc.controller.formatter.number(this.totalResults);

        $("#resultListHeader h1").html(
            $.template("headerTpl", {
            numResults: numResults,
            totalResults: totalResults
        }));

        if (numResults === totalResults) {
            this.$loadMore.hide();
        } else {
            this.$loadMore.find("a span").html(
                $.template("loadMoreTpl", {
                numResults: numResults,
                totalResults: totalResults,
                searchTerm: this.displayName
            }));
            this.$loadMore.show();
        }
    },

    /* Outputs the results of a search to the DOM and switches the view to the results view */
    locationFound: function(response, locOrCoords) {
        if (response.listings.length === 0) {
            this.setErrorMessage("There were no properties found for the given location.");
        }
        var loc = response.locations[0];
        this.placeName = loc.place_name;
        this.setDisplayName(loc, locOrCoords);
        this.updatePropertiesList(response);
        //transition to results view
        $.ui.loadContent("results", false, false, "slide");



        this.addToRecentSearches(response);
    },

    /* Lists all the locations for an ambiguous search */
    listLocations: function(response) {
        $("#locListLabel").show();
        var that = this;
        this.$locList.empty();
        $.each(response.locations, function(index, loc) {
            that.$locList.append($.template("locationTpl", {
                loc: loc
            }));
        });
        this.$locList.show();
    },

    /* Performs the search for location or coordinates */
    performSearch: function(locOrCoords) {
        this.$loadingSpinner.show();
        this.$errorMessage.hide();
        this.$locList.hide();
        $("#locListLabel").hide();

        this.searchResults = [];
        this.$resultList.empty();
        this.pageNum = 1;
        var that = this;

        $.mvc.controller.searchService.findProperties(locOrCoords, this.pageNum, function(response) {
            that.$loadingSpinner.hide();
            switch (response.application_response_code) {
                case "100":
                case "101":
                case "110":
                    that.locationFound(response, locOrCoords);
                    break;
                default:
                    if (!response.locations || response.locations.length === 0) {
                        that.setErrorMessage("The location given was not recognised.");
                    } else if (response.locations.length > 1) {
                        that.listLocations(response);
                    }
                    break;
            }
        }, function() {
            that.setErrorMessage("An error occurred while searching. Please check your network connection and try again.");
            that.$loadingSpinner.hide();
        });
    },

    /* Updates results page to show search results */
    show: function() {
        var that = this;
        this.refreshResultsList(function() {
            that.refreshResultsHeader();
            $.ui.loadContent("results", false, false, "slide");
        });
    },

    refreshResultsList: function(callback) {
        var that = this;
        this.$resultList.empty();

        if (this.searchResults.length === 0) {
            $.ui.loadContent("main", false, false, "slide");
            return;
        } else {
            $.each(this.searchResults, function(index, prop) {
                var property = new Property();
                property.id = prop.id;
                property.set({
                    thumb_url: prop.thumb_url,
                    price: prop.price,
                    title: prop.title,
                    summary: prop.summary,
                    img_url: prop.img_url,
                    bedroom_number: prop.bedroom_number,
                    bathroom_number: prop.bathroom_number
                });
                property.save(function() {
                    that.$resultList.append($.template("resultsTpl", {
                        property: prop,
                        fave: false
                    }));
                });
            });
        }
        callback();
    },

    /* Performs a string search, using the value entered in the input box */
    string: function () {
        var searchBox = $('#stringSearch');
        var location = searchBox.val();
        if (location === "") {
            this.setErrorMessage("Please enter a location to search for");
        } else {
            this.displayName = '';
            this.performSearch(location);
        }
        // Remove keyboard focus
        searchBox.blur();
    },

    /* Performs a geo location search */
    geo: function() {
        var that = this;

        function success(loc) {
            that.displayName = '';
            that.performSearch(loc.coords);
        };

        function error(msg) {
            that.setErrorMessage("The use of location is currently disabled.");
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            this.setErrorMessage("The use of location is currently disabled.");
        }
    },

    /* Searches on a recently searched location */
    recent: function(placeName) {
        var that = this;
        recentSearch.fetch(placeName, function(search) {
            that.displayName = search.display_name;
            that.performSearch(placeName);
        });
    },

    loc: function(placeName) {
        this.displayName = '';
        this.performSearch(placeName);
        $('#stringSearch').val(placeName);
    },

    /*Loads more results, for the current search*/
    loadMore: function() {
        var $loadMoreLabel = this.$loadMore.find("h3");
        $loadMoreLabel.html("Loading...");
        this.pageNum += 1;
        var that = this;
        $.mvc.controller.searchService.findProperties(this.placeName, this.pageNum, function(response) {
            that.updatePropertiesList(response);
            $loadMoreLabel.html("Load more...");
        });
    },

    /* Init - adds recent searches from local storage to the DOM */
    init: function() {
        var that = this;
        var recentSearch = new RecentSearch();
        recentSearch.fetchAll(function(searches) {
            if (searches.length !== 0) {
                $("#recentSearchLabel").show();
            }
            searches.sort(function(a, b) {
                return b.searchTimeMS - a.searchTimeMS;
            });
            $.each(searches, function(index, search) {
                that.$recentSearches.append($.template("recentSearchTpl", {
                    search: search
                }));
            });
        });
    }
});
