enyo.kind({
	name: "Utils",
	kind: "Component",

	statics: {
		numberWithCommas: function(x){
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
	}
});

enyo.kind({
	name: "messagePopup",
	kind: "onyx.Popup",
	style: "text-align:center",
	centered: true,
	floating: true,
	scrim: true,
	published: {
		message: ""
	},
	components: [
		{kind: "onyx.Spinner"},
		{name: "messageDisplay", content: "...", style: "margin:12px"}
	],

	rendered: function() {
		this.inherited(arguments);
		this.messageChanged();
	},

	show: function(msg) {
		if (enyo.isString(msg)) {
			this.setMessage(msg);
		}
		this.inherited(arguments);
	},

	messageChanged: function () {
		this.$.messageDisplay.setContent(this.message);
	}
});
