define(function(require) {

  var $ = require('$'),
      PageView = require('lavaca/mvc/PageView'),
      ArrayUtils = require('lavaca/util/ArrayUtils'),
      Cache = require('lavaca/util/Cache'),
      Disposable = require('lavaca/util/Disposable'),
      Promise = require('lavaca/util/Promise'),
      delay = require('lavaca/util/delay'),
      merge = require('mout/object/merge'),
      History = require('lavaca/net/History');

  /**
   * @class Lavaca.mvc.ViewManager
   * @super Lavaca.util.Disposable
   * Manager responsible for drawing views
   *
   * @constructor
   *
   * @constructor
   * @param {jQuery} el  The element that contains all layers
   */
  var ViewManager = Disposable.extend(function(el) {
    Disposable.call(this);
    /**
     * @field {jQuery} el
     * @default null
     * The element that contains all view layers
     */
    this.el = $(el || document.body);
    /**
     * @field {Lavaca.util.Cache} views
     * @default new Lavaca.util.Cache()
     * A cache containing all views
     */
    this.pageViews = new Cache();
    /**
     * @field {Array} layers
     * @default []
     * A list containing all layers
     */
    this.layers = [];
    /**
     * @field {Array} exitingPageViews
     * @default []
     * A list containing all views that are currently exiting
     */
    this.exitingPageViews = [];
    /**
     * @field {Array} enteringPageViews
     * @default []
     * A list containing all views that are currently entering
     */
    this.enteringPageViews = [];
  }, {
    /**
     * @field {Boolean} locked
     * @default false
     * When true, the view manager is prevented from loading views.
     */
    locked: false,
    /**
     * @method setEl
     * Sets the el property on the instance
     * 
     * @sig
     * @param {jQuery} el  A jQuery object of the element that contains all layers
     * @return {Lavaca.mvc.ViewManager}  This View Manager instance
     *
     * @sig
     * @param {String} el  A CSS selector matching the element that contains all layers
     * @return {Lavaca.mvc.ViewManager}  This View Manager instance
     */
    setEl: function(el) {
      this.el = typeof el === 'string' ? $(el) : el;
      return this;
    },
    /**
     * @method load
     * Loads a view
     *
     * @sig
     * @param {String} cacheKey  The cache key associated with the view
     * @param {Function} TPageView  The type of view to load (should derive from [[Lavaca.mvc.View]])
     * @param {Object} model  The views model
     * @param {Number} layer  The index of the layer on which the view will sit
     * @return {Lavaca.util.Promise}  A promise
     *
     * @sig
     * @param {String} cacheKey  The cache key associated with the view
     * @param {Function} TPageView  The type of view to load (should derive from [[Lavaca.mvc.View]])
     * @param {Object} model  The views model
     * @param {Object} params  Parameters to be mapped to the view
     * @return {Lavaca.util.Promise}  A promise
     */
    load: function(cacheKey, TPageView, model, params) {
      if (this.locked) {
        return (new Promise(this)).reject('locked');
      } else {
        this.locked = true;
      }
      params = params || {};
      var self = this,
          layer = layer || 0,
          pageView = this.pageViews.get(cacheKey),
          promise = new Promise(this),
          enterPromise = new Promise(promise),
          renderPromise = null,
          exitPromise = null;
      promise.always(function() {
        this.locked = false;
      });
      if (typeof params === 'number') {
        layer = params;
      } else if (params.layer) {
        layer = params.layer;
      }
      if (!pageView) {
        if (History.isRoutingBack && self.layers[layer] instanceof TPageView) {
          pageView = self.layers[layer];
        } else {
          pageView = new TPageView(null, model, layer);
          if (typeof params === 'object') {
            merge(pageView, params);
          }
          renderPromise = pageView.render();
          if (cacheKey !== null) {
            this.pageViews.set(cacheKey, pageView);
            pageView.cacheKey = cacheKey;
          }
        }
      }
      function lastly() {
        self.enteringPageViews = [pageView];
        promise.success(function() {
          delay(function() {
            self.enteringPageViews = [];
          });
        });
        exitPromise = self.dismissLayersAbove(layer - 1, pageView);
        if (self.layers[layer] !== pageView) {
          enterPromise
            .when(pageView.enter(self.el, self.exitingPageViews), exitPromise)
            .then(promise.resolve);
          self.layers[layer] = pageView;
        } else {
          promise.when(exitPromise);
        }
      }
      if (renderPromise) {
        renderPromise.then(lastly, promise.rejector());
      } else {
        lastly();
      }
      return promise;
    },
    /**
     * @method dismiss
     * Removes all views on a layer
     *
     * @sig
     * @param {Number} index  The index of the layer to remove
     *
     * @sig
     * @param {jQuery} el  An element on the layer to remove (or the layer itself)
     *
     * @sig
     * @param {Lavaca.mvc.View} view  The view on the layer to remove
     */
    dismiss: function(layer) {
      if (typeof layer === 'number') {
        this.dismissLayersAbove(layer - 1);
      } else if (layer instanceof PageView) {
        this.dismiss(layer.layer);
      } else {
        layer = $(layer);
        var index = layer.attr('data-layer-index');
        if (index === null) {
          layer = layer.closest('[data-layer-index]');
          index = layer.attr('data-layer-index');
        }
        if (index !== null) {
          this.dismiss(Number(index));
        }
      }
    },
    /**
     * @method dismissLayersAbove
     *
     * Removes all layers above a given index
     *
     * @sig
     * @param {Number}  index The index above which to clear
     * @return {Lavaca.util.Promise}  A promise
     *
     * @sig
     * @param {Number} index  The index above which to clear
     * @param {Lavaca.mvc.View}  exceptForView A view that should not be dismissed
     * @return {Lavaca.util.Promise}  A promise
     */
    dismissLayersAbove: function(index, exceptForView) {
      var promise = new Promise(this),
          dismissedLayers = false,
          i,
          layer;
      for (i = this.layers.length - 1; i > index; i--) {
        if ((layer = this.layers[i]) && (!exceptForView || exceptForView !== layer)) {
          (function(layer) {
            this.exitingPageViews.push(layer);
            promise
              .when(layer.exit(this.el, this.enteringPageViews))
              .success(function() {
                delay(function() {
                  ArrayUtils.remove(this.exitingPageViews, layer);
                  if (!layer.cacheKey || (exceptForView && exceptForView.cacheKey === layer.cacheKey)) {
                    layer.dispose();
                  }
                }, this);
              });
            this.layers[i] = null;
          }).call(this, layer);
          dismissedLayers = true;
        }
      }
      if (!dismissedLayers) {
        promise.resolve();
      }
      return promise;
    },
    /**
     * @method flush
     * Empties the view cache
     */
    flush: function(cacheKey) {
      // Don't dispose of any views that are currently displayed
      //flush individual cacheKey
      if (cacheKey){
        this.pageViews.remove(cacheKey);
      } else {
        var i = -1,
          layer;
        while (!!(layer = this.layers[++i])) {
          if (layer.cacheKey) {
            this.pageViews.remove(layer.cacheKey);
          }
        }
        this.pageViews.dispose();
        this.pageViews = new Cache();
      }
    },
    /**
     * @method dispose
     * Readies the view manager for garbage collection
     */
    dispose: function() {
      Disposable.prototype.dispose.call(this);
    }
  });

  return new ViewManager(null);

});
