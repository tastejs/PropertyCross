define("viewModel/AboutViewModel", function (require) {
  var util = require("viewModel/util");

  function AboutViewModel(propertySearchViewModel) {
    /// <summary>
    /// The view model that backs the about page
    /// </summary>

    // ----- framework fields
  
    this.template = "aboutView";
    this.factoryName = "AboutViewModel";

    // ----- public fields
    this.locationEnabled = propertySearchViewModel.locationEnabled;
  }

  util.registerFactory("AboutViewModel", AboutViewModel);

  return AboutViewModel;
});