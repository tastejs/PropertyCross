define(function(require) {

  var Disposable = require('lavaca/util/Disposable');

  function _notImplemented() {
    throw 'Not implemented';
  }

  /**
   * @class Lavaca.storage.Store
   * @super Lavaca.util.Disposable
   * An object for manage local storage
   */
  var Store = Disposable.extend(function(id) {
    /**
     * @field {String} id
     * The ID of the store
     */
    this.id = id;
  }, {
    /**
     * @method get
     * Retrieves an object from storage, given its ID
     * @param {String} id  The ID of the stored object
     * @return {Object}  The stored object
     */
    get: function() {
      _notImplemented();
    },
    /**
     * @method set
     * Stores an object locally
     * @param {String} id  The ID of the object to store
     * @param {Object} value  The value to store
     */
    set: function() {
      _notImplemented();
    },
    /**
     * @method remove
     * Removes an object from storage
     * @param {String} id  The ID of the object to remove from storage
     */
    remove: function() {
      _notImplemented();
    },
    /**
     * @method all
     * Retrieves all items in this store
     * @return {Array}  A list of stored objects
     */
    all: function() {
      _notImplemented();
    }
  });

  return Store;

});
