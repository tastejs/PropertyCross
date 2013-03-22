enyo.kind({
	name: "App",
	kind: "Panels",
	classes: "enyo-fit",
	components: [
		{kind: "SearchPage", name: "Search", onGoResults: "showResults"},
		{kind: "ResultsPage", name: "Results", onGoBack: "showSearch", onGoListing: "showListing"},
		{kind: "ListingPage", name: "Listing", onGoBack: "showResults"}
	],

	showSearch: function() {
		this.setIndex(0);
	},

	showResults: function(inSender, inEvent) {
		this.setIndex(1);
		this.$.Results.initialize(inEvent);
	},

	showListing: function(inSender, inEvent) {
		this.setIndex(2);
		this.$.Listing.initialize(inEvent);
	}
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
