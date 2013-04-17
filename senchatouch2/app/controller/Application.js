Ext.define('PropertyFinder.controller.Application', {
    extend: 'Ext.app.Controller',

    requires: ['Ext.device.Geolocation', 'Ext.MessageBox'],

    config: {
        refs: {
            main: 'mainview',
            home: 'home',
            mainTitleBar: 'mainview titlebar',
            faveButton: '#faveButton',
            resultList: 'resultlist',
            favesList: 'resultlist',
            resultdetails: 'resultdetails',
            locationField: '#placeNameText',
            goButton: '#goButton',
            currLocationButton: '#currLocationButton',
            listFavesButton: '#listFavesButton',
            errorMessage: '#errorMessage',
            previousSearches: '#previousSearches',
            didYouMean: '#didYouMean',
            listTitleLabel: '#listTitleLabel'
        },

        control: {
            main: {
                push: 'onMainPush',
                pop: 'onMainPop'
            },
            home: {
                show: 'resetHome'
            },
            mainTitleBar: {
                back: 'onBack'
            },
            faveButton: {
                tap: 'onFaveTap'
            },
            resultList: {
                itemtap: 'onResultSelect'
            },
            goButton: {
                tap: 'onGo'
            },
            locationField: {
                action: 'onLocationEnter'
            },
            currLocationButton: {
                tap: 'onCurrLocation'
            },
            listFavesButton: {
                tap: 'onListFaves'
            },
            previousSearches: {
                itemtap: 'onPreviousSearches'
            },
            didYouMean: {
                itemtap: 'onDidYouMean'
            }
        }
    },

    init: function() {
        /* pop a view when the back button is pressed
           note: if it's aleady at the root it's a noop */
        var that = this;
        window.onpopstate = function() {
            that.getMain().pop();
        };
    },

    resetHome: function() {
        this.getDidYouMean().hide();
        this.getErrorMessage().hide();
        this.getPreviousSearches().show();
        var titleListLabel = this.getListTitleLabel()
        if(Ext.getStore('searches').getData().length !== 0) {
            titleListLabel.setHtml("Previous Searches");
            titleListLabel.show();
        } else {
            titleListLabel.hide();
        }
    },

    onBack: function() {
        history.back();
        //prevent back button popping main view directly..
        return false;
    },

    onMainPush: function(view, item) {
        if (item.xtype === 'resultdetails') {
            this.showButton(this.getFaveButton());
        } else {
            this.hideButton(this.getFaveButton());
        }
        this.hideButton(this.getListFavesButton());

        //push state so back button will work..
        history.pushState(null, "");
    },

    onMainPop: function(view, item) {
        this.hideButton(this.getFaveButton());
        if (item.xtype === 'resultlist') {
            this.showButton(this.getListFavesButton());
        }
    },

    onResultSelect: function(list, index, node, record) {
        //lazy initialise result details view..
        if (!this.resultDetails) {
            this.resultDetails = Ext.create('PropertyFinder.view.ResultDetails');
        }

        // Bind the record onto the show contact view
        this.resultDetails.setRecord(record);

        //Sort out the fave button..
        var store = Ext.getStore('favourites');
        store.load();
        var me = this;
        var faveButton = this.getFaveButton();
        me.getFaveButton().removeCls('faveProperty');
        Ext.each(store.getData().items, function(item, index) {
            if(item && record.getData().guid === item.getData().guid) {
                me.getFaveButton().addCls('faveProperty');
            }
        });
        this.getMain().push(this.resultDetails);
    },

    goToResultsList: function(values) {
        var store =  Ext.getStore('results');
        if (!this.resultList) {
            this.resultList = Ext.create('PropertyFinder.view.ResultList', {store: store});
        }

        var extraParams = store.getProxy().getExtraParams();
        store.currentPage = 1;
        //Note: place_name takes precedence if defined and non-null..
        extraParams.place_name = values.place_name;
        extraParams.centre_point = values.centre_point && this.formatCoord(values.centre_point);

        this.prepareResultsList(this.resultList);
    },

    prepareResultsList: function(list) {
        //add loading mask
        Ext.Viewport.setMasked({
           xtype: 'loadmask',
           message: 'Loading...',
           indicator: true
        });

        var store = list.getStore();
        var that = this;

        var onStoreLoad = function() {
           Ext.Viewport.setMasked(false);
           that.getMain().push(list);
           store.removeListener('load', onStoreLoad);
        };

        //remove mask and push list onto main after store has finished loading
        store.on('load', onStoreLoad);

        store.load();

        list.deselectAll();
        this.resetHome();
    },

    onCurrLocation: function(button, event, opts) {
        var that = this;
        Ext.device.Geolocation.getCurrentPosition({
            timeout: 5000, // timeout in 5s (default: not documented)
            maximumAge: 60000, // allow caching location for 1m (default: none)
            success: function (position) {
                // Must make a request to get count for this position - and show error if 0.
                that.makeRequest({ centre_point: position.coords });
            },
            failure: function() {
                //Note: doesn't differentiate between user disabled and location not found.
                that.getErrorMessage().setHtml("Unable to detect current location. Please ensure location is turned on in your phone settings and try again");
                that.getErrorMessage().show();
            }
        });
    },

    formatCoord: function(coords, precision) {
        var lat = precision ? coords.latitude.toFixed(precision) : coords.latitude;
        var lon = precision ? coords.longitude.toFixed(precision) : coords.longitude;
        return lat + "," + lon;
    },

    onDidYouMean: function(list, index, node, record) {
        this.makeRequest(record.getData());

        this.resetHome();
    },

    onPreviousSearches: function(list, index, node, record) {
        this.makeRequest(record.getData());

        //Note: this seems odd but apparently you need to do this on timeout..
        Ext.defer(function(){
            list.deselect(index);
        }, 200);
    },

    addToPreviousSearches: function(placeName, centre_point, displayName, totalResults) {
        var searches = Ext.getStore('searches');

        // Place name is well defined even when searching for location - still use that as a key

        //sort out previous searches..
        var oldModel = searches.findRecord('place_name', placeName, 0, false, true, true);
        if(oldModel){
            searches.remove(oldModel);
        } else {
            var numResults = searches.getData().length;
            if(numResults >= 4){
                searches.removeAt(numResults - 1);
            }
        }
        searches.add({
            display_name: centre_point ? this.formatCoord(centre_point, 2) : displayName,
            place_name: placeName,
            centre_point: centre_point,
            count: totalResults,
            searchTimeMS: new Date().getTime()
        });

        searches.sync();

        this.getListTitleLabel().show(); //hidden if zero results - so need to show
    },

    makeRequest: function(values) {
        var that = this;

        //need to make initial request to see if it's valid..
        //TODO: figure out a better way of doing this so that we only need to make a single request!
        Ext.data.JsonP.request({
            url: 'http://api.nestoria.co.uk/api',
            callbackKey: 'callback',
            params: {
                pretty : '1',
                action : 'search_listings',
                encoding : 'json',
                listing_type : 'buy',
                number_of_results: 1, //the minimum..
                place_name: values.place_name,
                centre_point: values.centre_point && this.formatCoord(values.centre_point)
            },
            success: function(result, request) {
                var response = result.response;
                var responseCode = response.application_response_code;

                //one unambiguous location..
                if(responseCode === "100" || /* one unambiguous location */
                        responseCode === "101" || /* best guess location */
                        responseCode === "110" /* large location, 1000 matches max */) {
                    //place_name is both display and search name for previous searches

                    if(response.listings.length === 0) {
                        that.getErrorMessage().setHtml("There were no properties found for the given location.");
                        that.getErrorMessage().show();
                    } else {
                        that.addToPreviousSearches(response.locations[0].place_name, values.centre_point, response.locations[0].long_title, response.total_results);
                        that.goToResultsList(values);
                    }
                } else  if(responseCode === "201" || /* unknown location */
                        responseCode === "210" /* coordinate error */) {
                    that.getErrorMessage().setHtml("The location given was not recognised.");
                    that.getErrorMessage().show();
                } else {
                    //have a go at displaying "did you mean" locations
                    if(response.locations) {
                        var didYouMeanList = that.getDidYouMean();
                        didYouMeanList.getStore().setData(response.locations);

                        that.getListTitleLabel().setHtml("Did you mean?");
                        that.getListTitleLabel().show();

                        that.getPreviousSearches().hide();
                        didYouMeanList.show();
                    } else {
                        that.getErrorMessage().setHtml("The location given was not recognised.");
                        that.getErrorMessage().show();
                    }
                }
            },
            failure: function() {
                that.getErrorMessage().setHtml("An error occurred while searching. Please check your network connection and try again.");
                that.getErrorMessage().show();
            }
        });
    },

    performSearch: function(elt) {
        this.resetHome();
        var values = elt.up('formpanel').getValues();
        this.makeRequest(values);
    },

    onGo: function(button, event, opts) {
        this.performSearch(button);
    },

    onLocationEnter: function(textField, event, opts) {
        this.performSearch(textField);
    },

    onFaveTap: function() {
        var record = this.resultDetails.getRecord();
        var store = Ext.getStore('favourites');
        var faveButton = this.getFaveButton();
        var found = false;
        var recordGuid = record.getData().guid;
        var me = this;

        Ext.each(store.getData().items, function(item, index) {
            if(item && recordGuid === item.getData().guid) {
                //Note: store.remove doesn't mark record "dirty" so add/remove/add
                //      then sync doesn't work - we manually mark it instead..
                record.dirty = true;
                store.remove(item);
                found = true;
                faveButton.removeCls('faveProperty');
                return false; //break..
            }
        });
        if(!found) {
            store.add(record);
            faveButton.addCls('faveProperty');
        }
        //Note: sync won't fire refresh on list so we'll load again afterwards..
        store.sync();
        faveButton.setDisabled(true);
        store.load(function() {
            faveButton.setDisabled(false);
        });
    },

    onListFaves: function() {
        if (!this.favesList) {
            this.favesList = Ext.create('PropertyFinder.view.ResultList', {
                store: Ext.getStore('favourites'),
                title: 'Favourites',
                id: 'favouritesList',
                emptyText: 'You have not added any properties to your favourites'
            });
        }
        this.prepareResultsList(this.favesList);
    },

    showButton: function(button) {
        if (!button.isHidden()) {
            return;
        }
        button.show();
    },

    hideButton: function(button) {
        if (button.isHidden()) {
            return;
        }
        button.hide();
    }
});
