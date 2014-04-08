enyo.kind({
	name: "FavoritesPage",
	kind: "FittableRows",

	events: {
		onGoBack: "",
		onGoListing: ""
	},

	components: [
		{kind: "onyx.Toolbar", components: [
			{kind: "PC.Button", classes:"back-button", ontap: "goBack"},
			{name: "favoritesHeader", content: "Favorites"}
		]},
		{kind: "FittableRows", classes: "content-panel", fit:true, components: [
			{kind: "onyx.Drawer", name: "favoritesError", classes: "error-drawer", open: false, components: [
				{name: "favoritesErrorContent", content: "There was a problem loading the listings."}
			]},
			{name: "favoritesBox", kind: "onyx.Groupbox", layoutKind:"FittableRowsLayout", fit: true, components: [
				{kind: "onyx.GroupboxHeader", content: "Properties"},
				{kind: "List", name: "favoritesList", fit: true, touch: true, onSetupItem: "setupFavoritesListItem", components: [
					{name: "item4", classes: "list-item-with-image enyo-border-box", ontap: "favoritesListItemTap", components: [
						{kind: "enyo.Image", name: "listItemThumb"},
						{name: "listItemPrice", classes: "list-item-title", allowHtml: "true"},
						{name: "listItemTitle", classes: "list-item-subtitle"}
					]}
				]}
			]}
		]},
		{name: "loadingPopup", kind: "messagePopup", message: "Loading..."}
	],

	favorites: [],

	create: function () {
		this.inherited(arguments);
		try {
			this.favorites = Storage.get("favorites");
		}
		catch (e) {
			this.favorites = [];
		}
	},

	rendered: function() {
		this.inherited(arguments);
	},

	goBack: function() {
		this.doGoBack();
	},

	initialize: function() {
		this.processFavorites();
	},

	processFavorites: function() {
		this.$.favoritesList.setCount(this.favorites.length);
		this.$.favoritesList.refresh();

		try {
			Storage.set("favorites", this.favorites);
		}
		catch (e) {
		}
	},

	setupFavoritesListItem: function(inSender, inEvent) {
		var i = inEvent.index;
		this.$.item4.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
		this.$.listItemThumb.setAttribute('src', this.favorites[i].thumb_url);
		this.$.listItemPrice.setContent("&pound;" + Utils.numberWithCommas(this.favorites[i].price));
		this.$.listItemTitle.setContent(this.favorites[i].title);
	},

	favoritesListItemTap: function(inSender, inEvent) {
		var i = inEvent.index;
		this.doGoListing({data: this.favorites[i]});
	},

	changeFavorite: function(listing) {
		if (this.isFavorite(listing.guid)) {
			this.favorites = enyo.filter(this.favorites, function(p){return p.guid !== listing.guid});
		} else {
			this.favorites.push(listing);
		}
		this.processFavorites();
	},

	isFavorite: function(guid) {
		var temp = enyo.filter(this.favorites, function(p) {return p.guid === guid});
		return !!temp.length;
	}
});
