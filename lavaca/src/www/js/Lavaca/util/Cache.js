define(function(require) {

  var Disposable = require('lavaca/util/Disposable'),
      uuid = require('lavaca/util/uuid');

  /**
   * @class Lavaca.util.Cache
   * @super Lavaca.util.Disposable
   * Object for storing data
   */
  var Cache = Disposable.extend({
    /**
     * @method get
     * Retrieves an item from the cache
     *
     * @sig
     * @param {String} id  The key under which the item is stored
     * @return {Object}  The stored item (or null if no item is stored)
     *
     * @sig
     * @param {String} id  The key under which the item is stored
     * @param {Object} def  A default value that will be added, if there is no item stored
     * @return {Object}  The stored item (or null if no item is stored and no default)
     */
    get: function(id, def) {
      var result = this['@' + id];
      if (result === undefined && def !== undefined) {
        result = this['@' + id] = def;
      }
      return result === undefined ? null : result;
    },
    /**
     * @method set
     * Assigns an item to a key in the cache
     *
     * @param {String} id  The key under which the item will be stored
     * @param {Object} value  The object to store in the cache
     */
    set: function(id, value) {
      this['@' + id] = value;
    },
    /**
     * @method add
     * Adds an item to the cache
     *
     * @param {Object} value  The object to store in the cache
     * @return {String}  The auto-generated ID under which the value was stored
     */
    add: function(value) {
      var id = uuid();
      this.set(id, value);
      return id;
    },
    /**
     * @method remove
     * Removes an item from the cache (if it exists)
     *
     * @param {String} id  The key under which the item is stored
     */
    remove: function(id) {
      delete this['@' + id];
    },
    /**
     * @method each
     * Executes a callback for each cached item. To stop iteration immediately,
     * return false from the callback.
     *
     * @sig
     * @param {Function} callback  A function to execute for each item, callback(key, item)
     *
     * @sig
     * @param {Function} callback  A function to execute for each item, callback(key, item)
     * @param {Object} thisp  The context of the callback
     */
    each: function(cb, thisp) {
      var prop, returned;
      for (prop in this) {
        if (this.hasOwnProperty(prop) && prop.indexOf('@') === 0) {
          returned = cb.call(thisp || this, prop.slice(1), this[prop]);
          if (returned === false) {
            break;
          }
        }
      }
    },
    /**
     * @method toObject
     * Serializes the cache to a hash
     *
     * @return {Object}  The resulting key-value hash
     */
    toObject: function() {
      var result = {};
      this.each(function(prop, value) {
        result[prop] = (value && typeof value.toObject === 'function') ? value.toObject() : value;
      });
      return result;
    },
    /**
     * @method toJSON
     * Serializes the cache to JSON
     *
     * @return {String}  The JSON string
     */
    toJSON: function() {
      return JSON.stringify(this.toObject());
    },
     /**
     * @method toArray
     * Serializes the cache to an array
     *
     * @return {Object}  The resulting array with elements being index based and keys stored in an array on the 'ids' property
     */
    toArray: function() {
      var results = [];
      results['ids'] = [];
      this.each(function(prop, value) {
        results.push(typeof value.toObject === 'function' ? value.toObject() : value);
        results['ids'].push(prop); 
      });
      return results;
    },

    /**
     * @method clear
     * removes all items from the cache
     */
    clear: function() {
       this.each(function(key, item) {
         this.remove(key);
       }, this);
    },

    /**
     * @method length
     * returns number of items in cache
     */
    length: function() {
      var length = 0;
      this.each(function(key, item) {
        length++;
      }, this);
    },

    /**
     * @method dispose
     * Clears all items from the cache on dispose
     */
    dispose: function() {
      this.clear();
      Disposable.prototype.dispose.apply(this, arguments);
    }
  });

  return Cache;

});
