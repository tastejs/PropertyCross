enyo.kind({
	name: "ResultsPage",
	kind: "FittableRows",

	events: {
		onGoBack: ""
	},

	components: [
		{kind: "onyx.Toolbar", components: [
			{content: "X of X matches", classes: "header-center"},
			{kind: "onyx.Button", content: "Back", classes:"header-button-left", ontap: "goBack"}
		]},
		{name: "resultsError", kind: "onyx.Drawer", open: false, classes: "panel-row error-drawer", components: [
			{name: "resultsErrorContent", content: "There was a problem loading the listings."}
		]},
		{name: "resultsBox", kind: "onyx.Groupbox", classes: "panel-row", style: "background-color: pink", fit: true, layoutKind:"FittableRowsLayout", components: [
			{kind: "onyx.GroupboxHeader", content: "Found locations"},
			{name: "resultsList", kind: "List", fit: true, touch: true, onSetupItem: "setupResultsListItem", components: [
				{name: "item3", style: "font-size:20px;", classes: "item enyo-border-box", ontap: "resultsListItemTap", components: [
					{name: "listItemResults", content: "Test..."}
				]}
			]}
		]},
		{name: "loadingPopup", style: "text-align:center", kind: "onyx.Popup", centered: true, floating: true, scrim: true, components: [
			{kind: "onyx.Spinner"},
			{content: "Loading...", style: "margin:12px"}
		]}
	],

	create: function () {
		this.inherited(arguments);
	},

	rendered: function() {
		this.inherited(arguments);
	},

	goBack: function() {
		this.doGoBack();
	}
});
