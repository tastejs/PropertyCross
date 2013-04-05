enyo.kind({
	name: "App",
	kind: "Panels",
	classes: "enyo-fit",
	components: [
		{kind: "SearchPage", name: "Search", onGoResults: "showResults", onGoFaves: "showFaves"},
		{kind: "ResultsPage", name: "Results", onGoBack: "showSearch", onGoListing: "showListingFromResults"},
		{kind: "ListingPage", name: "Listing", onGoBack: "showListingSource", onChangeFav: "changeFav"},
		{kind: "FavoritesPage", name: "Favorites", onGoBack: "showSearch", onGoListing: "showListingFromFavorites"}
	],

	listingSource: 1,

	showSearch: function() {
		this.setIndex(0);
	},

	showResults: function(inSender, inEvent) {
		this.setIndex(1);
		this.$.Results.initialize(inEvent.data);
	},

	showListingFromResults: function(inSender, inEvent) {
		this.listingSource = 1;
		this.showListing(inSender, inEvent);
	},

	showListingFromFavorites: function(inSender, inEvent) {
		this.listingSource = 3;
		this.showListing(inSender, inEvent);
	},

	showListing: function(inSender, inEvent) {
		this.setIndex(2);
		this.$.Listing.initialize(inEvent.data);
		this.$.Listing.setFavorite(this.$.Favorites.isFavorite(inEvent.data.guid));
	},

	changeFav: function(inSender, inEvent) {
		this.$.Favorites.changeFavorite(inEvent.data);
	},

	showFaves: function(inSender, inEvent) {
		this.setIndex(3);
		this.$.Favorites.initialize();
	},

	showListingSource: function(inSender, inEvent) {
		if (this.listingSource === 3) {
			this.showFaves(inSender, inEvent);
		} else {
			this.showResults(inSender, inEvent);
		}
	}
});
