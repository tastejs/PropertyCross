define(function(require) {

  var Disposable = require('lavaca/util/Disposable');

  var Type,
      ob;

  describe('A Disposable', function() {
    beforeEach(function() {
      Type = Disposable.extend({
        foo: 'bar',
        oof: 'rab'
      });
      ob = new Type();
      ob.bool = true;
      ob.str = 'A String';
      ob.num = 1;
      ob.obj = {
        item0: 1,
        item1: 2
      };
      ob.obj2 = new Type();

      spyOn(ob.obj2, 'dispose');
    });
    it('provides a dispose function', function() {
      expect(typeof ob.dispose ==='function').toEqual(true);
    });
    it('calls the dispose method of nested objects', function() {
      ob.dispose();
      expect(ob.obj2.dispose).toHaveBeenCalled();
    })
  });

});
