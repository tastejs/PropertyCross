define(function(require) {

  var $ = require('$');

  var Transition = {};

  var _props = {
        transition: ['transition', 'transitionend'],
        webkitTransition: ['-webkit-transition', 'webkitTransitionEnd'],
        MozTransition: ['-moz-transition', 'MozTransitionEnd'],
        OTransition: ['-o-transition', 'OTransitionEnd'],
        MSTransition: ['-ms-transition', 'MSTransitionEnd']
      },
      _prop,
      _cssProp,
      _event;

  (function() {
    var style = document.createElement('div').style,
        s;
    for (s in _props) {
      if (s in style) {
        _prop = s;
        _cssProp = _props[s][0];
        _event = _props[s][1];
        break;
      }
    }
  })();

  /**
   * @class Lavaca.fx.Transition
   * Static utility type for working with CSS transitions
   */

  /**
   * @method isSupported
   * @static
   * Whether or not transitions are supported by the browser
   *
   * @return {Boolean}  True when CSS transitions are supported
   */
  Transition.isSupported = function() {
    return !!_prop;
  };

  /**
   * @method toCSS
   * @static
   * Generates a CSS transition property string from several values
   *
   * @sig
   * @param {Object} props  A hash in which the keys are the names of the CSS properties
   * @param {Number} duration  The amount of time in milliseconds that the transition lasts
   * @return {String}  The generated CSS string
   *
   * @sig
   * @param {Array} props  An array of CSS property names
   * @param {Number} duration  The amount of time in milliseconds that the transition lasts
   * @return {String}  The generated CSS string
   *
   * @sig
   * @param {Object} props  A hash in which the keys are the names of the CSS properties
   * @param {Number} duration  The amount of time in milliseconds that the transition lasts
   * @param {String} easing  The interpolation for the transition
   * @return {String}  The generated CSS string
   *
   * @sig
   * @param {Array} props  An array of CSS property names
   * @param {Number} duration  The amount of time in milliseconds that the transition lasts
   * @param {String} easing  The interpolation for the transition
   * @return {String}  The generated CSS string
   */
  Transition.toCSS = function(props, duration, easing) {
    easing = easing || 'linear';
    var css = [],
        isArray = props instanceof Array,
        prop;
    for (prop in props) {
      if (isArray) {
        prop = props[prop];
      }
      css.push(prop + ' ' + duration + 'ms ' + easing);
    }
    return css.join(',');
  };

  /**
   * @method cssProperty
   * @static
   * Gets the name of the transition CSS property
   *
   * @return {String}  The name of the CSS property
   */
  Transition.cssProperty = function() {
    return _cssProp;
  };

  /**
   * @method $.fn.transition
   * Causes an element to undergo a transition
   *
   * @sig
   * @param {Object} props  The CSS property values at the end of the transition
   * @param {Number} duration  The amount of time in milliseconds that the transition lasts
   * @return {jQuery}  The jQuery object, for chaining
   *
   * @sig
   * @param {Object} props  The CSS property values at the end of the transition
   * @param {Number} duration  The amount of time in milliseconds that the transition lasts
   * @param {String} easing  The interpolation for the transition
   * @return {jQuery}  The jQuery object, for chaining
   *
   * @sig
   * @param {Object} props  The CSS property values at the end of the transition
   * @param {Number} duration  The amount of time in milliseconds that the transition lasts
   * @param {Function} callback  A function to execute when the transition completes
   * @return {jQuery}  The jQuery object, for chaining
   *
   * @sig
   * @param {Object} props  The CSS property values at the end of the transition
   * @param {Number} duration  The amount of time in milliseconds that the transition lasts
   * @param {String} easing  The interpolation for the transition
   * @param {Function} callback  A function to execute when the transition completes
   * @return {jQuery}  The jQuery object, for chaining
   */
  $.fn.transition = function(props, duration, easing, callback) {
    if (easing instanceof Function) {
        callback = easing;
        easing = null;
    }
    if (Transition.isSupported()) {
      var css = Transition.toCSS(props, duration, easing);
      if (callback) {
        this.nextTransitionEnd(callback);
      }
      this.each(function() {
        this.style[_prop] = css;
      });
      this.css(props);
    } else {
      this.css(props);
      if (callback) {
        callback.call(this[0], {});
      }
    }
    return this;
  };

  /**
   * @method $.fn.transitionEnd
   * Binds a transition end handler to an element.
   *
   * @sig
   * @param {Function} callback  Callback for when the transition ends
   * @return {jQuery}  The jQuery object, for chaining
   *
   * @sig
   * @param {String} delegate  Selector for the descendant elements to which the handlers will be bound
   * @param {Function} callback  Callback for when the transition ends
   * @return {jQuery}  The jQuery object, for chaining
   */
  $.fn.transitionEnd = function(delegate, callback) {
    if (_event) {
      return this.on(_event, delegate, callback);
    } else {
      return this;
    }
  };

  /**
   * @method $.fn.nextTransitionEnd
   * Binds a transition end handler to an element's next transition end event.
   *
   * @sig
   * @param {Function} callback  Callback for when the transition ends
   * @return {jQuery}  The jQuery object, for chaining
   *
   * @sig
   * @param {String} delegate  Selector for the descendant elements to which the handlers will be bound
   * @param {Function} callback  Callback for when the transition ends
   * @return {jQuery}  The jQuery object, for chaining
   */
  $.fn.nextTransitionEnd = function(delegate, callback) {
    if (_event) {
      return this.one(_event, delegate, callback);
    } else {
      return this;
    }
  };

  return Transition;

});
