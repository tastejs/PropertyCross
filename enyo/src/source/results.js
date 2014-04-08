enyo.kind({
	name: "ResultsPage",
	kind: "FittableRows",

	events: {
		onGoBack: "",
		onGoListing: ""
	},

	components: [
		{kind: "onyx.Toolbar", components: [
			{kind: "PC.Button", classes:"back-button", ontap: "goBack"},
			{name: "resultsHeader", content: "X of X matches"}
		]},
		{kind: "FittableRows", name: "resultsContent", classes: "content-panel", fit:true, components: [
			{kind: "onyx.Drawer", name: "resultsError", open: false, classes: "error-drawer", components: [
				{name: "resultsErrorContent", content: "There was a problem loading the listings."}
			]},
			{kind: "onyx.Groupbox", name: "resultsBox", fit: true, layoutKind:"FittableRowsLayout", style: "border: none !important;", components: [
				{kind: "onyx.GroupboxHeader", content: "Found locations"},
				{kind: "List", name: "resultsList", fit: true, touch: true, onSetupItem: "setupResultsListItem", components: [
					{name: "item3", classes: "list-item-with-image enyo-border-box", ontap: "resultsListItemTap", components: [
						{kind: "enyo.Image", name: "listItemThumb"},
						{name: "listItemPrice", classes: "list-item-title", allowHtml: "true"},
						{name: "listItemTitle", classes: "list-item-subtitle"}
					]},
					{name:"more", components: [
						{kind: "PC.Button", name: "moreButton", content: "Load more...", style: "margin-left:20px;margin-bottom:20px;", ontap: "getMoreListings"}
					]}
				]}
			]}
		]},

		{kind: "messagePopup",name: "loadingPopup",  message: "Loading..."}
	],

	listings: [],
	listingsPage: {},
	morePages: false,

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
		this.listings = this.listings.concat(json.response.listings);
		this.morePages = json.request.page < json.response.total_pages;

		this.$.resultsList.setCount(this.listings.length);

		if(json.request.page == 1) {
			this.$.resultsList.reset();
		} else {
			this.$.resultsList.refresh();
		}

		this.$.resultsHeader.setContent(this.listings.length + " of " + json.response.total_results + " matches");

	},

	setupResultsListItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var itemData = this.listings[i];
		this.$.item3.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
		this.$.listItemThumb.setAttribute('src', itemData.thumb_url);
		this.$.listItemPrice.setContent("&pound;" + Utils.numberWithCommas(itemData.price));
		this.$.listItemTitle.setContent(itemData.title);
		this.$.more.canGenerate = !this.listings[i+1] && this.morePages;
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

		enyo.log(">>>> More error.");
//		this.showSearchError("An error occurred while searching. Please check your network connection and try again.");
	},

	moreResult: function(inSender, inResponse) {
		this.$.loadingPopup.hide();

		this.listingsPage = inResponse;
		var responseCode = this.listingsPage.response.application_response_code;
		enyo.log(">>>> Response: " + responseCode);
		if (responseCode === "100" || responseCode === "101" || responseCode === "102") {
			enyo.log(">>>> More results.");
			this.processResponse(inResponse);
		} else {
			enyo.log(">>>> More error.");
		}
	},

	resultsListItemTap: function(inSender, inEvent) {
		var i = inEvent.index;
		this.doGoListing({data: this.listings[i]});
	}
});
