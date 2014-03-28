(function() {

  var application = new (require("viewModel/ApplicationViewModel"))();
  var AndroidApplicationView = require("view/AndroidApplicationView");
  var IPhoneApplicationView = require("view/IPhoneApplicationView");

  var view = new (Ti.Platform.osname === "iphone" ? IPhoneApplicationView : AndroidApplicationView)(application);

  // handle changes in persistent state
  application.state.subscribe(function (state) {
    Ti.App.Properties.setString('appState', state);
  });

  // load app state if present
  var state = Ti.App.Properties.getString('appState');
  if (state) {
    try {
      application.setState(state);
    } catch (e) {
      console.warn("Failed to load state", e);
    }
  }

  // navigate to home
  application.navigateToHome();
} ());
