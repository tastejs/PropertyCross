define(function(require) {

  var Promise = require('lavaca/util/Promise');

  var promise,
      noop;

  describe('A Promise', function() {
    beforeEach(function() {
      promise = new Promise();
      noop = {
        success: function() { },
        error: function() { },
        always: function() { }
      };
      spyOn(noop, 'success');
      spyOn(noop, 'error');
      spyOn(noop, 'always');
    });
    it('can be resolved calling success(), always() and not error()', function() {
      promise
        .success(noop.success)
        .error(noop.error)
        .always(noop.always)
        .resolve();
      expect(noop.success).toHaveBeenCalled();
      expect(noop.error).not.toHaveBeenCalled();
      expect(noop.always).toHaveBeenCalled();
    });
    it('can be rejected calling error(), always() and not success()', function() {
      promise
        .success(noop.success)
        .error(noop.error)
        .always(noop.always)
        .reject();
      expect(noop.success).not.toHaveBeenCalled();
      expect(noop.error).toHaveBeenCalled();
      expect(noop.always).toHaveBeenCalled();
    });
    it('can queue and trigger multiple succeess callbacks', function() {
      promise
        .success(noop.success)
        .success(noop.success)
        .error(noop.error)
        .always(noop.always)
        .then(noop.success, noop.error)
        .resolve();
      expect(noop.success.callCount).toBe(3);
      expect(noop.error.callCount).toBe(0);
      expect(noop.always.callCount).toBe(1);
    });
    it('can queue and trigger multiple error callbacks', function() {
      promise
        .success(noop.success)
        .error(noop.error)
        .error(noop.error)
        .always(noop.always)
        .then(noop.success, noop.error)
        .reject();
      expect(noop.success.callCount).toBe(0);
      expect(noop.error.callCount).toBe(3);
      expect(noop.always.callCount).toBe(1);
    });
    it('can queue and trigger callbacks "when" all promises are resolved', function() {
      var promise2 = new Promise();
      Promise.when(promise, promise2)
        .success(noop.success)
        .error(noop.error)
        .always(noop.always);
      promise.resolve();
      promise2.resolve();
      expect(noop.success).toHaveBeenCalled();
      expect(noop.error).not.toHaveBeenCalled();
      expect(noop.always).toHaveBeenCalled();
    });
    it('can queue and trigger callbacks "when" a single promise is rejected', function() {
      var promise2 = new Promise();
      Promise.when(promise, promise2)
        .success(noop.success)
        .error(noop.error)
        .always(noop.always);
      promise.reject();
      expect(noop.success).not.toHaveBeenCalled();
      expect(noop.error).toHaveBeenCalled();
      expect(noop.always).toHaveBeenCalled();
    });
    it('can be resolved with a resolver', function() {
      promise
        .success(noop.success)
        .error(noop.error)
        .always(noop.always);
      (promise.resolver())();
      expect(noop.success).toHaveBeenCalled();
      expect(noop.error).not.toHaveBeenCalled();
      expect(noop.always).toHaveBeenCalled();
    });
    it('can be rejected with a rejector', function() {
      promise
        .success(noop.success)
        .error(noop.error)
        .always(noop.always);
      (promise.rejector())();
      expect(noop.success).not.toHaveBeenCalled();
      expect(noop.error).toHaveBeenCalled();
      expect(noop.always).toHaveBeenCalled();
    });
  });

});
