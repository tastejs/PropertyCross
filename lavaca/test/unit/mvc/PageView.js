define(function(require) {

  var $ = require('$');
  var PageView = require('lavaca/mvc/PageView');
  var Model = require('lavaca/mvc/Model');
  var Template = require('lavaca/ui/Template');

  describe('A PageView', function() {
    var testView,
      el = $('<div><div class="childView"></div></div>'),
      model;
    beforeEach(function() {
      $('body').append('<script type="text/dust-template" data-name="hello-world"><form>Hello World <input type="text"><div class="button">Button</div></form></script>');
      model = new Model({color: 'blue', primary: true});
      Template.init();
      testView = new PageView(el);
    });
    afterEach(function() {
      $('script[data-name="hello-world"]').remove();
      testView.dispose();
    });
    it('can be initialized', function() {
      expect(testView instanceof PageView).toEqual(true);
    });
    it('can enter the DOM, get rendered, and then exit the DOM', function() {
      var promise;
      testView.template = 'hello-world';
      promise = testView.enter(document.body);
      promise.success(function() {
        expect(testView.hasRendered).toEqual(true);
        expect($('.view').length).toBe(1);
        testView.exit();
        expect($('.view').length).toBe(0);
      });
    });
  });

});
