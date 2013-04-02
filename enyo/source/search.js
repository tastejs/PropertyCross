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
			{kind: "onyx.Button", content: "Faves", classes:"header-button-right", ontap: "showFaves"}
		]},
		{classes: "panel-row", content: "Use the form below to search for houses to buy. You can search by place-name, postcode, or click 'My location', to search in your current location!"},
		{kind: "onyx.InputDecorator", classes: "input-wide panel-row", components: [
			{classes: "input-wide-box", components: [
				{name: "searchInput", kind: "enyo.Input", placeholder: "Search term", onkeypress: "searchInputKeypress"}
			]},
			{kind: "onyx.Icon", classes: "input-right", src: "assets/cancel.png", ontap: "clearSearchInput" }
		]},
		{classes: "panel-row", components: [
			{kind: "onyx.Button", content: "Go", onclick: "search"},
			{kind: "onyx.Button", content: "My location"}
		]},
		{name: "searchError", kind: "onyx.Drawer", open: false, classes: "panel-row error-drawer", components: [
			{name: "searchErrorContent", content: "There was a problem with your search."}
		]},
		{kind: "Panels", name:"searchBoxes", fit:true, realtimeFit: true, classes: "panel-row", style: "margin-bottom:20px", components: [
			{name: "recentBox", kind: "onyx.Groupbox", style: "background-color: yellow", fit: true, layoutKind:"FittableRowsLayout", components: [
				{kind: "onyx.GroupboxHeader", content: "Recent searches"},
				{name: "recentList", kind: "List", fit: true, touch: true, onSetupItem: "setupRecentListItem", components: [
					{name: "item1", style: "font-size:20px;", classes: "item enyo-border-box", ontap: "recentListItemTap", components: [
						{name: "listItemRecent", classes: "recent"},
						{name: "listItemMatches", classes: "matches"}
					]}
				]}
			]},
			{name: "suggestedBox", kind: "onyx.Groupbox",  style: "background-color: pink", fit: true, layoutKind:"FittableRowsLayout", components: [
				{kind: "onyx.GroupboxHeader", content: "Suggested locations"},
				{name: "suggestedList", kind: "List", fit: true, touch: true, onSetupItem: "setupSuggestedListItem", components: [
					{name: "item2", style: "font-size:20px;", classes: "item enyo-border-box", ontap: "suggestedListItemTap", components: [
						{name: "listItemSuggested", classes: "recent"}
					]}
				]}
			]}
		]},
		{name: "searchingPopup", style: "text-align:center", kind: "onyx.Popup", centered: true, floating: true, scrim: true, components: [
			{kind: "onyx.Spinner"},
			{content: "Searching...", style: "margin:12px"}
		]}
	],

	recentLocations: [],
	
	suggestedLocations: [],

	create: function () {
		this.inherited(arguments);
	},

	rendered: function() {
		this.inherited(arguments);
		this.$.searchBoxes.setIndex(0);
	},

	setupRecentListItem: function (inSender, inEvent) {
		var i = inEvent.index;
		this.$.item1.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
		this.$.listItemRecent.setContent(this.recentLocations[i].search);
		this.$.listItemMatches.setContent(this.recentLocations[i].matches);
	},

	recentListItemTap: function(inSender, inEvent) {
		var i = inEvent.index;
		this.$.searchInput.setValue(this.recentLocations[i].search);
		this.search();
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

	search: function() {
		var searchVal = this.$.searchInput.getValue();
		if (searchVal.length) {
			console.log(">>>> Searching...");
			this.$.searchingPopup.show();
			var jsonp = new enyo.JsonpRequest({url:"http://api.nestoria.co.uk/api", callbackName:"callback"});
			jsonp.response(this, "processResult");
			jsonp.error(this, "processError");
			jsonp.go({
			                pretty : '1',
			                action : 'search_listings',
			                encoding : 'json',
			                listing_type : 'buy',
//			                number_of_results: 1,
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
		console.log(">>>> Response: " + responseCode);
		if (responseCode === "100" || responseCode === "101" || responseCode === "102") {
			console.log(">>>> Search results: " + this.searchResults.total_results);
			if (this.searchResults.total_results !== 0) {
				this.addToSearchHistory({search: this.searchResults.locations[0].title, matches: this.searchResults.total_results});
			} else {
				this.showSearchError("There were no properties found for the given location.");
			}
			this.showRecentList();
			this.doGoResults(inResponse);
		} else if (responseCode === "200" || responseCode === "202") {
			console.log(">>>> Ambiguous search.");
			this.suggestedLocations = this.searchResults.locations;
			this.$.suggestedList.setCount(this.suggestedLocations.length);
			this.showSuggestedList();
		} else {
			console.log(">>>> Search error.");
			this.showSearchError("The location given was not recognised.");
			this.showRecentList();
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
