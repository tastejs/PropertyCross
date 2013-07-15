define(function(require) {

  var Model = require('lavaca/mvc/Model');

  describe('A Model', function() {
    var testModel;
    beforeEach(function() {
      testModel = new Model();
    }); 
    afterEach(function() {
      testModel.clear();
    });
    it('can be initialized', function() {
      testModel = new Model();
      var type = typeof testModel;  
      expect(type).toEqual(typeof new Model());
    });
    it('can be initialized with a hash of attributes', function() {
      testModel = new Model({
        myAttribute : true,
        myNumber: 12,
        myString: "Hello, World!"
      });
      expect(testModel.get('myAttribute')).toEqual(true);
      expect(testModel.get('myNumber')).toEqual(12);
      expect(testModel.get('myString')).toEqual('Hello, World!');
    });
    it('should be disposable', function() {
      expect(typeof testModel.dispose === 'function').toEqual(true);
    });
    it('should remove all attributes on clear', function() {
      testModel.set('myAttribute', true);
      testModel.set('email', 'test@lavaca.com', Model.SENSITIVE);
      testModel.clear();
      expect(testModel.get('myAttribute')).toBeNull();
    });
    it('should remove only flaged attributes on clear when a flag is specified', function() {
      testModel.set('myAttribute', true);
      testModel.set('email', 'test@lavaca.com', Model.SENSITIVE);
      testModel.clear(Model.SENSITIVE);
      expect(testModel.get('myAttribute')).toEqual(true);
      expect(testModel.get('email')).toBeNull();
    });
    
    describe('Saving and IDs', function() {
      it('should not have an ID if it has not been saved', function() {
        expect(testModel.get('id')).toBeNull();
        expect(testModel.id()).toBeNull();
      });
      it('should be marked as new if it does not have an id', function() {
        expect(testModel.isNew()).toBe(true);
      });
      it('should give back the right ID when idAttribute is assigned', function() {
        var myModelType = Model.extend({
              idAttribute : 'myId'
            }),
            myModel = new myModelType({
              myId : 'Hello, World!',
              id : 'This is not my ID'
            });
        expect(myModel.id()).toEqual('Hello, World!');
      });
      it('should get an ID on save', function() {
        var promise;
        testModel.apply({
          foo: 'bar',
          email: 'test@lavaca.com'
        });
        promise = testModel.save(function(model) {
          expect(model.unsavedAttributes.length).toEqual(2);
          model.set('email', null);
          model.set('id', 1);
          return model;
        });
        promise.success(function(model) {
          expect(model.unsavedAttributes.length).toEqual(0);
          expect(model.get('id')).toEqual(1);
          expect(model.isNew()).toEqual(false);
        });
      });
    });

    describe('cloning and converting', function() {
      var myModel;
      beforeEach(function() {
        myModel = new Model({
              foo: 'bar',
              bar: {
                foo : 'baz',
                bar : 'foo'
              }
            });
      });
      it('should create an exact copy on clone', function() {
        var myModelClone = myModel.clone();

        expect(myModelClone.get('foo')).toEqual('bar');
        expect(myModelClone.get('bar')).toEqual({
          foo: 'baz',
          bar : 'foo'
        });
      });
      it('should create an equal object on toObject', function() {
        var myModelObject = myModel.toObject();
        expect(myModelObject).toEqual({
          foo: 'bar',
          bar : {
            foo : 'baz',
            bar : 'foo'
          }
        });
      });
      it('should create an equal JSON object on toJSON', function() {
        var myModelJSON = myModel.toJSON();
        expect(myModelJSON).toEqual('{"foo":"bar","bar":{"foo":"baz","bar":"foo"}}');
      });
    });

    describe('Events', function() {
      it('can fire an onChange event', function() {
        var noop = {
              changeModel: function() {}
            };

        spyOn(noop, 'changeModel');

        runs(function() {
          testModel.on('change', noop.changeModel);
          testModel.set('someAttribute', 'someValue');
        });

        waitsFor(function() {
          return testModel.get('someAttribute') === 'someValue';
        });

        runs(function() {
          expect(noop.changeModel).toHaveBeenCalled();
        });
      });
      it('can fire a scoped onChange event', function() {
        var noop = {
          changeModel: function() {}
        };

        spyOn(noop, 'changeModel');

        runs(function() {
          testModel.on('change', 'someAttribute', noop.changeModel);
          testModel.set('someAttribute', 'someValue');
        });

        waitsFor(function() {
          return testModel.get('someAttribute') === 'someValue';
        });

        runs(function() {
          expect(noop.changeModel).toHaveBeenCalled();
        });
      });
      it('should not fire a change event when suppressed is set on the apply() method', function() {
        var noop = {
              changeModel: function() {}
            };

        spyOn(noop, 'changeModel');

        runs(function() {
          testModel.on('change', noop.changeModel);
          testModel.apply({'someAttribute': 'someValue'}, true);
        });

        waitsFor(function() {
          return testModel.get('someAttribute') === 'someValue';
        });

        runs(function() {
          expect(noop.changeModel).not.toHaveBeenCalled();
        });
      });
      it('should not add unsaved attributes when suppressTracking is true', function() {
        testModel.suppressTracking = true;
        runs(function() {
          testModel.set('someAttribute', 'someValue');
        });

        waitsFor(function() {
          return testModel.get('someAttribute') === 'someValue';
        });

        runs(function() {
          expect(testModel.unsavedAttributes.length).toEqual(0);
        });
      });
    });

    describe('Validation', function() {
      var noop = {
        func: function() {}
      };
      beforeEach(function() {
        spyOn(noop, 'func');
        testModel.addRule('phone', function(attribute, value) {
          return (/\d+/).test(value);
        }, 'Phone must contain only numbers');
      });
      it('should apply a rule given to addRule()', function() {
        expect(testModel.rules.get('phone').length).toBe(1);
      });
      it('should refuse a set() call if it fails a rule', function() {
        testModel.on('invalid', 'phone', noop.func);
        testModel.set('phone', 'fdsaf');
        expect(testModel.get('phone')).toBeNull();
        expect(noop.func).toHaveBeenCalled();
      });
      it('should allow a set() call if it passes all rules', function() {
        testModel.on('invalid', 'phone', noop.func);
        testModel.set('phone', '5121234567');
        expect(testModel.get('phone')).toEqual('5121234567');
        expect(noop.func).not.toHaveBeenCalled();
      });
      it('should refuse to set only the attribute that failed when using calling apply()', function() {
        testModel.on('invalid', 'phone', noop.func);
        testModel.apply({
          'phone': 'fdsaf',
          'someAttr': 'value'
        });
        expect(testModel.get('phone')).toBeNull();
        expect(noop.func).toHaveBeenCalled();
      });
      it('should not validate if suppress flag is sent to apply', function() {
        testModel.on('invalid', 'phone', noop.func);
        testModel.apply({
          'phone': 'fdsaf',
          'someAttr': 'value'
        }, true);
        expect(testModel.get('phone')).toBe('fdsaf');
        expect(noop.func).not.toHaveBeenCalled();
      });
      it('should not validate if suppress flag is sent to set', function() {
        testModel.on('invalid', 'phone', noop.func);
        testModel.set('phone', 'fdsaf', null, true);
        expect(testModel.get('phone')).toBe('fdsaf');
        expect(noop.func).not.toHaveBeenCalled();
      });
      it('should not validate on apply() if suppressValidation is true', function() {
        testModel.suppressValidation = true;
        testModel.on('invalid', 'phone', noop.func);
        testModel.apply({
          'phone': 'fdsaf',
          'someAttr': 'value'
        });
        expect(testModel.get('phone')).toBe('fdsaf');
        expect(noop.func).not.toHaveBeenCalled();
      });
      it('should not validate on set() if suppressValidation is true', function() {
        testModel.suppressValidation = true;
        testModel.on('invalid', 'phone', noop.func);
        testModel.set('phone', 'fdsaf');
        expect(testModel.get('phone')).toBe('fdsaf');
        expect(noop.func).not.toHaveBeenCalled();
      });
    });

    describe('Attributes', function() {
      it('should return true from has() if the model has that attribute', function() {
        var myModel = new Model({
              foo: 'bar'
            });
        expect(myModel.has('foo')).toBe(true);
      });

      it('should return false from has() if the model does not have that attribute', function() {
        var myModel = new Model();
        expect(myModel.has('foo')).toBe(false);
      });

      it('should merge default attributes with the new attributes upon instantialization', function() {
        var ModelType = Model.extend({
          defaults: {
            boo: false,
            foo: 'bar',
            holy: 'moly',
            hello: 'hola'
          }
        });
        var myEmptyModel = new ModelType();
        var myModel = new ModelType({
          boo: true,
          bar: 'foo',
          holy: 'cow'
        });

        testModel.apply({
          0: 0.19,
          holy: 'shi*'
        });

        expect(myEmptyModel instanceof ModelType).toBe(true);
        expect(myEmptyModel.get('boo')).toEqual(false);
        expect(myEmptyModel.get('foo')).toEqual('bar');
        expect(myModel.get('boo')).toEqual(true);
        expect(myModel.get('foo')).toEqual('bar');
        expect(myModel.get('hello')).toEqual('hola');
        expect(testModel instanceof ModelType).toBe(false);
        expect(testModel.get('0')).toEqual(0.19);
        expect(testModel.get('hello')).toEqual(null);
        expect(testModel.get('holy')).toEqual('shi*');
      });

    });

  });

});
