define(function(require) {

  var $ = require('$');
  var router = require('lavaca/mvc/Router');
  var viewManager = require('lavaca/mvc/ViewManager');
  var Controller = require('lavaca/mvc/Controller');

  var ob = {
        foo: function() {}
      };

  describe('A Router', function() {
    beforeEach(function(){
      $('body').append('<div id="view-root"></div>');
      viewManager = new viewManager.constructor('#view-root');
      router = new router.constructor(viewManager);
      spyOn(ob, 'foo').andCallThrough();
    });
    afterEach(function(){
      $('#view-root').remove();
    });
    it('can add routes', function() {
      router.add({
        '/foo/{param1}': [Controller, 'foo', {}],
        '/bar/{param1}': [Controller, 'bar', {}]
      });
      router.add('/foobar/{param1}', Controller, 'foobar', {});
      expect(router.routes.length).toBe(3);
    });
    it('can exec routes that delegate to a controller', function() {
      var promise,
          testController = Controller.extend(ob);
      router.add('/foo/{param}', testController, 'foo', {});
      promise = router.exec('/foo/bar', null, {one: 1});
      promise.success(function() {
        expect(ob.foo.calls[0].args[0]).toEqual(jasmine.any(Object));
        expect(ob.foo.calls[0].args[0].param).toEqual('bar');
        expect(ob.foo.calls[0].args[0].one).toEqual(1);
        expect(ob.foo.calls[0].args[1]).toBeUndefined();
      });
    });
  });

});
