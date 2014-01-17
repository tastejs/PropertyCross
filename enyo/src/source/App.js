enyo.kind({
	name: "App",
	kind: "Panels",
	classes: "enyo-fit",
	components: [
		{kind: "SearchPage", name: "search", onGoResults: "showResults", onGoFaves: "showFaves"},
		{kind: "ResultsPage", name: "results", onGoBack: "showSearch", onGoListing: "showListingFromResults"},
		{kind: "ListingPage", name: "listing", onGoBack: "showListingSource", onChangeFav: "changeFav"},
		{kind: "FavoritesPage", name: "favorites", onGoBack: "showSearch", onGoListing: "showListingFromFavorites"}
	],

	SEARCH_PAGE: 0,
	RESULTS_PAGE: 1,
	LISTING_PAGE: 2,
	FAVORITES_PAGE: 3,

	listingSource: this.RESULTS_PAGE,

	showSearch: function() {
		this.setIndex(this.SEARCH_PAGE);
	},

	showResults: function(inSender, inEvent) {
		this.setIndex(this.RESULTS_PAGE);
		this.$.results.initialize(inEvent.data);
	},

	showListingFromResults: function(inSender, inEvent) {
		this.listingSource = this.RESULTS_PAGE;
		this.showListing(inSender, inEvent);
	},

	showListingFromFavorites: function(inSender, inEvent) {
		this.listingSource = this.FAVORITES_PAGE;
		this.showListing(inSender, inEvent);
	},

	showListing: function(inSender, inEvent) {
		this.setIndex(this.LISTING_PAGE);
		this.$.listing.initialize(inEvent.data);
		this.$.listing.setFavorite(this.$.favorites.isFavorite(inEvent.data.guid));
	},

	changeFav: function(inSender, inEvent) {
		this.$.favorites.changeFavorite(inEvent.data);
	},

	showFaves: function(inSender, inEvent) {
		this.setIndex(this.FAVORITES_PAGE);
		this.$.favorites.initialize();
	},

	showListingSource: function(inSender, inEvent) {
		if (this.listingSource === this.FAVORITES_PAGE) {
			this.showFaves(inSender, inEvent);
		} else {
			this.showResults(inSender, inEvent);
		}
	}
});
