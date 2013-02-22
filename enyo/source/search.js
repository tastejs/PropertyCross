enyo.kind({
	name: "SearchPage",
	kind: "FittableRows",
	components: [
		{kind: "onyx.Toolbar", components: [
			{content: "PropertyCross", classes: "header-center"},
			{kind: "onyx.Button", content: "Faves", classes:"header-button-right"}
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
		{name: "recentBox", kind: "onyx.Groupbox", classes: "panel-row", style: "margin-bottom:20px", fit: true, layoutKind:"FittableRowsLayout", components: [
			{kind: "onyx.GroupboxHeader", content: "Recent searches"},
			{name: "recentList", kind: "List", fit: true, touch: true, onSetupItem: "setupRecentListItem", components: [
				{name: "item", style: "font-size:20px;", classes: "item enyo-border-box", ontap: "recentListItemTap", components: [
					{name: "listItemRecent", classes: "recent"},
					{name: "listItemMatches", classes: "matches"}
				]}
			]}
		]},
		{name: "suggestedBox", kind: "onyx.Groupbox", classes: "panel-row", style: "margin-bottom:20px", fit: true, layoutKind:"FittableRowsLayout", components: [
			{kind: "onyx.GroupboxHeader", content: "Suggested locations"},
			{name: "suggestedList", kind: "List", fit: true, touch: true, onSetupItem: "setupSuggestedListItem", components: [
				{name: "item", style: "font-size:20px;", classes: "item enyo-border-box", ontap: "suggestedListItemTap", components: [
					{name: "listItemSuggested", classes: "recent"}
				]}
			]}
		]},
		{name: "searchError", showing: false, classes: "panel-row", components: [
			{content: "There was a problem with your search."}
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

	setupRecentListItem: function (inSender, inEvent) {
		var i = inEvent.index;
		this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
		this.$.listItemRecent.setContent(this.recentLocations[i].search);
		this.$.listItemMatches.setContent(this.recentLocations[i].matches);
	},

	setupSuggestedListItem: function (inSender, inEvent) {
		var i = inEvent.index;
		this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
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
			jsonp.go({
			                pretty : '1',
			                action : 'search_listings',
			                encoding : 'json',
			                listing_type : 'buy',
			                number_of_results: 1, //the minimum..
			                'place_name': searchVal
			            });
		}
	},

	processResult: function(inSender, inResponse) {
		this.$.searchingPopup.hide();

		this.searchResults = inResponse.response;
		var responseCode = this.searchResults.application_response_code;
		console.log(">>>> Response: " + responseCode);
		switch (responseCode) {
			case "100":
			case "101":
			case "102":
				console.log(">>>> Search results: " + this.searchResults.total_results);
				this.addToSearchHistory({search: this.searchResults.locations[0].title, matches: this.searchResults.total_results});
				this.showRecentList();
		    break;
			case "200":
			case "202":
		  	console.log(">>>> Ambiguous search.");
				this.suggestedLocations = this.searchResults.locations;
				this.$.suggestedList.setCount(this.suggestedLocations.length);
				this.showSuggestedList();
		    break;
		  default:
		    console.log(">>>> Search error.");
				this.showSearchError();
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
		this.$.searchError.setShowing(false);
		this.$.suggestedBox.setShowing(false);
		this.$.recentBox.setShowing(true);
		this.$.recentList.refresh();
	},

	showSuggestedList: function() {
		this.$.searchError.setShowing(false);
		this.$.suggestedBox.setShowing(true);
		this.$.suggestedList.refresh();
		this.$.recentBox.setShowing(false);
	},

	showSearchError: function() {
		this.$.searchError.setShowing(true);
		this.$.suggestedBox.setShowing(false);
		this.$.recentBox.setShowing(false);
	}
});
