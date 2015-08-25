PropertyFinder.views.Home = function(params) {

    var displayText = ko.observable(""),
        searchText = ko.observable(""),
        coordinates = ko.observable(""),
        errorText = ko.observable(""),
        loading = ko.observable(false);

    var app = PropertyFinder.app,
        nestoriaTotalCount = PropertyFinder.nestoriaTotalCount,
        nestoriaSuggestions = PropertyFinder.nestoriaSuggestions,
        recentSearchesSource = PropertyFinder.recentSearchesSource;


    // Search routines

    function doNestoriaSearch() {
        loading(true);
        errorText("");
        
        $.extend(PropertyFinder.nestoriaSearchOptions, {
            searchText: searchText(),
            coordinates: coordinates()
        });

        PropertyFinder.nestoriaSource.reload()
            .done(handleNestoriaSearchSuccess)
            .fail(handleNestoriaSearchFailure);
    }

    function handleNestoriaSearchSuccess(items) {
        loading(false);

        if(items.length) {
            PropertyFinder.addToRecentSearches(
                displayText(),
                searchText(),
                coordinates(),
                nestoriaTotalCount()
            );
            app.navigate("Results");
        }

    }

    function handleNestoriaSearchFailure(error) {
        loading(false);
        errorText(error.message);
    }


    // UI handlers

    function handleTextChange() {
        searchText(displayText());
        coordinates("");
    }

    function handleGoClick() {
        $("input").blur(); // force software keyboard hiding
        doNestoriaSearch();
    }

    function handleFaveClick() {
        app.navigate("Faves");
    }

    function handleAboutClick() {
        app.navigate("About");
    }

    function handleLocationClick() {
        loading(true);

        var locationHandled = false,
            watchToken = navigator.geolocation.watchPosition(getPositionSuccess, getPositionFail);

        function getPositionSuccess(location) {
            if(locationHandled) return;
            locationHandled = true;

            navigator.geolocation.clearWatch(watchToken);

            var coordString = location.coords.latitude.toFixed(6) + "," + location.coords.longitude.toFixed(6);

            displayText(coordString);
            searchText("");
            coordinates(coordString);

            doNestoriaSearch();
        }

        function getPositionFail(error) {
            if(locationHandled) return;
            locationHandled = true;

            navigator.geolocation.clearWatch(watchToken);

            loading(false);

            switch(error.code) {
                case 1:
                    errorText("The use of location is currently disabled.");
                    break;
                default:
                    errorText("Unable to detect current location. Please ensure location is turned on in your phone settings and try again.");
                    break;
            }
        }

        setTimeout(function() {
            getPositionFail({ code: 3 });
        }, 5000);
    }

    function handleSuggestionClick(e) {
        var suggestion = e.itemData;

        this.displayText(suggestion.long_title);
        this.searchText(suggestion.place_name);
        this.coordinates("");

        doNestoriaSearch();
    }

    function handleRecentSearchesItemClick(e) {
        var record = e.itemData;

        this.displayText(record.name);
        this.searchText(record.searchText);
        this.coordinates(record.coord);

        doNestoriaSearch();
    }

    function shouldDisplaySuggestions() {
        return nestoriaSuggestions().length > 0;
    }

    function shouldDisplayRecentSearches() {        
        return nestoriaSuggestions().length < 1 && recentSearchesSource.items().length > 0;
    }

    recentSearchesSource.load();

    // ViewModel exports

    return {
        isWinPhone: PropertyFinder.isWinPhone,

        displayText: displayText,
        searchText: searchText,
        coordinates: coordinates,
        errorText: errorText,
        loading: loading,

        nestoriaSuggestions: nestoriaSuggestions,
        recentSearchesSource: recentSearchesSource,

        shouldDisplaySuggestions: shouldDisplaySuggestions,
        shouldDisplayRecentSearches: shouldDisplayRecentSearches,

        handleTextChange: handleTextChange,
        handleGoClick: handleGoClick,
        handleFaveClick: handleFaveClick,
        handleAboutClick: handleAboutClick,
        handleLocationClick: handleLocationClick,
        handleSuggestionClick: handleSuggestionClick,
        handleRecentSearchesItemClick: handleRecentSearchesItemClick
    };

};