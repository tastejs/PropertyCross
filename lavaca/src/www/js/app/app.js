define(function(require) {
  var History = require('lavaca/net/History');
  var SearchController = require('./net/SearchController');
  var Connectivity = require('lavaca/net/Connectivity');
  var Application = require('lavaca/mvc/Application');
  var Translation = require('lavaca/util/Translation');
  var localStore = require('./cache/localStore');
  var stateModel = require('app/models/StateModel');
  var headerView = require('app/ui/views/controls/HeaderView');
  require('lavaca/ui/LoadingIndicator');
  require('lavaca/ui/DustTemplate');
  require('jquery-mobile/events/touch');
  require('jquery-mobile/events/orientationchange');


  // Uncomment this section to use hash-based browser history instead of HTML5 history.
  // You should use hash-based history if there's no server-side component supporting your app's routes.
  History.overrideStandardsMode();

  /**
   * @class app
   * @super Lavaca.mvc.Application
   * Global application-specific object
   */
  var app = new Application(function() {
    // Initialize the routes
    this.router.add({
      '/': [SearchController, 'home'],
      '/listings/{placeName}': [SearchController, 'listings'],
      '/listings/{placeName}/{guid}': [SearchController, 'listing'],
      '/favorites': [SearchController, 'favorites'],
      '/favorites/{guid}': [SearchController, 'listing']
    });
    stateModel.set('lang', localStore.get('lang') || 'en_US');
    //initialize translations
    Translation.init(stateModel.get('lang'));
    //render header view
    headerView.render();
  });

  // Setup offline AJAX handler
  Connectivity.registerOfflineAjaxHandler(function() {
    var hasLoaded = Translation.hasLoaded;
    alert(hasLoaded ? Translation.get('error_offline') : 'No internet connection available. Please check your settings and connection and try again.');
  });

  return app;

});