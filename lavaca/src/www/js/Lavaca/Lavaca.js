/**
 * @class Lavaca
 *  Core Lavaca library object
 */
(function(ns, $) {

var _uuid = 0;

/**
 * @field {Function} $
 * @static
 * Abstraction library conforming to jQuery interface
 */
ns.$ = $.noConflict ? $.noConflict() : $;

/**
 * @method resolve
 * @static
 * Looks up or creates an object, given its global path (ie, 'Lavaca.resolve' resolves to this function,
 * 'no.obj.exists' resolves to null)
 *
 * @sig
 * @param {String} name  The fully-qualified name of the object to look up
 * @return {Object}  The resolved object
 *
 * @sig
 * @param {String} name  The fully-qualified name of the object to look up
 * @param {Boolean} createIfNotExists  When true, any part of the name that doesn't already exist will be created
 * as an empty object
 * @return {Object}  The resolved object
 */
ns.resolve = function(name, createIfNotExists) {
  if (!name) {
    return null;
  }
  name = name.split('.');
  var last = window,
      o = window,
      i = -1,
      segment;
  while (segment = name[++i]) {
    o = o[segment];
    if (!o) {
      if (createIfNotExists) {
        o = last[segment] = {};
      } else {
        return null;
      }
    }
    last = o;
  }
  return o;
};

/**
 * @method extend
 * @static
 * Establishes inheritance between types. After a type is extended, it receives its own static
 * convenience method, extend(TSub, overrides).
 *
 * @sig
 * @param {Function} TSub  The child type which will inherit from superType
 * @param {Object} overrides  A hash of key-value pairs that will be added to the subType
 * @return {Function}  The subtype
 *
 * @sig
 * @param {Function} TSuper  The base type to extend
 * @param {Function} TSub  The child type which will inherit from superType
 * @param {Object} overrides  A hash of key-value pairs that will be added to the subType
 * @return {Function}  The subtype
 */
ns.extend = function(TSuper, TSub, overrides) {
  if (typeof TSuper == 'object') {
    overrides = TSuper;
    TSuper = Object;
    TSub = function() {
      // Empty
    };
  } else if (typeof TSub == 'object') {
    overrides = TSub;
    TSub = TSuper;
    TSuper = Object;
  }
  function ctor() {
    // Empty
  }
  ctor.prototype = TSuper.prototype;
  TSub.prototype = new ctor;
  TSub.prototype.constructor = TSub;
  if (overrides) {
    for (var name in overrides) {
      TSub.prototype[name] = overrides[name];
    }
  }
  TSub.extend = function(T, overrides) {
    if (typeof T == 'object') {
      overrides = T;
      T = function() {
        TSub.apply(this, arguments);
      };
    }
    ns.extend(TSub, T, overrides);
    return T;
  };
  return TSub;
};

/**
 * @method log
 * @static
 * Logs to the console (or alerts if no console exists)
 *
 * @params {Object} arg  The content to be logged
 */
ns.log = function() {
  if (window.console) {
    console.log.apply(console, arguments);
  } else {
    alert([].join.call(arguments, ' '));
  }
};

/**
 * @method uuid
 * @static
 * Produces a unique identifier
 *
 * @return {Number}  A number that is unique to this page
 */
ns.uuid = function() {
  return _uuid++;
};

/**
 * @method delay
 * @static
 * Delays the execution of a function
 *
 * @param {Function} callback  A callback to execute on delay
 *
 * @sig
 * @param {Function} callback  A callback to execute on delay
 * @param {Object} thisp  The object to use as the "this" keyword
 * @return {Number}  The timeout ID
 *
 * @sig
 * @param {Function} callback  A callback to execute on delay
 * @param {Object} thisp  The object to use as the "this" keyword
 * @param {Number} ms  The number of milliseconds to delay execution
 * @return {Number}  The timeout ID
 */
ns.delay = function(callback, thisp, ms) {
  return setTimeout(function() {
    callback.call(thisp);
  }, ms || 0);
};

/**
 * @method clone
 * @static
 * Makes a copy of an object
 *
 * @sig
 * @param {Object} obj  The object to copy
 * @return {Object}  The copy
 *
 * @sig
 * @param {Object} obj  The object to copy
 * @param {Boolean} deepCopy  When true, also clone each member of the object
 * @return {Object}  The copy
 */
ns.clone = function(obj, deepCopy) {
  if (!obj) {
    return obj;
  } else if (obj instanceof Array) {
    return obj.slice(0);
  } else if (obj instanceof Date) {
    return new Date(obj.getTime());
  } else if (typeof obj == 'object') {
    return ns.merge(deepCopy, {}, obj);
  } else {
    return obj.valueOf();
  }
};

/**
 * @method merge
 * @static
 * Applies the properties of one or more objects to another. To create a new object
 * with the properties of all others, call <code>Lavaca.merge(true, {}, obj1, obj2, objN)</code>.
 *
 * @sig
 * @param {Object} target  The object to which apply the properties
 * @params {Object} obj  The objects whose properties will be written to target
 * @return Object}  The target
 *
 * @sig
 * @param {Boolean} deepCopy  When true, copy the overload values
 * @param {Object} target  The object to which apply the properties
 * @params {Object} obj  The objects whose properties will be written to target
 * @return {Object}  The target
 */
ns.merge = function(deepCopy, target/*, obj1, obj2, objN*/) {
  var i = -1,
      objs = [].slice.call(arguments, 2),
      obj,
      n;
  if (typeof deepCopy == 'object') {
    objs.unshift(target);
    target = deepCopy;
    deepCopy = false;
  }
  while (obj = objs[++i]) {
    for (n in obj) {
      if (obj.hasOwnProperty(n)) {
        target[n] = deepCopy ? ns.clone(obj[n]) : obj[n];
      }
    }
  }
  return target;
};

/**
 * @method $.fn.dataAttrs
 * @static
 * Collects the values of all data attributes into an object
 *
 * @return {Object}  An object containing all data attribute values, with the "data-" prefix dropped
 */
$.fn.dataAttrs = function() {
  var data = {},
      attrs = this[0].attributes,
      i = -1,
      attr;
  while (attr = attrs[++i]) {
    if (attr.name.indexOf('data-') == 0) {
      data[attr.name.slice(5)] = attr.value;
    }
  }
  return data;
};

/**
 * @method $.proxy
 * @static
 * A jQuery like proxy method for passing in a context
 *
 * @param {Function} fn  The function to proxy
 * @param {Object} context  The execution context for the function
 * @return {Object}  Returns a new function that executes in that context
 */
if (!$.proxy) {
  $.proxy = function(fn, context) {
    return function() {
      fn.apply(context, arguments);
    };
  };
}

if (!$.fn.detach) {
  $.fn.detach = $.fn.remove;
}

})(window.Lavaca = window.Lavaca || {}, window.jQuery || window.Zepto || window.jMiny);
