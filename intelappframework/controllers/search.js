$.mvc.controller.create("search", {
    views: {"resultsTpl": "views/result.tpl",
            "recentSearchTpl": "views/recentSearch.tpl",
            "headerTpl": "views/resultListHeader.tpl",
            "locationTpl": "views/locationList.tpl",
            "loadMoreTpl": "views/loadMore.tpl"
    },
    $resultList: $("#resultList"),
    $errorMessage: $("#errorMessage"),
    $locList: $("#locList"),
    $recentSearches: $("#recentSearches"),
    $loadMore: $("#loadMore"),
    $loadingSpinner: $("#loadingSpinner"),
    placeName: '', displayName: '', pageNum: 1,

    /* Sets the display name locally - this is either the long_title of the location object, or formatted coordinates in the case of geo search */
    setDisplayName: function(location, placeNameOrCoords) {
        function to2DP(value) {
            return (Math.round(value * 100))/100;
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

        recentSearch.get(recentSearchId, function(existing) {
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
                that.$recentSearches.prepend($.template("recentSearchTpl", {search: recentSearch}));
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
        var that = this;
        response.listings.forEach(function(prop){
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
                that.$resultList.append($.template("resultsTpl",{property:property}));
            });
        });
        var numResults = that.$resultList.find("a").length;
        var totalResults = response.total_results;

        $("#resultListHeader h1").html(
                            $.template("headerTpl", {
                                numResults: $.mvc.controller.formatter.number(numResults),
                                totalResults: $.mvc.controller.formatter.number(totalResults)}));
        $.ui.updateHeaderElements($("#resultListHeader")); //unfortunately needed for load more to update num results value in the header

        if (numResults === totalResults) {
            this.$loadMore.hide();
        } else {
            this.$loadMore.find("a span").html(
                            $.template("loadMoreTpl", {
                                numResults: $.mvc.controller.formatter.number(numResults),
                                totalResults: $.mvc.controller.formatter.number(totalResults),
                                searchTerm: this.displayName}));
            this.$loadMore.show();
        }

    },

    /* Outputs the results of a search to the DOM and switches the view to the results view */
    locationFound: function(response, locOrCoords) {
        if(response.listings.length === 0) {
            this.setErrorMessage("There were no properties found for the given location.");
        }
        var loc = response.locations[0];
        this.placeName = loc.place_name;
        this.setDisplayName(loc, locOrCoords);
        this.updatePropertiesList(response);
        //transition to results view
        $.ui.loadContent("results",false,false,"slide");

        this.addToRecentSearches(response);
    },

    /* Lists all the locations for an ambiguous search */
    listLocations: function(response) {
        $("#locListLabel").show();
        var that = this;
        this.$locList.empty();
        $.each(response.locations, function(index, loc) {
            that.$locList.append($.template("locationTpl", {loc: loc}));
        });
        this.$locList.show();
    },

    /* Performs the search for location or coordinates */
    performSearch: function(locOrCoords) {
        this.$loadingSpinner.show();
        this.$errorMessage.hide();
        this.$locList.hide();
        $("#locListLabel").hide();

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

    /* Performs a string search, using the value entered in the input box */
    string:function() {
        var location = $('#stringSearch').val();
        if (location === "") {
            this.setErrorMessage("Please enter a location to search for");
        } else {
            this.displayName = '';
            this.performSearch(location);
        }
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
    recent: function(placeName, displayName){
        this.displayName = displayName;
        this.performSearch(placeName);
    },

    loc: function(placeName) {
        this.displayName = '';
        this.performSearch(placeName);
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
        recentSearch.getAll(function(searches) {
            if (searches.length !== 0) {
                $("#recentSearchLabel").show();
            }
            searches.sort(function(a, b) {
                return b.searchTimeMS - a.searchTimeMS;
            });
            $.each(searches, function(index, search) {
                that.$recentSearches.append($.template("recentSearchTpl", {search: search}));
            });
        });
    }
});