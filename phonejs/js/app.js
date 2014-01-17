"use strict";


// MODULE: Application bootstrap

!function() {
    var app,
        APP_SETTINGS,
        PropertyFinder = window.PropertyFinder = { },
        device = DevExpress.devices.current();

    PropertyFinder.views = {};
    PropertyFinder.isWinPhone = device.platform === "win8" && device.phone;

    function onBackKeyDown() {
        if(PropertyFinder.app.canBack()) {
            PropertyFinder.app.back();
        }
        else {
            throw new Error("exit");
        }
    }

    APP_SETTINGS = {
        namespace: PropertyFinder.views,
        
        defaultLayout: "navbar",
        //defaultLayout: "slideout",
        navigation: [
            {
                title: "Home",
                action: "#Home",
                icon: "home"
            },
            {
                title: "Favorites",
                action: "#Faves",
                icon: "favorites"
            },
            {
                title: "About",
                action: "#About",
                icon: "info"
            }
        ]
    };

    if(PropertyFinder.isWinPhone) {
        APP_SETTINGS.defaultLayout = "simple";
        $.each(APP_SETTINGS.navigation, function (i, item) { item.root = false; });
    }

    Globalize.culture("en-GB");

    $.ajaxSetup({
        timeout: 5000
    });

    // http://phonejs.devexpress.com/Blog/ios7-mobile-app-style-released
    function chooseIosTheme() {
        var devices = DevExpress.devices,
            iosVersion = devices.iosVersion();

        if(devices.current().platform === "ios" && iosVersion && iosVersion[0] === 7)  {
            $(".dx-viewport")
                .removeClass("dx-theme-ios")
                .addClass("dx-theme-ios7");
        }
    }

    $(function() {
        document.addEventListener("deviceready", function() {
            if (PropertyFinder.isWinPhone)
                document.addEventListener("backbutton", onBackKeyDown, false);
            navigator.splashscreen.hide();
        }, false);

        // Use one of the following lines to force a specific platform when viewing in a desktop browser
        // DevExpress.devices.current("iPhone");
        // DevExpress.devices.current("androidPhone");
        // DevExpress.devices.current("win8Phone");
        // DevExpress.devices.current("tizen");

        app = PropertyFinder.app = new DevExpress.framework.html.HtmlApplication(APP_SETTINGS);
        chooseIosTheme();
        app.router.register(":view/:id", { view: "Home", id: undefined });
        app.navigate();    
    });

}();


// MODULE: Integration with Nestoria API

!function() {
    var NESTORIA_API_ENDPOINT = "http://api.nestoria.co.uk/api",
        NESTORIA_PAGE_SIZE = 20;

    var nestoriaTotalCount = ko.observable(0),
        nestoriaSuggestions = ko.observableArray(),
        pageIndex = 1,
        nestoriaSearchOptions = {};

    function load(loadOptions) {
        var result = $.Deferred();

        if(loadOptions.refresh)
            pageIndex = 1;

        var ajaxOptions = {
            url: NESTORIA_API_ENDPOINT,
            dataType: 'jsonp',
            data: {
                encoding: "json",
                action: "search_listings",
                number_of_results: NESTORIA_PAGE_SIZE,
                place_name: nestoriaSearchOptions.searchText,
                centre_point: nestoriaSearchOptions.coordinates,
                page: pageIndex
            }
        };
        $.ajax(ajaxOptions)
            .done(function(data) {
                switch(Number(data.response.application_response_code)) {
                    case 100:
                    case 101:
                    case 110:
                        if(loadOptions.refresh && data.response.listings.length === 0) {
                            nestoriaTotalCount(0);
                            nestoriaSuggestions([]);
                            result.reject(Error("There were no properties found for the given location."));
                        } else {
                            nestoriaTotalCount(data.response.total_results);
                            nestoriaSuggestions([]);
                            pageIndex++;
                            result.resolve(data.response.listings);
                        }
                        break;

                    case 200:
                    case 202:
                        nestoriaTotalCount(0);
                        nestoriaSuggestions(data.response.locations);
                        result.resolve([]);
                        break;

                    case 210:
                        nestoriaTotalCount(0);
                        nestoriaSuggestions([]);
                        result.reject(Error("The location given was not recognised. My location only works if you're in the UK."));
                        break;

                    case 901:
                        result.reject([]);
                        break; 
                        
                    default:
                        nestoriaTotalCount(0);
                        nestoriaSuggestions([]);
                        result.reject(Error("The location given was not recognised."));
                        break;
                };
            })
            .fail(function() {
                nestoriaTotalCount(0);
                nestoriaSuggestions([]);
                result.reject(Error("An error occurred while searching. Please check your network connection and try again."));
            });

        return result.promise();
    }

    $.extend(PropertyFinder, {
        nestoriaTotalCount: nestoriaTotalCount,
        nestoriaSuggestions: nestoriaSuggestions,
        nestoriaSource: DevExpress.data.createDataSource({
            load: load
        }),
        nestoriaSearchOptions: nestoriaSearchOptions
    });

}();


// MODULE: additional local storages: favorites,recent searches, etc

!function() {
    var RECENT_SEARCHES_MAX_COUNT = 4,
        currentProperty = ko.observable(),
        FAVES_STORAGE_KEY = 'property-finder-recent',
        SEARCHES_STORAGE_KEY = 'property-finder-fav';


    var loadFavesFromStorage = function () {
        var rawFaves = localStorage.getItem(FAVES_STORAGE_KEY),
                          faves = JSON.parse(rawFaves || '[]');
        return faves;
    }
    var saveFavesToStorage = function () {
        localStorage.setItem(FAVES_STORAGE_KEY, JSON.stringify(faves()));
    }

    var faves = ko.observableArray(loadFavesFromStorage());


    ko.computed(function () {
        saveFavesToStorage();
    })


    var findFavedProperty = function (property) {
        if (!property)
            return null;
        var result = $.grep(faves(), function (item) {
            return item.guid === property.guid;
        });
        return result[0];
    }

    var recentSearchesSource = DevExpress.data.createDataSource({
        load: function (loadOptions) {
            if (loadOptions.refresh) {
                var rawSearches = localStorage.getItem(SEARCHES_STORAGE_KEY),
                    searches = JSON.parse(rawSearches || '[]');
                return searches;
            }
        }
    });

    function addToRecentSearches(name, searchText, coords, count) {
        var searches = recentSearchesSource.items(),
        record = {
            name: name,
            searchText: searchText,
            coords: coords,
            count: count,
            timestamp: $.now()
        },
        existingRecord = $.grep(searches, function (item) {
            return item.name.toLowerCase() === name.toLowerCase();
        });
        if (existingRecord[0]) {
            $.extend(existingRecord[0], record);
        } else {
            searches.push(record);
        }
        searches.sort(function (a, b) { return b.timestamp - a.timestamp; });
        if (searches.length > RECENT_SEARCHES_MAX_COUNT) {
            searches.pop();
        }
        localStorage.setItem(SEARCHES_STORAGE_KEY, JSON.stringify(searches));
        recentSearchesSource.reload();
    }

    $.extend(PropertyFinder, {
        currentProperty: currentProperty,
        faves: faves,
        findFavedProperty: findFavedProperty,
        recentSearchesSource: recentSearchesSource,
        addToRecentSearches: addToRecentSearches
    });

}();