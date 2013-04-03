enyo.kind({
	name: "ResultsPage",
	kind: "FittableRows",

	events: {
		onGoBack: "",
		onGoListing: ""
	},

	components: [
		{kind: "onyx.Toolbar", components: [
			{name: "resultsHeader", content: "X of X matches", classes: "header-center"},
			{kind: "onyx.Button", content: "Back", classes:"header-button-left", ontap: "goBack"}
		]},
		{name: "resultsError", kind: "onyx.Drawer", open: false, classes: "panel-row error-drawer", components: [
			{name: "resultsErrorContent", content: "There was a problem loading the listings."}
		]},
		{name: "resultsBox", kind: "onyx.Groupbox", classes: "panel-row", fit: true, layoutKind:"FittableRowsLayout", components: [
			{kind: "onyx.GroupboxHeader", content: "Found locations"},
			{name: "resultsList", kind: "List", fit: true, touch: true, onSetupItem: "setupResultsListItem", components: [
				{name: "item3", style: "font-size:20px;", classes: "item enyo-border-box", ontap: "resultsListItemTap", components: [
					{name: "listItemThumb", kind: "enyo.Image", style: "inline-block"},
					{style: "display:inline-block; margin-left:14px;", components: [
						{name: "listItemPrice", allowHtml: "true", style: "font-size:26px"},
						{name: "listItemTitle"}
					]}
				]}
			]}
		]},
		{name: "moreDrawer", kind: "onyx.Drawer", open: false, components: [
			{name: "moreButton", kind: "onyx.Button", style: "display:block;margin-left:20px;margin-bottom:20px;", showing: false, content: "Load more...", onclick: "getMoreListings"}
		]},

		{name: "loadingPopup", style: "text-align:center", kind: "onyx.Popup", centered: true, floating: true, scrim: true, components: [
			{kind: "onyx.Spinner"},
			{content: "Loading...", style: "margin:12px"}
		]}
	],

	listings: [],
	listingsPage: {},

	create: function () {
		this.inherited(arguments);
	},

	rendered: function() {
		this.inherited(arguments);
	},

	goBack: function() {
		this.doGoBack();
	},

	initialize: function(json) {
		if (typeof json.response !== "undefined") {
			this.listingsPage = json;
			this.listings = [];
			this.processResponse(json);
		}
	},

	processResponse: function(json) {
		this.$.resultsHeader.setContent(json.request.offset + json.response.listings.length + " of " + json.response.total_results + " matches");

		this.listings = this.listings.concat(json.response.listings);
		this.$.resultsList.setCount(this.listings.length);
		this.$.resultsList.refresh();

		this.$.moreDrawer.setOpen(json.request.page < json.response.total_pages);
	},

	setupResultsListItem: function(inSender, inEvent) {
		var i = inEvent.index;
		this.$.item3.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
		this.$.listItemThumb.setAttribute('src', this.listings[i].thumb_url);
		this.$.listItemPrice.setContent("&pound;" + numberWithCommas(this.listings[i].price));
		this.$.listItemTitle.setContent(this.listings[i].title);
	},

	getMoreListings: function() {
		this.$.loadingPopup.show();

		this.listingsPage.request.page++;

		var jsonp = new enyo.JsonpRequest({url:"http://api.nestoria.co.uk/api", callbackName:"callback"});
		jsonp.response(this, "moreResult");
		jsonp.error(this, "moreError");
		jsonp.go({
			pretty : '1',
			action : 'search_listings',
			encoding : 'json',
			listing_type : 'buy',
			'place_name': this.listingsPage.request.location,
			'page': this.listingsPage.request.page
		});
		},

	moreError: function(inSender, inResponse) {
		this.$.loadingPopup.hide();

		console.log(">>>> More error.");
//		this.showSearchError("An error occurred while searching. Please check your network connection and try again.");
	},

	moreResult: function(inSender, inResponse) {
		this.$.loadingPopup.hide();

		this.listingsPage = inResponse;
		var responseCode = this.listingsPage.response.application_response_code;
		console.log(">>>> Response: " + responseCode);
		if (responseCode === "100" || responseCode === "101" || responseCode === "102") {
			console.log(">>>> More results.");
			this.processResponse(inResponse);
		} else {
			console.log(">>>> More error.");
		}
	},

	resultsListItemTap: function(inSender, inEvent) {
		var i = inEvent.index;
		this.doGoListing(this.listings[i]);
	}
});
