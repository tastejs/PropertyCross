// create the top-level view model
// N.B. This is kept as a global to avoid re-engineering the whole
// project and losing the focus of this article. However, this seems
// to be a hack to allow global state (i.e. favourites) to be stored
// somewhere other than the application level (i.e. in the
// ApplicationViewModel).
var propertySearchViewModel = new (require("viewModel/PropertySearchViewModel"))();
propertySearchViewModel.maxRecentSearch = 3;

function init() {

	var ko = require("knockout");
	var util = require("viewModel/util");
	var viewModel = require("viewModel/ApplicationViewModel").Instance;
	var AndroidApplicationView = require("view/AndroidApplicationView");
	var IPhoneApplicationView = require("view/IPhoneApplicationView");

	var view = new (Ti.Platform.osname === "iphone" ? IPhoneApplicationView : AndroidApplicationView)(viewModel, propertySearchViewModel);

	viewModel.navigateTo(propertySearchViewModel);
}

// self executing anonymous functions break eclipse auto-format...
init();
