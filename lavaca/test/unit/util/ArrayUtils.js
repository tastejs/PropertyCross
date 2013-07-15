define(function(require) {

  var ArrayUtils = require('lavaca/util/ArrayUtils');

  var arr;

  describe('ArrayUtils', function() {
    beforeEach(function() {
      arr = [1,2,3,4,2];
    });
    it('can find the index of the first matched item in an array (indexOf)', function() {
      expect(ArrayUtils.indexOf(arr, 2)).toEqual(1);
      expect(ArrayUtils.indexOf(arr, 5)).toEqual(-1);
    });
    it('can test if an item exists in an array', function() {
      expect(ArrayUtils.contains(arr, 1)).toBe(true);
      expect(ArrayUtils.contains(arr, 5)).toBe(false);
    });
    it('can remove an item from an array', function() {
      expect(ArrayUtils.remove(arr, 3)).toEqual(2);
      expect(ArrayUtils.indexOf(arr, 3)).toEqual(-1);
    });
    it('can push an item on to an array if it does not aleary contain the item', function() {
      expect(ArrayUtils.pushIfNotExists(arr, 5)).toEqual(5);
      expect(ArrayUtils.pushIfNotExists(arr, 1)).toEqual(0);
    });
    it('can check if something is a true array with or without Array.isArray() native support', function () {
      expect(ArrayUtils.isArray(arr)).toEqual(true);
      expect(ArrayUtils.isArray('just a string')).toEqual(false);
      expect(ArrayUtils.isArray({1: 1, 2:2, 3:3, 4:4})).toEqual(false);
      Array.isArray = null;
      expect(ArrayUtils.isArray(arr)).toEqual(true);
      expect(ArrayUtils.isArray(999)).toEqual(false);
      expect(ArrayUtils.isArray('just a string')).toEqual(false);
      expect(ArrayUtils.isArray({1: 1, 2:2, 3:3, 4:4})).toEqual(false);
    });
  });

});
