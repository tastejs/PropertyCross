enyo.kind({
	name: "App",
	kind: "Panels",
	classes: "enyo-fit",
	components: [
		{kind: "SearchPage", name: "Search", onGoResults: "showResults"},
		{kind: "ResultsPage", name: "Results", onGoBack: "showSearch"}
	],

	showSearch: function() {
		this.setIndex(0);
	},

	showResults: function() {
		this.setIndex(1);
	}
});
