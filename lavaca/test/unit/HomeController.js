define(function(require) {

  var $ = require('$');
  var router = require('lavaca/mvc/Router');
  var viewManager = require('lavaca/mvc/ViewManager');
  var HomeController = require('app/net/HomeController');

  describe('Home Controller', function() {
    beforeEach(function(){
      $('body').append('<div id="view-root"></div>');
      viewManager = (new viewManager.constructor()).setEl('#view-root');
      router = (new router.constructor()).setViewManager(viewManager);
      router.add({
        '/': [HomeController, 'index', {}]
      });
    });
    afterEach(function(){
      $('#view-root').remove();
    });
    it('can be instantiated', function() {
      var controller = new HomeController(router, viewManager);
      expect(controller instanceof HomeController).toBe(true);
      expect(controller.router).toBe(router);
      expect(controller.viewManager).toBe(viewManager);
    });
  });

});
