define(function(require) {

  var $ = require('$');

  var _props = {
        transform: 'transform',
        webkitTransform: '-webkit-transform',
        MozTransform: '-moz-transform',
        OTransform: '-o-transform',
        MSTransform: '-ms-transform'
      },
      _prop,
      _cssProp,
      _3d = false,
      UNDEFINED;

  var Transform = {};

  (function() {
    var style = document.createElement('div').style,
        s;
    for (s in _props) {
      if (s in style) {
        _prop = s;
        _cssProp = _props[s];
        style[s] = 'translate3d(0,0,0)';
        _3d = style[s].indexOf('translate3d') > -1 && navigator.userAgent.indexOf('Android') === -1;
        break;
      }
    }
  })();

  function _isUndefined(value) {
    return value === UNDEFINED;
  }

  function _toOriginUnit(v) {
    return typeof v === 'number' ? v * 100 + '%' : v;
  }

  function _scrubRotateValue(v) {
    return typeof v === 'number' ? v + 'deg' : v;
  }

  function _scrubTranslateValue(v) {
    return typeof v === 'number' ? v + 'px' : v;
  }

  function _scrubScaleValue(v) {
    return typeof v === 'number' ? v + ',' + v : v;
  }

  function _scrubTransformValue(prop, value) {
    var isRotate = prop.indexOf('rotate') === 0,
        isScale = prop === 'scale',
        isTranslate = prop.indexOf('translate') === 0,
        //isAxisSpecific = /(X|Y|Z)$/.test(prop),
        p,
        css = [];
    if (typeof value === 'object') {
      for (p in value) {
        css.push(prop
          + p.toUpperCase()
          + '('
          + (isTranslate
              ? _scrubTranslateValue(value[p])
              : isRotate
                ? _scrubRotateValue(value[p])
                : isScale
                  ? _scrubScaleValue(value[p])
                  : value[p])
          + ')');
      }
    } else {
      if (isScale) {
        value = _scrubScaleValue(value);
      } else if (isRotate) {
        value = _scrubRotateValue(value);
      } else if (isTranslate) {
        value = _scrubTranslateValue(value);
      }
      css.push(prop + '(' + value + ')');
    }
    return css.join(' ');
  }

  /**
   * @class Lavaca.fx.Transform
   * Static utility type for working with CSS transforms
   */

  /**
   * @method isSupported
   * @static
   * Whether or not transforms are supported by the browser
   *
   * @return {Boolean}  True when transforms are supported
   */
  Transform.isSupported = function() {
    return !!_prop;
  };

  /**
   * @method is3dSupported
   * @static
   * Whether or not 3D transforms are supported by the browser
   *
   * @return {Boolean}  True when 3D transforms are supported
   */
  Transform.is3dSupported = function() {
    return _3d;
  };

  /**
   * @method toCSS
   * @static
   * Converts a transform hash into a CSS string
   *
   * @param {Object} opts  A hash of CSS transform values, with properties in
   *      the form {translateX: 1, translateY: 1} or {translate: {x: 1, y: 1}}
   * @opt {Object} translate  An object or string containing the translation values
   * @opt {Object} translateX  A string (in any unit) or number (in pixels) representing the X translation value
   * @opt {Object} translateY  A string (in any unit) or number (in pixels) representing the Y translation value
   * @opt {Object} translateZ  A string (in any unit) or number (in pixels) representing the Z translation value
   * @opt {String} translate3d  A string containing the 3D translation values
   * @opt {Object} rotate  An object, string, or number (in degrees) containing the rotation value(s)
   * @opt {Object} rotateX  A string (in any unit) or number (in degrees) representing the X rotation value
   * @opt {Object} rotateY  A string (in any unit) or number (in degrees) representing the Y rotation value
   * @opt {Object} rotateZ  A string (in any unit) or number (in degrees) representing the Z rotation value
   * @opt {String} rotate3d  A string containing the 3D rotation values
   * @opt {Object} scale  An object, string or number (in percentage points) containing the scale value(s)
   * @opt {Object} scaleX  A string (in any unit) or number (in percentage points) representing the X scale value
   * @opt {Object} scaleY  A string (in any unit) or number (in percentage points) representing the Y scale value
   * @opt {Object} scaleZ  A string (in any unit) or number (in percentage points) representing the Z scale value
   * @opt {String} scale3d  Astring containing the 3D scale values
   * @opt {Object} skew  An object or string containing the skew values
   * @opt {Object} skewX  A string (in any unit) or number (in pixels) representing the X skew value
   * @opt {Object} skewY  A string (in any unit) or number (in pixels) representing the Y skew value
   * @opt {String} matrix  A string containing the matrix transform values
   * @opt {String} matrix3d  A string containing the 3D matrix transform values
   * @opt {String} perspective  A string containing the perspective transform values
   * @return {String}  The generated CSS string
   */
  Transform.toCSS = function(opts) {
    var css = [],
        prop;
    if (typeof opts === 'object') {
      for (prop in opts) {
        css.push(_scrubTransformValue(prop, opts[prop]));
      }
    } else {
      css.push(opts);
    }
    return css.join(' ');
  };

  /**
   * @method cssProperty
   * @static
   * Gets the name of the transform CSS property
   *
   * @return {String}  The name of the CSS property
   */
  Transform.cssProperty = function() {
    return _cssProp;
  };

  /**
   * @method $.fn.transform
   * Transforms an element
   *
   * @sig
   * @param {String} value  The CSS transform string
   * @return {jQuery}  The jQuery object, for chaining
   *
   * @sig
   * @param {Object} opt  A hash of CSS transform values, with properties in
   *      the form {translateX: 1, translateY: 1} or {translate: {x: 1, y: 1}}
   * @opt {Object} translate  An object or string containing the translation values
   * @opt {Object} translateX  A string (in any unit) or number (in pixels) representing the X translation value
   * @opt {Object} translateY  A string (in any unit) or number (in pixels) representing the Y translation value
   * @opt {Object} translateZ  A string (in any unit) or number (in pixels) representing the Z translation value
   * @opt {String} translate3d  A string containing the 3D translation values
   * @opt {Object} rotate  An object, string, or number (in degrees) containing the rotation value(s)
   * @opt {Object} rotateX  A string (in any unit) or number (in degrees) representing the X rotation value
   * @opt {Object} rotateY  A string (in any unit) or number (in degrees) representing the Y rotation value
   * @opt {Object} rotateZ  A string (in any unit) or number (in degrees) representing the Z rotation value
   * @opt {String} rotate3d  A string containing the 3D rotation values
   * @opt {Object} scale  An object, string or number (in percentage points) containing the scale value(s)
   * @opt {Object} scaleX  A string (in any unit) or number (in percentage points) representing the X scale value
   * @opt {Object} scaleY  A string (in any unit) or number (in percentage points) representing the Y scale value
   * @opt {Object} scaleZ  A string (in any unit) or number (in percentage points) representing the Z scale value
   * @opt {String} scale3d  Astring containing the 3D scale values
   * @opt {Object} skew  An object or string containing the skew values
   * @opt {Object} skewX  A string (in any unit) or number (in pixels) representing the X skew value
   * @opt {Object} skewY  A string (in any unit) or number (in pixels) representing the Y skew value
   * @opt {String} matrix  A string containing the matrix transform values
   * @opt {String} matrix3d  A string containing the 3D matrix transform values
   * @opt {String} perspective  A string containing the perspective transform values
   * @return {jQuery}  The jQuery object, for chaining
   *
   * @sig
   * @param {String} value  The CSS transform string
   * @param {String} origin  The CSS transform origin
   * @return {jQuery}  The jQuery object, for chaining
   *
   * @sig
   * @param {Object} opt  A hash of CSS transform values, with properties in
   *      the form {translateX: 1, translateY: 1} or {translate: {x: 1, y: 1}}
   * @opt {Object} translate  An object or string containing the translation values
   * @opt {Object} translateX  A string (in any unit) or number (in pixels) representing the X translation value
   * @opt {Object} translateY  A string (in any unit) or number (in pixels) representing the Y translation value
   * @opt {Object} translateZ  A string (in any unit) or number (in pixels) representing the Z translation value
   * @opt {String} translate3d  A string containing the 3D translation values
   * @opt {Object} rotate  An object, string, or number (in degrees) containing the rotation value(s)
   * @opt {Object} rotateX  A string (in any unit) or number (in degrees) representing the X rotation value
   * @opt {Object} rotateY  A string (in any unit) or number (in degrees) representing the Y rotation value
   * @opt {Object} rotateZ  A string (in any unit) or number (in degrees) representing the Z rotation value
   * @opt {String} rotate3d  A string containing the 3D rotation values
   * @opt {Object} scale  An object, string or number (in percentage points) containing the scale value(s)
   * @opt {Object} scaleX  A string (in any unit) or number (in percentage points) representing the X scale value
   * @opt {Object} scaleY  A string (in any unit) or number (in percentage points) representing the Y scale value
   * @opt {Object} scaleZ  A string (in any unit) or number (in percentage points) representing the Z scale value
   * @opt {String} scale3d  Astring containing the 3D scale values
   * @opt {Object} skew  An object or string containing the skew values
   * @opt {Object} skewX  A string (in any unit) or number (in pixels) representing the X skew value
   * @opt {Object} skewY  A string (in any unit) or number (in pixels) representing the Y skew value
   * @opt {String} matrix  A string containing the matrix transform values
   * @opt {String} matrix3d  A string containing the 3D matrix transform values
   * @opt {String} perspective  A string containing the perspective transform values
   * @param {String} origin  The CSS transform origin
   * @return {jQuery}  The jQuery object, for chaining
   *
   * @sig
   * @param {String} value  The CSS transform string
   * @param {Object} origin  The CSS transform origin, in the form {x: N, y: N},
   *      where N is a decimal percentage between -1 and 1 or N is a pixel value > 1 or < -1.
   * @return {jQuery}  The jQuery object, for chaining
   *
   * @sig
   * @param {Object} opt  A hash of CSS transform values, with properties in
   *      the form {translateX: 1, translateY: 1} or {translate: {x: 1, y: 1}}
   * @opt {Object} translate  An object or string containing the translation values
   * @opt {Object} translateX  A string (in any unit) or number (in pixels) representing the X translation value
   * @opt {Object} translateY  A string (in any unit) or number (in pixels) representing the Y translation value
   * @opt {Object} translateZ  A string (in any unit) or number (in pixels) representing the Z translation value
   * @opt {String} translate3d  A string containing the 3D translation values
   * @opt {Object} rotate  An object, string, or number (in degrees) containing the rotation value(s)
   * @opt {Object} rotateX  A string (in any unit) or number (in degrees) representing the X rotation value
   * @opt {Object} rotateY  A string (in any unit) or number (in degrees) representing the Y rotation value
   * @opt {Object} rotateZ  A string (in any unit) or number (in degrees) representing the Z rotation value
   * @opt {String} rotate3d  A string containing the 3D rotation values
   * @opt {Object} scale  An object, string or number (in percentage points) containing the scale value(s)
   * @opt {Object} scaleX  A string (in any unit) or number (in percentage points) representing the X scale value
   * @opt {Object} scaleY  A string (in any unit) or number (in percentage points) representing the Y scale value
   * @opt {Object} scaleZ  A string (in any unit) or number (in percentage points) representing the Z scale value
   * @opt {String} scale3d  Astring containing the 3D scale values
   * @opt {Object} skew  An object or string containing the skew values
   * @opt {Object} skewX  A string (in any unit) or number (in pixels) representing the X skew value
   * @opt {Object} skewY  A string (in any unit) or number (in pixels) representing the Y skew value
   * @opt {String} matrix  A string containing the matrix transform values
   * @opt {String} matrix3d  A string containing the 3D matrix transform values
   * @opt {String} perspective  A string containing the perspective transform values
   * @param {Object} origin  The CSS transform origin, in the form {x: N, y: N},
   *      where N is a decimal percentage between -1 and 1 or N is a pixel value > 1 or < -1.
   * @return {jQuery}  The jQuery object, for chaining
   */
  $.fn.transform = function(value, origin) {
    if (Transform.isSupported()) {
      value = Transform.toCSS(value);
      if (origin) {
        if (typeof origin === 'object') {
          origin = _toOriginUnit(origin.x) + (_isUndefined(origin.y) ? '' : ' ' + _toOriginUnit(origin.y));
        }
      }
      this.each(function() {
        this.style[_prop] = value;
        if (origin) {
          this.style[_prop + 'Origin'] = origin;
        }
      });
    }
    return this;
  };

  return Transform;

});
