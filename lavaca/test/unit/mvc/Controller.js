define(function(require) {

  var $ = require('$');
  var Controller = require('lavaca/mvc/Controller');
  var Model = require('lavaca/mvc/Model');
  var History = require('lavaca/net/History');
  var router = require('lavaca/mvc/Router');
  var viewManager = require('lavaca/mvc/ViewManager');
  var PageView = require('lavaca/mvc/PageView');
  var Translation = require('lavaca/util/Translation');
  var Template = require('lavaca/ui/Template');


  var testController,
      ob = {
        foo: function() {}
      };

  describe('A Controller', function() {
    beforeEach(function(){
      $('body').append('<div id="view-root"></div>');
      viewManager = (new viewManager.constructor()).setEl('#view-root');
      router = (new router.constructor()).setViewManager(viewManager);
      spyOn(ob, 'foo').andCallThrough();
      testController = Controller.extend(ob);
      router.add({
        '/foo': [testController, 'foo', {}]
      });
    });
    afterEach(function(){
      $('#view-root').remove();
    });
    it('can be instantiated', function() {
      var controller = new testController(router, viewManager);
      expect(controller instanceof testController).toBe(true);
      expect(controller.router).toBe(router);
      expect(controller.viewManager).toBe(viewManager);
    });
    it('can execute an action on itself', function() {
      var controller = new testController(router, viewManager),
          params = {one: 1, two: 2},
          promise = controller.exec('foo', params);
      promise.success(function() {
        expect(ob.foo).toHaveBeenCalled();
        expect(ob.foo.calls[0].args[0].one).toBe(1);
        expect(ob.foo.calls[0].args[0].two).toBe(2);
      });
    });
    describe('can load a view', function() {
      var noop = {
            success: function() {}
          };
      beforeEach(function(){
        spyOn(noop, 'success');
        $('body').append('<script type="text/dust-template" data-name="hello-world">Hello World</script>');
        Template.init();
      });
      afterEach(function(){
        $('script[data-name="hello-world"]').remove();
      });
      it('with a view helper method', function() {
        var controller = new testController(router, viewManager),
            myPageView = PageView.extend({
              template: 'hello-world'
            }),
            promise,
            response;
          runs(function() {
            promise = controller.view('myView', myPageView);
          });
          waitsFor(function() {
            promise.success(function() {
              response = this.viewManager.pageViews.get('myView').hasRendered;
            });
            return response;
          }, 'a view to be rendered', 300);
          runs(function() {
            expect(response).toBe(true);
          });
      });
    });
    it('can add a state to the browser history', function() {
      var controller = new testController(router, viewManager),
          model = new Model(),
          history = History.init(),
          current;
      History.overrideStandardsMode();
      (controller.history(model, 'Home Page', window.location.href))();
      current = history.current();
      expect(current.state).toEqual(model);
      expect(current.title).toEqual('Home Page');
    });
    it('can access translated messages', function() {
      var controller = new testController(router, viewManager),
          response;
      $('body').append('<script type="text/x-translation" data-name="en" data-default>{"hello": "Hello {0}!"}</script>');
      Translation.init('en_US');
      response = controller.translate('hello', ['Tester']);
      expect(response).toEqual('Hello Tester!');
      $('script[type="text/x-translation"]').remove();
    });
    it('can format urls', function() {
      var controller = new testController(router, viewManager),
          url = '/foo/{0}',
          response;
      response = controller.url(url, ['bar']);
      expect(response).toEqual('/foo/bar');
    });
    describe('can redirect user to another route', function() {
      it('directly', function() {
        var controller = new testController(router, viewManager),
            promise;
        promise = controller.redirect('/foo');
        promise.success(function() {
          expect(ob.foo).toHaveBeenCalled();
        });
      });
    });
  });

});
