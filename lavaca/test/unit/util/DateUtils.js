define(function(require) {

  var DateUtils = require('lavaca/util/DateUtils');

  function _padLeft(v, count, c) {
    v = v.toString();
    c = c || '0';
    while (v.length < count) {
      v = c + v;
    }
    return v;
  }

  describe('DateUtils', function() {
    it('can parse a date', function() {
      expect(DateUtils.parse('2009-09-01T04:58:03-05:00', 'yyyy-MM-ddTHH:mm:sszzz').getTime()).toEqual(1251799083000);
    });
    it('can stringify a date', function() {
      var date = new Date(),
          y = date.getFullYear(),
          M = date.getMonth() + 1,
          d = date.getDate(),
          h = date.getHours(),
          m = date.getMinutes(),
          s = date.getSeconds(),
          ms = date.getMilliseconds(),
          off = date.getTimezoneOffset(),
          offH = Math.floor(Math.abs(off) / 60),
          offM = Math.floor(Math.abs(off) % 60),
          offSign = off > 0 ? '-' : '+',
          out = _padLeft(y, 4) + '-' + _padLeft(M, 2) + '-' + _padLeft(d, 2) + 'T' + _padLeft(h, 2) + ':' + _padLeft(m, 2) + ':' + _padLeft(s, 2) + '.' + _padLeft(ms, 3) + offSign + _padLeft(offH, 2) + ':' + _padLeft(offM, 2);
      expect(DateUtils.stringify(date, 'yyyy-MM-ddTHH:mm:ss.fffzzz')).toEqual(out);
    });
    it('can stringify a date in UTC', function() {
      var date = new Date('Sep 01 2009 09:58:03+0000');
      expect(DateUtils.stringify(date, 'yyyy-MM-ddTHH:mm:ss.fff', true)).toEqual('2009-09-01T09:58:03.000');
    });
    it('can enter raw strings in formats', function() {
      var date = new Date('Sep 01 2009 09:58:03+0000');
      expect(DateUtils.stringify(date, 'yyyy-MM-ddTHH:mm:ss.fff"foo"', true)).toEqual('2009-09-01T09:58:03.000foo');
    });
  });

});
