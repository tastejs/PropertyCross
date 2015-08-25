"use strict";


// MODULE: Application bootstrap

!function() {
    var app,
        APP_SETTINGS,
        PropertyFinder = window.PropertyFinder = {};

    PropertyFinder.views = {};

    Globalize.culture("en-GB");

    $.ajaxSetup({
        timeout: 5000
    });

    $(function () {

        // Use one of the following lines to force a specific platform when viewing in a desktop browser

        // DevExpress.devices.current({ platform: "ios" });
        // DevExpress.devices.current({ platform: "win8" });
        // DevExpress.devices.current({ platform: "android" });
        // DevExpress.devices.current({ platform: "generic" });

        var device = DevExpress.devices.current();
        PropertyFinder.isWinPhone = device.platform === "win8" && device.phone;

        $(document).on("deviceready", function () {
            navigator.splashscreen.hide();
            if(window.devextremeaddon) {
                window.devextremeaddon.setup();
            }
            $(document).on("backbutton", function () {
                DevExpress.processHardwareBackButton();
            });
        });

        function onNavigatingBack(e) {
            if(e.isHardwareButton && !PropertyFinder.app.canBack()) {
                e.cancel = true;
                exitApp();
            }
        }

        function exitApp() {
            switch(DevExpress.devices.real().platform) {
                case "tizen":
                    tizen.application.getCurrentApplication().exit();
                    break;
                case "android":
                    navigator.app.exitApp();
                    break;
                case "win8":
                    window.external.Notify("DevExpress.ExitApp");
                    break;
            }
        }

        APP_SETTINGS = {
            namespace: PropertyFinder.views,

            layoutSet: DevExpress.framework.html.layoutSets["navbar"],
            navigation: [
                {
                    title: "Home",
                    onExecute: "#Home",
                    icon: "home"
                },
                {
                    title: "Favorites",
                    onExecute: "#Faves",
                    icon: "favorites"
                },
                {
                    title: "About",
                    onExecute: "#About",
                    icon: "info"
                }
            ],
            commandMapping: {
                "generic-header-toolbar": {
                    "commands": [
                      { id: "addToFav", location: "after" }
                    ]
                },
                "ios-header-toolbar": {
                    "commands": [
                      { id: "addToFav", location: "after" }
                    ]
                },
                "android-simple-toolbar": {
                    "commands": [
                      { id: "addToFav", location: "after" }
                    ]
                },
                "win8-phone-appbar": {
                    "commands": [
                        { id: "addToFav", location: "center" },
                        { id: "goToFav", location: "center" },
                        { id: "goToAbout", location: "center" }
                    ]
                }
            }
        };

        if(PropertyFinder.isWinPhone) 
            APP_SETTINGS.layoutSet = DevExpress.framework.html.layoutSets["simple"];

        app = PropertyFinder.app = new DevExpress.framework.html.HtmlApplication(APP_SETTINGS);
        app.router.register(":view/:location/:coordinates", { view: "Home", location: undefined, coordinates: undefined });
        app.on("navigatingBack", onNavigatingBack);
        app.navigate();    
    });

}();


// MODULE: Integration with Nestoria API

!function() {
    var NESTORIA_API_ENDPOINT = "http://api.nestoria.co.uk/api",
        NESTORIA_PAGE_SIZE = 20;

    var nestoriaTotalCount = ko.observable(0),
        nestoriaSuggestions = ko.observableArray(),
        nestoriaSearchOptions = {};

    function load(loadOptions) {
        var result = $.Deferred(),
            pageIndex = loadOptions.skip / NESTORIA_PAGE_SIZE + 1;

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
                            nestoriaTotalCount.notifySubscribers();
                            nestoriaSuggestions([]);
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
        nestoriaSource: new DevExpress.data.DataSource({
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

    var recentSearchesSource = new DevExpress.data.DataSource({
        load: function (loadOptions) {
            var rawSearches = localStorage.getItem(SEARCHES_STORAGE_KEY),
                searches = JSON.parse(rawSearches || '[]');
            return searches;
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
        recentSearchesSource.load();
    }

    recentSearchesSource.load();

    $.extend(PropertyFinder, {
        currentProperty: currentProperty,
        faves: faves,
        findFavedProperty: findFavedProperty,
        recentSearchesSource: recentSearchesSource,
        addToRecentSearches: addToRecentSearches
    });

}();