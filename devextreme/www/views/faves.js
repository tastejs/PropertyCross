"use strict";

PropertyFinder.views.Faves = function (params) {
    return {
		handleItemClick: function(e) {
	        PropertyFinder.currentProperty(e.itemData);
	        PropertyFinder.app.navigate("Details");
		}    	
    };
};