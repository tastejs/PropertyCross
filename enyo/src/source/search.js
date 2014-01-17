enyo.kind({
	name: "SearchPage",
	kind: "FittableRows",

	events: {
		onGoResults: "",
		onGoFaves: ""
	},

	components: [
		{kind: "onyx.Toolbar", components: [
			{content: "PropertyCross", classes: "header-center"},
			{kind: "PC.Button", content: "Faves", classes:"header-button-right", ontap: "showFaves"}
		]},
		{classes: "panel-row", content: "Use the form below to search for houses to buy. You can search by place-name, postcode, or click 'My location', to search in your current location!"},
		{kind: "onyx.InputDecorator", classes: "input-wide panel-row", components: [
			{classes: "input-wide-box", components: [
				{name: "searchInput", kind: "enyo.Input", placeholder: "Search term", onkeypress: "searchInputKeypress"}
			]},
			{kind: "onyx.Icon", classes: "input-right", src: "assets/cancel.png", ontap: "clearSearchInput" }
		]},
		{classes: "panel-row", layoutKind: enyo.FittableColumnsLayout, noStretch: true, classes: "enyo-center", components: [
			{kind: "PC.Button", content: "Go", ontap: "search"},
			{kind: "PC.Button", content: "My location", ontap: "geolocate"}
		]},
		{name: "searchError", kind: "onyx.Drawer", open: false, classes: "panel-row error-drawer", components: [
			{name: "searchErrorContent", content: "There was a problem with your search."}
		]},
		{kind: "Panels", name:"searchBoxes", fit:true, realtimeFit: true, classes: "panel-row", style: "margin-bottom:20px", components: [
			{name: "recentBox", kind: "onyx.Groupbox", fit: true, layoutKind:"FittableRowsLayout", components: [
				{kind: "onyx.GroupboxHeader", content: "Recent searches"},
				{name: "recentList", kind: "List", fit: true, touch: true, onSetupItem: "setupRecentListItem", components: [
					{name: "item1", style: "font-size:20px;", classes: "item enyo-border-box", ontap: "recentListItemTap", components: [
						{name: "listItemRecent", classes: "recent"},
						{name: "listItemMatches", classes: "matches"}
					]}
				]}
			]},
			{name: "suggestedBox", kind: "onyx.Groupbox",  fit: true, layoutKind:"FittableRowsLayout", components: [
				{kind: "onyx.GroupboxHeader", content: "Suggested locations"},
				{name: "suggestedList", kind: "List", fit: true, touch: true, onSetupItem: "setupSuggestedListItem", components: [
					{name: "item2", style: "font-size:20px;", classes: "item enyo-border-box", ontap: "suggestedListItemTap", components: [
						{name: "listItemSuggested", classes: "recent"}
					]}
				]}
			]}
		]},
		{name: "searchingPopup", kind: "messagePopup", message: "Searching..."}
	],

	recentLocations: [],
	
	suggestedLocations: [],

	isGeolocation: false,

	create: function () {
		this.inherited(arguments);

		try {
			this.recentLocations = Storage.get("recent");
		}
		catch (e) {
			this.recentLocations = [];
		}

	},

	rendered: function() {
		this.inherited(arguments);
		this.$.searchBoxes.setIndex(0);

		this.$.recentList.setCount(this.recentLocations.length);
		this.$.recentList.refresh();
	},

	setupRecentListItem: function (inSender, inEvent) {
		var i = inEvent.index;
		this.$.item1.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
		this.$.listItemRecent.setContent(this.recentLocations[i].search);
		this.$.listItemMatches.setContent(this.recentLocations[i].matches);
	},

	recentListItemTap: function(inSender, inEvent) {
		var i = inEvent.index;
		if (this.recentLocations[i].isGeolocation) {
			this.geoProcess({coords: {latitude: this.recentLocations[i].latitude, longitude: this.recentLocations[i].longitude}});
		} else {
			this.$.searchInput.setValue(this.recentLocations[i].search);
			this.search();
		}
	},

	setupSuggestedListItem: function (inSender, inEvent) {
		var i = inEvent.index;
		this.$.item2.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
		this.$.listItemSuggested.setContent(this.suggestedLocations[i].title);
	},

	suggestedListItemTap: function (inSender, inEvent) {
		var i = inEvent.index;
		this.$.searchInput.setValue(this.suggestedLocations[i].title);
		this.search();
	},

	clearSearchInput: function() {
		this.$.searchInput.setValue("");
		this.showRecentList();
	},

	searchInputKeypress: function(inSender, inEvent) {
		if (inEvent.keyCode == 13) {
			this.search();
//			inSender.hasNode().blur();
		}
	},

	geoProcess: function(position) {
//		var latitude = 51.684183;
//	  var longitude = -3.431481;
		var latitude = position.coords.latitude;
	  var longitude = position.coords.longitude;
		enyo.log(">>>> Geolocating...");
		this.$.searchingPopup.show();
		this.isGeolocation = true;
		var jsonp = new enyo.JsonpRequest({url:"http://api.nestoria.co.uk/api", callbackName:"callback"});
		jsonp.response(this, "processResult");
		jsonp.error(this, "processError");
		jsonp.go({
		                pretty : '1',
		                action : 'search_listings',
		                encoding : 'json',
		                listing_type : 'buy',
		                'centre_point': latitude + "," + longitude
		            });
	},

	geoError: function(err) {
		this.showSearchError("Geolocation error: " + err.message);
		enyo.log(">>>>>> Geolocation error: " + err.code + " > " + err.message);
	},

	geolocate: function() {
		this.$.searchError.setOpen(false);

		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(enyo.bind(this, 'geoProcess'), enyo.bind(this, 'geoError'));
		} else {
			this.showSearchError("Geolocation not supported.");
		}
	},

	search: function() {
		this.log("DO A SEARCH");
		var searchVal = this.$.searchInput.getValue();
		if (searchVal.length) {
			enyo.log(">>>> Searching...");
			this.$.searchingPopup.show();
			this.isGeolocation = false;
			var jsonp = new enyo.JsonpRequest({url:"http://api.nestoria.co.uk/api", callbackName:"callback"});
			jsonp.response(this, "processResult");
			jsonp.error(this, "processError");
			jsonp.go({
			                pretty : '1',
			                action : 'search_listings',
			                encoding : 'json',
			                listing_type : 'buy',
			                'place_name': searchVal
			            });
		}
	},

	processError: function(inSender, inResponse) {
		this.$.searchingPopup.hide();
		this.showSearchError("An error occurred while searching. Please check your network connection and try again.");
	},

	processResult: function(inSender, inResponse) {
		this.$.searchingPopup.hide();

		this.searchResults = inResponse.response;
		var responseCode = this.searchResults.application_response_code;
		enyo.log(">>>> Response: " + responseCode);
		if (responseCode === "100" || responseCode === "101" || responseCode === "102") {
			enyo.log(">>>> Search results: " + this.searchResults.total_results);
			if (this.searchResults.total_results !== 0) {
				this.addToSearchHistory({search: this.searchResults.locations[0].title, longitude: this.searchResults.locations[0].center_long, latitude: this.searchResults.locations[0].center_lat, matches: this.searchResults.total_results, isGeolocation: this.isGeolocation});
			} else {
				this.showSearchError("There were no properties found for the given location.");
			}
			this.showRecentList();
			this.doGoResults({data: inResponse});
		} else if (responseCode === "200" || responseCode === "202") {
			enyo.log(">>>> Ambiguous search.");
			this.suggestedLocations = this.searchResults.locations;
			this.$.suggestedList.setCount(this.suggestedLocations.length);
			this.showSuggestedList();
		} else {
			enyo.log(">>>> Search error.");
			this.showSearchError("The location given was not recognised.");
//			this.showRecentList();
		}
	},

	addToSearchHistory: function(currentSearch) {
		this.recentLocations = this.recentLocations.filter(function(element, index, array) {
			return (element.search !== currentSearch.search);
		});

		this.recentLocations.unshift(currentSearch);

		if (this.recentLocations.length > 10 ) {
			this.recentLocations.pop();
		}

		this.$.recentList.setCount(this.recentLocations.length);
		this.$.recentList.refresh();

		try {
			Storage.set("recent", this.recentLocations);
		}
		catch (e) {
		}

	},

	showRecentList: function() {
		this.$.searchError.setOpen(false);
		this.$.searchBoxes.setIndex(0);
//		this.$.recentList.refresh();
	},

	showSuggestedList: function() {
		this.$.searchError.setOpen(false);
		this.$.searchBoxes.setIndex(1);
//		this.$.suggestedList.refresh();
	},

	showSearchError: function(msg) {
		if (msg.length === 0) {
			msg = "There was a problem with your search.";
		}

		this.$.searchErrorContent.setContent(msg);

		this.$.searchError.setOpen(true);
		this.$.searchBoxes.setIndex(0);
	},

	showFaves: function(inSender, inEvent) {
		this.doGoFaves({});
	}
});
