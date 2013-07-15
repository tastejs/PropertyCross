define(function(require) {

  var Translation = require('./Translation');

  /**
   * @class Lavaca.util.DateUtils
   * Utility class for working with dates
   */
  var DateUtils = {};

  function _int(input) {
    return parseInt(input, 10);
  }

  function _indexOfCode(input, array) {
    input = input.toLowerCase();
    var i = -1,
        code;
    while (!!(code = array[++i])) {
      if (input === code.toLowerCase() || input === _translate(code).toLowerCase()) {
        return i - 1;
      }
    }
    throw 'Invalid code "' + code + '"';
  }

  function _pad(n, digits, c) {
    var sign = n < 0 ? '-' : '';
    c = c || '0';
    n = Math.abs(n).toString();
    while (digits - n.length > 0) {
      n = c + n;
    }
    return sign + n;
  }

  function _translate(s) {
    return Translation.get(s);
  }

  /**
   * @field {Array} timeOfDayDesignatorAbbr
   * @static
   * @default ["A", "P"]
   * The time of day abbreviation. You can supply [[Lavaca.util.Translation]] values using these names as keys to translate.
   */
  DateUtils.timeOfDayDesignatorAbbr = [
    'A',
    'P'
  ];

  /**
   * @field {Array} timeOfDayDesignator
   * @static
   * @default ["AM", "PM"]
   * The time of day. You can supply [[Lavaca.util.Translation]] values using these names as keys to translate.
   */
  DateUtils.timeOfDayDesignator = [
    'AM',
    'PM'
  ];

  /**
   * @field {Array} daysOfWeekAbbr
   * @static
   * @default ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
   * The abbreviated days of the week. You can supply [[Lavaca.util.Translation]] values using these names as keys to translate.
   */
  DateUtils.daysOfWeekAbbr = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ];

  /**
   * @field {Array} daysOfWeek
   * @static
   * @default ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
   * The days of the week. You can supply [[Lavaca.util.Translation]] values using these names as keys to translate.
   */
  DateUtils.daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  /**
   * @field {Array} monthsAbbr
   * @static
   * @default ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
   * The abbreviated months. You can supply [[Lavaca.util.Translation]] values using these names as keys to translate.
   */
  DateUtils.monthsAbbr = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  /**
   * @field {Array} months
   * @static
   * @default ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
   * The months. You can supply [[Lavaca.util.Translation]] values using these names as keys to translate.
   */
  DateUtils.months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  /**
   * @field {Object} fn
   * @static
   * Object containing the functions used by each date format code. Default format codes are:
   *
   * <dl>
   * <dt>d</dt> <dd>Day of month (1 - 31)</dd>
   * <dt>dd</dt> <dd>Padded day of month (01 - 31)</dd>
   * <dt>ddd</dt> <dd>Abbreviated day of week (Sun - Sat)</dd>
   * <dt>ddd</dt> <dd>Full day of week (Sunday - Saturday)</dd>
   * <dt>f</dt> <dd>Tenth of a second</dd>
   * <dt>ff</dt> <dd>Hundreth of a second</dd>
   * <dt>fff</dt> <dd>Milliseconds</dd>
   * <dt>h</dt> <dd>Twelve-hour clock hour (1 - 12)</dd>
   * <dt>hh</dt> <dd>Padded twelve-hour clock hour (01 - 12)</dd>
   * <dt>H</dt> <dd>Twenty-four hour clock hour (0 - 23)</dd>
   * <dt>HH</dt> <dd>Padded twenty-four hour clock hour (00 - 23)</dd>
   * <dt>m</dt> <dd>Minute (0 - 59)</dd>
   * <dt>mm</dt> <dd>Padded minute (00 - 59)</dd>
   * <dt>M</dt> <dd>Month (1 - 12)</dd>
   * <dt>MM</dt> <dd>Padded month (01 - 12)</dd>
   * <dt>MMM</dt> <dd>Abbreviated month (Jan - Dec)</dd>
   * <dt>MMMM</dt> <dd>Full month (January - December)</dd>
   * <dt>s</dt> <dd>Second (0 - 59)</dd>
   * <dt>ss</dt> <dd>Padded second (00 - 59)</dd>
   * <dt>t</dt> <dd>Abbreviated AM/PM designator (A or P)</dd>
   * <dt>tt</dt> <dd>Full AM/PM designator (AM or PM)</dd>
   * <dt>y</dt> <dd>Short year (0 - 99)</dd>
   * <dt>yy</dt> <dd>Padded short year (00 - 99)</dd>
   * <dt>yyy</dt> <dd>Full year padded to at least 3 digits (000+)</dd>
   * <dt>yyyy</dt> <dd>Full year padded to at least 4 digits (0000+)</dd>
   * <dt>z</dt> <dd>Hours offset from UTC (-12, 0, 12)</dd>
   * <dt>zz</dt> <dd>Padded hours offset from UTC (-12, 00, 12)</dd>
   * <dt>zzz</dt> <dd>Padded hours and minute offset from UTC (-12:00, 00:00, 12:00)</dd>
   * </dl>
   *
   * To add a custom format code, assign this field an object containing an <code>i</code> function (responsible for parsing)
   * and an <code>o</code> function (responsible for stringifying). The <code>i</code> function
   * should assign to one of the following fields of its second argument: date, month, year,
   * hour, minute, second, ms, or offset. Example: <code>Lavaca.util.DateUtils.fn.QQQ = {i: function(input, dateObj, mappedObj) { dateObj.date = parseInt(input, 10); }, o: function(date, utc) { return (utc ? date.getUTCDate() : date.getDate()).toString(); }};</code>
   */
  DateUtils.fn = {
    d: {
      exp: '\\d{1,2}',
      i: function(input, dateObj) {
        dateObj.date = _int(input);
      },
      o: function(date, utc) {
        return (utc ? date.getUTCDate() : date.getDate()).toString();
      }
    },
    dd: {
      exp: '\\d{2}',
      i: function(input, dateObj) {
        dateObj.date = _int(input);
      },
      o: function(date, utc) {
        return _pad(DateUtils.fn.d.o(date, utc), 2);
      }
    },
    ddd: {
      exp: '[a-z]{3}',
      i: function() {
        // Do nothing
      },
      o: function(date, utc) {
        return _translate(DateUtils.daysOfWeekAbbr[utc ? date.getUTCDay() : date.getDay()]);
      }
    },
    dddd: {
      exp: '[a-z]+',
      i: function() {
        // Do nothing
      },
      o: function(date, utc) {
        return _translate(DateUtils.daysOfWeek[utc ? date.getUTCDay() : date.getDay()]);
      }
    },
    f: {
      exp: '\\d',
      i: function(input, dateObj) {
        dateObj.ms = _int(input) * 100;
      },
      o: function(date, utc, divisor) {
        divisor = divisor || 100;
        return _pad(Math.floor((utc ? date.getUTCMilliseconds() : date.getMilliseconds()) / divisor), 3 - divisor.toString().length);
      }
    },
    ff: {
      exp: '\\d{2}',
      i: function(input, dateObj) {
        dateObj.ms = _int(input) * 10;
      },
      o: function(date, utc) {
        return _pad(DateUtils.fn.f.o(date, utc, 10), 2);
      }
    },
    fff: {
      exp: '\\d{3}',
      i: function(input, dateObj) {
        dateObj.ms = _int(input, 10);
      },
      o: function(date, utc) {
        return _pad(DateUtils.fn.f.o(date, utc, 1), 3);
      }
    },
    h: {
      exp: '1?\\d',
      i: function(input, dateObj, mappedObj) {
        var h = _int(input) - 1,
            tod = (mappedObj.t || mappedObj.tt || 'A').indexOf('A') === 0 ? 0 : 12;
        dateObj.hour = h + tod;
      },
      o: function(date, utc) {
        return ((utc ? date.getUTCHours() : date.getHours()) % 12 + 1).toString();
      }
    },
    hh: {
      exp: '[0-1]\\d',
      i: function(input, dateObj, mappedObj) {
        DateUtils.fn.h.i(input, dateObj, mappedObj);
      },
      o: function(date, utc) {
        return _pad(DateUtils.fn.h.o(date, utc), 2);
      }
    },
    H: {
      exp: '[0-2]?\\d',
      i: function(input, dateObj) {
        dateObj.hour = _int(input);
      },
      o: function(date, utc) {
        return (utc ? date.getUTCHours() : date.getHours()).toString();
      }
    },
    HH: {
      exp: '[0-2]\\d',
      i: function(input, dateObj) {
        dateObj.hour = _int(input);
      },
      o: function (date, utc) {
        return _pad(DateUtils.fn.H.o(date, utc), 2);
      }
    },
    m: {
      exp: '[1-5]?\\d',
      i: function(input, dateObj) {
        dateObj.minute = _int(input);
      },
      o: function(date, utc) {
        return (utc ? date.getUTCMinutes() : date.getMinutes()).toString();
      }
    },
    mm: {
      exp: '[0-5]\\d',
      i: function(input, dateObj, mappedObj) {
        DateUtils.fn.m.i(input, dateObj, mappedObj);
      },
      o: function(date, utc) {
        return _pad(DateUtils.fn.m.o(date, utc), 2);
      }
    },
    M: {
      exp: '1?\\d',
      i: function(input, dateObj) {
        dateObj.month = _int(input) - 1;
      },
      o: function(date, utc) {
        return ((utc ? date.getUTCMonth() : date.getMonth()) + 1).toString();
      }
    },
    MM: {
      exp: '[0-1]\\d',
      i: function(input, dateObj, mappedObj) {
        DateUtils.fn.M.i(input, dateObj, mappedObj);
      },
      o: function(date, utc) {
        return _pad(DateUtils.fn.M.o(date, utc), 2);
      }
    },
    MMM: {
      exp: '[a-z]{3}',
      i: function(input, dateObj) {
        dateObj.month = _indexOfCode(input, DateUtils.monthsAbbr);
      },
      o: function(date, utc) {
        return _translate(DateUtils.monthsAbbr[utc ? date.getUTCMonth() : date.getMonth()]);
      }
    },
    MMMM: {
      exp: '[a-z]+',
      i: function(input, dateObj) {
        dateObj.month = _indexOfCode(input, DateUtils.months);
      },
      o: function(date, utc) {
        return _translate(DateUtils.months[utc ? date.getUTCMonth() : date.getMonth()]);
      }
    },
    s: {
      exp: '[1-5]?\\d',
      i: function(input, dateObj) {
        dateObj.second = _int(input);
      },
      o: function(date, utc) {
        return (utc ? date.getUTCSeconds() : date.getSeconds()).toString();
      }
    },
    ss: {
      exp: '[0-5]\\d',
      i: function(input, dateObj, mappedObj) {
        DateUtils.fn.s.i(input, dateObj, mappedObj);
      },
      o: function(date, utc) {
        return _pad(DateUtils.fn.s.o(date, utc), 2);
      }
    },
    t: {
      exp: '[a-z]',
      i: function() {
        // Do nothing
      },
      o: function(date, utc) {
        return _translate(DateUtils.timeOfDayDesignatorAbbr[Math.floor((utc ? date.getUTCHours() : date.getHours()) / 12)]);
      }
    },
    tt: {
      exp: '[a-z]+',
      i: function() {
        // Do nothing
      },
      o: function(date, utc) {
        return _translate(DateUtils.timeOfDayDesignator[Math.floor((utc ? date.getUTCHours() : date.getHours()) / 12)]);
      }
    },
    y: {
      exp: '\\d?\\d',
      i: function(input, dateObj) {
        dateObj.year = (new Date()).getFullYear() % 100 + _int(input);
      },
      o: function(date, utc) {
        return ((utc ? date.getUTCFullYear() : date.getFullYear()) % 100).toString();
      }
    },
    yy: {
      exp: '\\d{2}',
      i: function(input, dateObj, mappedObj) {
        DateUtils.fn.y.i(input, dateObj, mappedObj);
      },
      o: function(date, utc) {
        return _pad(DateUtils.fn.y.o(date, utc), 2);
      }
    },
    yyy: {
      exp: '\\d*\\d{3}',
      i: function(input, dateObj) {
        dateObj.year = _int(input);
      },
      o: function(date, utc) {
        return _pad(utc ? date.getUTCFullYear() : date.getFullYear(), 3);
      }
    },
    yyyy: {
      exp: '\\d*\\d{4}',
      i: function(input, dateObj, mappedObj) {
        DateUtils.fn.yyy.i(input, dateObj, mappedObj);
      },
      o: function(date, utc) {
        return _pad(utc ? date.getUTCFullYear() : date.getFullYear(), 4);
      }
    },
    z: {
      exp: '[-+]?1?\\d',
      i: function(input, dateObj) {
        dateObj.offset = _int(input) * 60;
      },
      o: function(date, padding) {
        var off = date.getTimezoneOffset(),
            offH = Math.floor(Math.abs(off / 60));
        return (off < 0 ? '-' : '+') + _pad(offH, padding);
      }
    },
    zz: {
      exp: '[-+]?[0-1]\\d',
      i: function(input, dateObj, mappedObj) {
        DateUtils.fn.z.i(input, dateObj, mappedObj);
      },
      o: function(date) {
        return DateUtils.fn.z.o(date, 2);
      }
    },
    zzz: {
      exp: '[-+]?[0-1]\\d:\\d{2}',
      i: function(input, dateObj) {
        var parts = input.split(':');
        dateObj.offset = _int(parts[0]) * 60 + _int(parts[1]);
      },
      o: function(date) {
        var z = date.getTimezoneOffset(),
            sign = z > 0 ? '-' : '+',
            m = z % 60,
            h = Math.abs((z - m) / 60);
        return sign + _pad(h, 2) + ':' + _pad(Math.abs(m), 2);
      }
    }
  };

  function _parseFormat(f) {
    var actors = [],
        buffer = '',
        i = -1,
        bufferChar,
        c;
    while (!!(c = f.charAt(++i))) {
      bufferChar = buffer.charAt(0);
      if (bufferChar === c || bufferChar === '"' || bufferChar === '\'') {
        buffer += c;
        if ((bufferChar === '"' && c === '"') || (bufferChar === '\'' && c === '\'')) {
          actors.push(buffer);
          buffer = '';
        }
      } else {
        if (buffer) {
          actors.push(buffer);
        }
        buffer = c;
      }
    }
    if (buffer) {
      actors.push(buffer);
    }
    return actors;
  }

  function _actorsToRegex(actors) {
    var s = ['^'],
        i = -1,
        actor,
        handler;
    while (!!(actor = actors[++i])) {
      handler = DateUtils.fn[actor];
      if (handler) {
        s.push('(', handler.exp, ')');
      } else {
        s.push('(', actor.replace(/(^")|(^')|('$)|("$)/g, '').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), ')');
      }
    }
    s.push('$');
    return new RegExp(s.join(''));
  }

  /**
   * @method parse
   * @static
   * Converts a string to a date
   *
   * @param {String} s  The date string
   * @param {String} f  The format of the date string
   * @return {Date}  The parsed date
   */
  DateUtils.parse = function(s, f) {
    var actors = _parseFormat(f),
        exp = _actorsToRegex(actors),
        dateObj = {year: 0, month: 0, date: 1, hour: 0, minute: 0, second: 0, ms: 0, offset: 0},
        mappedObj = {},
        i = -1,
        actor,
        match,
        handler;
    if (exp.test(s)) {
      match = exp.exec(s);
      while (!!(actor = actors[++i])) {
        mappedObj[actor] = match[i + 1];
      }
    }
    for (actor in mappedObj) {
      handler = DateUtils.fn[actor];
      if (handler) {
        handler.i(mappedObj[actor], dateObj, mappedObj);
      }
    }
    return new Date(
        DateUtils.monthsAbbr[dateObj.month]
      + ' '
      + _pad(dateObj.date, 2)
      + ' '
      + _pad(dateObj.year, 4)
      + ' '
      + _pad(dateObj.hour, 2)
      + ':'
      + _pad(dateObj.minute, 2)
      + ':'
      + _pad(dateObj.second, 2)
      + (dateObj.ms > 0 ? '.' + _pad(dateObj.ms, 3) : '')
      + (dateObj.offset >= 0 ? '+' : '-')
      + _pad(Math.floor(Math.abs(dateObj.offset / 60)), 2)
      + _pad(Math.abs(dateObj.offset % 60), 2));
  };

  /**
   * @method stringify
   * @static
   * Converts a date to a string
   *
   * @sig
   * @param {Date} d  The date
   * @param {String} f  The string format of the date
   * @return {String}  The stringified date
   *
   * @sig
   * @param {Date} d  The date
   * @param {String} f  The string format of the date
   * @param {Boolean} utc  When true, use the UTC date to generate the string
   * @return {String}  The stringified date
   */
  DateUtils.stringify = function(d, f, utc) {
    var actors = _parseFormat(f),
        i = -1,
        s = [],
        actor,
        handler;
    while (!!(actor = actors[++i])) {
      handler = DateUtils.fn[actor];
      if (handler) {
        s.push(handler.o(d, utc));
      } else {
        s.push(actor.replace(/(^")|(^')|('$)|("$)/g, ''));
      }
    }
    return s.join('');
  };

  return DateUtils;

});
