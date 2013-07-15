define(function(require) {

  var Cache = require('lavaca/util/Cache');

  var cache;

  describe('A Cache', function() {
    beforeEach(function() {
      cache = new Cache();
    });
    it('can assign and retrieve an item', function() {
      cache.set('foo', 'bar');
      expect(cache.get('foo')).toEqual('bar');
    });
    it('can retrieve an item with supplying a default', function() {
      expect(cache.get('foo')).toBe(null);
      expect(cache.get('foo', 'bar')).toEqual('bar');
    });
    it('can add an item and return an id', function() {
      var id = cache.add('bar');
      expect(cache.get(id)).toEqual('bar');
    });
    it('can remove an item by a key if it exists', function() {
      var id = cache.add('bar');
      expect(cache.get(id)).not.toBe(undefined);
      cache.remove(id);
      expect(cache.get(id)).toEqual(null);
    });
    it('can interate over each item', function() {
      var noop = {
            cb: function() {}
          };
      spyOn(noop, 'cb');
      cache.add('red');
      cache.add('green');
      cache.add('blue');
      cache.add('yellow');
      cache.each(noop.cb);
      expect(noop.cb.callCount).toBe(4);
    });
    it('can stop iteration early', function() {
      var ops = {
            cb: function(key, val) {
              if (val === 3) {
                return false;
              }
            }
          };
      spyOn(ops, 'cb').andCallThrough();
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.set('d', 4);
      cache.each(ops.cb);
      expect(ops.cb.callCount).toBe(3);
    });
    it('can return an object of the key-value hash', function() {
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.set('d', 4);
      expect(cache.toObject()).toEqual({
        a: 1,
        b: 2,
        c: 3,
        d: 4
      });
    });
    it('can return JSON string of the key-value hash', function() {
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.set('d', 4);
      expect(cache.toJSON()).toEqual('{"a":1,"b":2,"c":3,"d":4}');
    });
    it('can be cleared', function() {
      cache.set('foo', 'bar');
      cache.clear();
      expect(cache.get('foo')).toBeNull();
    });
  });

});
