enyo.kind({
	name: "ListingPage",
	kind: "FittableRows",

	events: {
		onGoBack: "",
		onChangeFav: ""
	},

	listing: {},

	components: [
		{kind: "onyx.Toolbar", components: [
			{name: "resultsHeader", content: "Property Details", classes: "header-center"},
			{kind: "PC.Button", classes:"header-button-left back-button", ontap: "goBack"},
			{name: "fav", kind: "onyx.ToggleIconButton", src: "assets/fav.png", classes:"header-button-right", ontap: "changeFavorite"}
		]},
		{name: "resultsBox", fit: true, layoutKind:"FittableRowsLayout", components: [
			{name: "propertyPrice", allowHtml: "true", style: "font-size:26px", classes: "panel-row"},
			{name: "propertyTitle", classes: "panel-row"},
			{name: "propertyPhoto", kind: "enyo.Image", classes: "listing-image panel-row"},
			{name: "propertyBedBath", classes: "panel-row"},
			{name: "propertySummary", classes: "panel-row"}
		]}
	],

	create: function () {
		this.inherited(arguments);
	},

	rendered: function() {
		this.inherited(arguments);
	},

	goBack: function() {
		this.doGoBack({data: {}});
	},

	initialize: function(json) {
		if (json !== {}) {
			this.listing = json;
			this.$.propertyPhoto.setSrc('assets/home-b-160x120.png');
			this.$.propertyPhoto.setSrc(json.img_url);
			this.$.propertyPrice.setContent("&pound;" + Utils.numberWithCommas(json.price));
			this.$.propertyTitle.setContent(json.title);
			this.$.propertyBedBath.setContent(json.bedroom_number + " bed, " + json.bathroom_number + " bath");
			this.$.propertySummary.setContent(json.summary);
		}
	},

	setFavorite: function(isFav) {
	 this.$.fav.setValue(isFav);
	},

	changeFavorite: function(inSender, inEvent) {
		this.doChangeFav({data: this.listing});
	}
});
