define(function(require) {

  var $ = require('$');
  var EventDispatcher = require('lavaca/events/EventDispatcher');


  describe('An EventDispatcher', function() {
    var eventDispatcher,
        noop = {
          func: function() {},
          func2: function() {}
        };
    beforeEach(function() {
      eventDispatcher = new EventDispatcher();
    });
    afterEach(function() {
      eventDispatcher.dispose();
      eventDispatcher = null;
      noop.func = function() {};
      noop.func2 = function() {};
    });
    it('can be initialized', function() {
      var type = typeof eventDispatcher;
      expect(type).toEqual(typeof new EventDispatcher());
    });
    describe('can bind', function() {
      it('an event handler', function() {
        eventDispatcher.on('test', noop.func);
        expect(eventDispatcher.callbacks.test[0].fn).toEqual(noop.func);
      });
      it('an event handler with a context', function() {
        var context = {test: 'test'};
        eventDispatcher.on('test', noop.func, context);
        expect(eventDispatcher.callbacks.test[0].fn).toEqual(noop.func);
        expect(eventDispatcher.callbacks.test[0].thisp).toEqual(context);
      });
    });
    describe('can unbind', function() {
      it('all event handlers', function() {
        eventDispatcher.on('test', noop.func);
        eventDispatcher.on('test2', noop.func2);
        expect(eventDispatcher.callbacks.test[0].fn).toEqual(noop.func);
        expect(eventDispatcher.callbacks.test2[0].fn).toEqual(noop.func2);

        eventDispatcher.off();
        expect(eventDispatcher.callbacks).toBeFalsy();
      });
      it('all event handlers for an event', function() {
        eventDispatcher.on('test', noop.func);
        eventDispatcher.on('test2', noop.func2);
        expect(eventDispatcher.callbacks.test[0].fn).toEqual(noop.func);
        expect(eventDispatcher.callbacks.test2[0].fn).toEqual(noop.func2);

        eventDispatcher.off('test');
        expect(eventDispatcher.callbacks.test).toBeFalsy();
        expect(eventDispatcher.callbacks.test2[0].fn).toEqual(noop.func2);
      });
      it('a specific event handler', function() {
        eventDispatcher.on('test', noop.func);
        eventDispatcher.on('test', noop.func2);
        expect(eventDispatcher.callbacks.test.length).toEqual(2);

        eventDispatcher.off('test', noop.func);
        expect(eventDispatcher.callbacks.test.length).toEqual(1);
      });
      it('a proxied event handler', function() {
        var context = {test: 'test'};
        eventDispatcher.on('test', $.proxy(noop.func, context));
        expect(eventDispatcher.callbacks.test.length).toEqual(1);

        eventDispatcher.off('test', noop.func);
        expect(eventDispatcher.callbacks.test.length).toEqual(0);
      });
      it('a specific event handler with a context', function() {
        var context = {test: 'test'};
        eventDispatcher.on('test', noop.func, context);
        eventDispatcher.on('test', noop.func);
        expect(eventDispatcher.callbacks.test.length).toEqual(2);

        eventDispatcher.off('test', noop.func, context);
        expect(eventDispatcher.callbacks.test.length).toEqual(1);
      });
    });
    describe('can trigger', function() {
      beforeEach(function() {
        spyOn(noop, 'func');
        spyOn(noop, 'func2');
      });
      afterEach(function() {
        noop.func.reset();
        noop.func2.reset();
      });
      it('an event', function() {
        eventDispatcher.on('test', noop.func);
        eventDispatcher.trigger('test');
        eventDispatcher.trigger('notTest');
        expect(noop.func.callCount).toEqual(1);
      });
      it('an event with params', function() {
        var count = 0,
            incrCount = function(obj) {
              count += obj.diff;
            };
        eventDispatcher.on('test', incrCount);
        eventDispatcher.trigger('test', {diff: 5});
        expect(count).toEqual(5);
      });
      it('an event with a context', function() {
        var context = {test: 'not good'},
            testFunc = function() {
              this.test = 'good';
            };
        eventDispatcher.on('test', testFunc, context);
        eventDispatcher.trigger('test');
        expect(context.test).toEqual('good');
      });
      it('an event with a context and params', function() {
        var context = {test: 0},
            testFunc = function(obj) {
              this.test += obj.diff;
            };
        eventDispatcher.on('test', testFunc, context);
        eventDispatcher.trigger('test', {diff: 5});
        expect(context.test).toEqual(5);
      });
    });
  });

});
