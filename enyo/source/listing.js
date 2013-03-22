enyo.kind({
	name: "ListingPage",
	kind: "FittableRows",

	events: {
		onGoBack: ""
	},

	components: [
		{kind: "onyx.Toolbar", components: [
			{name: "resultsHeader", content: "Property Details", classes: "header-center"},
			{kind: "onyx.Button", content: "Back", classes:"header-button-left", ontap: "goBack"}
		]},
		{name: "resultsBox", fit: true, layoutKind:"FittableRowsLayout", components: [
			{name: "propertyPrice", allowHtml: "true", style: "font-size:26px", classes: "panel-row"},
			{name: "propertyTitle", classes: "panel-row"},
			{name: "propertyPhoto", kind: "enyo.Image", style: "display:block", classes: "panel-row"},
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
		this.doGoBack({});
	},

	initialize: function(json) {
		if (json !== {}) {
			this.$.propertyPhoto.setAttribute('src', json.img_url);
			this.$.propertyPrice.setContent("&pound;" + numberWithCommas(json.price));
			this.$.propertyTitle.setContent(json.title);
			this.$.propertyBedBath.setContent(json.bedroom_number + " bed, " + json.bathroom_number + " bath");
			this.$.propertySummary.setContent(json.summary);
		}
	}
});
