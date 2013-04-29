define ["lib/jqtouch",
        "cs!util/formatBindings",
        "cs!viewModel/PropertyViewModel",
        "cs!viewModel/LocationViewModel",
        "cs!model/Search",
        "cs!dataSource/PropertyDataSource"], (jq, ko, PropertyVM, LocationVM, Search, PropertyDataSource) ->
    dataSource = new PropertyDataSource()

    class AppViewModel
        location: ko.observable ""
        listings: ko.observableArray []
        totalResults: ko.observable()
        selectedProperty: ko.observable()
        recentSearches: ko.observableArray()
        possibleLocations: ko.observableArray()
        favourites: ko.observableArray()
        errorState: ko.observable ""
        searchInProgress: ko.observable false
        lastSearch: undefined
        searchedLocation: ko.observable ""

        constructor: ->
            # Load from/Save to localStorage ..
            localFavs = if localStorage.favourites then JSON.parse localStorage.favourites else []
            @favourites (new PropertyVM fav, this for fav in localFavs)
            @favourites.subscribe (favs) -> localStorage.favourites = ko.toJSON favs

            localPrevSearches = if localStorage.recentSearches then JSON.parse localStorage.recentSearches else []
            @recentSearches (new Search prev for prev in localPrevSearches)
            @recentSearches.subscribe (searches) -> localStorage.recentSearches = ko.toJSON searches

        to2Dp: (value) ->
            (Math.round(value * 100))/100

        searchedLocationString: (locationOrCoords, alt) ->
            if locationOrCoords.latitude and locationOrCoords.longitude
                "#{@to2Dp(locationOrCoords.latitude)},#{@to2Dp(locationOrCoords.longitude)}"
            else if alt
                alt
            else
                locationOrCoords

        # Performs the property search, uses the search or coordinates, or the last search if not provided..
        search: (page, locationOrCoords) ->
            if page is 1
                @searchedLocation @searchedLocationString locationOrCoords

            if @searchInProgress() then return
            @searchInProgress true
            if not page or page is 1
                @listings.removeAll()

            locationOrCoords ?= @lastSearch
            self = this
            dataSource.findProperties locationOrCoords, page, (result) ->
                self.errorState ""
                self.searchInProgress false
                self.possibleLocations.removeAll()
                switch result.response
                    when "OK"
                        if result.listings.length is 0
                            self.errorState "There were no properties found for the given location."
                            return
                        self.listings.push new PropertyVM prop, self for prop in result.listings
                        self.totalResults result.total_results
                        loc = result.location
                        self.lastSearch = locationOrCoords

                        if page is 1
                            self.recentSearches.remove (search) -> search.place_name is loc.place_name
                            self.recentSearches.unshift (new Search {
                                place_name: loc.place_name
                                long_title: self.searchedLocationString locationOrCoords, loc.long_title
                                count: result.total_results
                                search_loc: locationOrCoords
                            })
                            if self.recentSearches().length > 4 then self.recentSearches.pop()
                        jq.goTo "#listings", "slideleft"
                    when "AMBIGUOUS"
                        self.possibleLocations.push new LocationVM loc for loc in result.locations
                    when "UNKNOWN"
                        self.errorState "The location given was not recognised."
                    else  #"ERROR"
                        self.errorState "An error occurred while searching. Please check your
                            network connection and try again."
        stringSearch: -> @search 1, @location()
        recentSearch: (search) -> @search 1, search.search_loc
        searchWithName: (name) -> @search 1, name
        geoSearch: ->
            self = this
            navigator.geolocation.getCurrentPosition(
                (position) ->
                    self.search 1, position.coords
                ->
                    self.errorState "Unable to detect current location. Please ensure location is turned
                        on in your phone settings and try again."
            )
        loadMore: ->
            @search Math.ceil( (@listings().length + 1) / 20)
        showDetail: (prop) ->
            @selectedProperty prop
            jq.goTo "#listingDetail", "slideleft"