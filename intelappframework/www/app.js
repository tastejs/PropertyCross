function initialize() {
  var app = new $.mvc.app();

  app.loadControllers(["searchService", "search", "results", "favourites", "formatter"]);
  app.loadModels(["property", "recentSearch", "favourites"]);

  if (navigator.splashscreen) {
    $(document).ready(function() {
      app.ready(navigator.splashscreen.hide);
    });
  }
}

document.addEventListener("deviceready", initialize, false);
