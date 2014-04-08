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
			{kind: "PC.Button", classes:"back-button", ontap: "goBack"},
			{name: "resultsHeader", content: "Property Details"},
			{kind: "onyx.ToggleIconButton", name: "fav", classes:"header-button-right", src: "assets/fav.png", ontap: "changeFavorite"}
		]},
		{kind: "FittableRows", name: "resultsBox", classes: "content-panel", fit:true, components: [
			{name: "propertyPrice", allowHtml: "true", style: "font-size:26px"},
			{name: "propertyTitle"},
			{kind: "FittableColumns", classes: "enyo-center", components: [
				{kind: "enyo.Image", name: "propertyPhoto", classes: "listing-image"}
			]},
			{name: "propertyBedBath"},
			{name: "propertySummary"}
		]}
	],

	create: function () {
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

	rendered: function() {
		this.inherited(arguments);
		this.resized();
	},

	setFavorite: function(isFav) {
	 this.$.fav.setValue(isFav);
	},

	changeFavorite: function(inSender, inEvent) {
		this.doChangeFav({data: this.listing});
	}
});
