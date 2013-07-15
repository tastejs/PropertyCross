define(function(require) {

  var $ = require('$');
  var View = require('lavaca/mvc/View');
  var Model = require('lavaca/mvc/Model');
  var Template = require('lavaca/ui/Template');

  describe('A View', function() {
    var testView,
        el = $('<div><div class="childView"></div></div>'),
        model;
    beforeEach(function() {
      $('body').append('<script type="text/dust-template" data-name="hello-world"><form>Hello World <input type="text"><div class="button">Button</div></form></script>');
      model = new Model({color: 'blue', primary: true});
      Template.init();
      testView = new View(el);
    });
    afterEach(function() {
      $('script[data-name="hello-world"]').remove();
      testView.dispose();
    });
    it('can be initialized', function() {
      expect(testView instanceof View).toEqual(true);
    });
    it('can be initialized with an el, a model and a parentView', function() {
      var parentView = new View(el, model);
      testView = new View(el, model, parentView);
      expect(testView.el).toEqual(el);
      expect(testView.model).toEqual(model);
    });
    it('can contain a childView', function() {
      testView.mapChildView('.childView', View, model);
      testView.createChildViews();
      var childView = testView.childViews.toArray()[0];
      expect(childView instanceof View).toEqual(true);
    });
    it('can redraw whole view', function() {
      var promise;
      $('body').append('<script type="text/dust-template" data-name="model-tmpl"><h2>Hello World</h2><p>Color is {color}.</p></script>');
      Template.init();

      testView = new View(el, model);
      testView.template = 'model-tmpl';
      promise = testView.render();
      promise.success(function() {
        expect(testView.hasRendered).toEqual(true);
        expect($(testView.el).length).toBe(1);
        expect($(testView.el).html()).toBe('<h2>Hello World</h2><p>Color is blue.</p>');
        model.set('color', 'red');
        testView.redraw();
        expect($(testView.el).html()).toBe('<h2>Hello World</h2><p>Color is red.</p>');
      });
      $('script[data-name="model-tmpl"]').remove();
    });
    it('can redraw whole view using a custom model', function() {
      var promise,
          otherModel = new Model({color: 'orange', primary: false});
      $('body').append('<script type="text/dust-template" data-name="model-tmpl"><p class="redraw">Color is {color}.</p><p>It is {^primary}not {/primary}primary</p></script>');
      Template.init();

      testView = new View(el, model);
      testView.template = 'model-tmpl';
      promise = testView.render();
      promise.success(function() {
        expect(testView.hasRendered).toEqual(true);
        expect($(testView.el).length).toBe(1);
        expect($(testView.el).html()).toBe('<p class="redraw">Color is blue.</p><p>It is primary</p>');
        testView.redraw(otherModel);
        expect($(testView.el).html()).toBe('<p class="redraw">Color is orange.</p><p>It is not primary</p>');
      });
      $('script[data-name="model-tmpl"]').remove();
    });
    it('can redraw part of a based on a selector', function() {
      var promise;
      $('body').append('<script type="text/dust-template" data-name="model-tmpl"><p class="redraw">Color is {color}.</p><p>It is {^primary}not {/primary}primary</p></script>');
      Template.init();

      testView = new View(el, model);
      testView.template = 'model-tmpl';
      promise = testView.render();
      promise.success(function() {
        expect(testView.hasRendered).toEqual(true);
        expect($(testView.el).length).toBe(1);
        expect($(testView.el).html()).toBe('<p class="redraw">Color is blue.</p><p>It is primary</p>');
        model.set('color', 'orange');
        model.set('primary', false);
        testView.redraw('p.redraw');
        expect($(testView.el).html()).toBe('<p class="redraw">Color is orange.</p><p>It is primary</p>');
      });
      $('script[data-name="model-tmpl"]').remove();
    });
    it('can redraw part of a based on a selector with a custom model', function() {
      var promise,
          otherModel = new Model({color: 'orange', primary: false});
      $('body').append('<script type="text/dust-template" data-name="model-tmpl"><p class="redraw">Color is {color}.</p><p>It is {^primary}not {/primary}primary</p></script>');
      Template.init();

      testView = new View(el, model);
      testView.template = 'model-tmpl';
      promise = testView.render();
      promise.success(function() {
        expect(testView.hasRendered).toEqual(true);
        expect($(testView.el).length).toBe(1);
        expect($(testView.el).html()).toBe('<p class="redraw">Color is blue.</p><p>It is primary</p>');
        testView.redraw('p.redraw', otherModel);
        expect($(testView.el).html()).toBe('<p class="redraw">Color is orange.</p><p>It is primary</p>');
      });
      $('script[data-name="model-tmpl"]').remove();
    });
    it('can re-render without redrawing', function() {
      var promise;
      $('body').append('<script type="text/dust-template" data-name="model-tmpl"><p class="redraw">Color is {color}.</p><p>It is {^primary}not {/primary}primary</p></script>');
      Template.init();

      testView = new View(el, model);
      testView.template = 'model-tmpl';
      promise = testView.render();
      promise.success(function() {
        expect(testView.hasRendered).toEqual(true);
        expect($(testView.el).length).toBe(1);
        expect($(testView.el).html()).toBe('<p class="redraw">Color is blue.</p><p>It is primary</p>');
        model.set('color', 'orange');
        model.set('primary', false);
        testView.redraw(false)
          .then(function(html) {
            expect($(testView.el).html()).toBe('<p class="redraw">Color is blue.</p><p>It is primary</p>');
            expect(html).toBe('<p class="redraw">Color is orange.</p><p>It is not primary</p>');
          });
      });
      $('script[data-name="model-tmpl"]').remove();
    });
    it('can re-render using a custom model without redrawing', function() {
      var promise,
          otherModel = new Model({color: 'orange', primary: false});
      $('body').append('<script type="text/dust-template" data-name="model-tmpl"><p class="redraw">Color is {color}.</p><p>It is {^primary}not {/primary}primary</p></script>');
      Template.init();

      testView = new View(el, model);
      testView.template = 'model-tmpl';
      promise = testView.render();
      promise.success(function() {
        expect(testView.hasRendered).toEqual(true);
        expect($(testView.el).length).toBe(1);
        expect($(testView.el).html()).toBe('<p class="redraw">Color is blue.</p><p>It is primary</p>');
        testView.redraw(false, otherModel)
          .then(function(html) {
            expect($(testView.el).html()).toBe('<p class="redraw">Color is blue.</p><p>It is primary</p>');
            expect(html).toBe('<p class="redraw">Color is orange.</p><p>It is not primary</p>');
          });
      });
      $('script[data-name="model-tmpl"]').remove();
    });
  });

});
