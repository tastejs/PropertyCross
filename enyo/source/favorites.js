enyo.kind({
	name: "FavoritesPage",
	kind: "FittableRows",

	events: {
		onGoBack: "",
		onGoListing: ""
	},

	components: [
		{kind: "onyx.Toolbar", components: [
			{name: "favoritesHeader", content: "Favorites", classes: "header-center"},
			{kind: "PC.Button", classes:"header-button-left back-button", ontap: "goBack"}
		]},
		{name: "favoritesError", kind: "onyx.Drawer", open: false, classes: "panel-row error-drawer", components: [
			{name: "favoritesErrorContent", content: "There was a problem loading the listings."}
		]},
		{name: "favoritesBox", kind: "onyx.Groupbox", classes: "panel-row", fit: true, layoutKind:"FittableRowsLayout", components: [
			{kind: "onyx.GroupboxHeader", content: "Found locations"},
			{name: "favoritesList", kind: "List", fit: true, touch: true, onSetupItem: "setupFavoritesListItem", components: [
				{name: "item4", style: "font-size:20px;", classes: "item enyo-border-box", ontap: "favoritesListItemTap", components: [
					{name: "listItemThumb", kind: "enyo.Image", style: "inline-block"},
					{style: "display:inline-block; margin-left:14px;", components: [
						{name: "listItemPrice", allowHtml: "true", style: "font-size:26px"},
						{name: "listItemTitle"}
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
