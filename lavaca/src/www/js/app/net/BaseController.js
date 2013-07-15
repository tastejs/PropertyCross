define(function(require) {

  var Controller = require('lavaca/mvc/Controller');
  var merge = require('mout/object/merge');
  var stateModel = require('app/models/StateModel');

  /**
   * @class app.net.BaseController
   * @super Lavaca.mvc.Controller
   * Base controller
   */
  var BaseController = Controller.extend(function(){
      Controller.apply(this, arguments);
    }, {
    updateState: function(historyState, title, url, stateProps){
      var defaultStateProps = {pageTitle: title, showFavoriteButton: false, favoriteId: null, showFavorites: false, showBack: true};
      this.history(historyState, title, url)();

      stateProps = merge(defaultStateProps, stateProps || {});
      stateModel.apply(stateProps, true);
      stateModel.trigger('reset');
    }
  });

  return BaseController;

});