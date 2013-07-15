define(function(require) {

  var $ = require('$'),
      EventDispatcher = require('lavaca/events/EventDispatcher'),
      Model = require('lavaca/mvc/Model'),
      Template = require('lavaca/ui/Template'),
      Cache = require('lavaca/util/Cache'),
      Promise = require('lavaca/util/Promise'),
      log = require('lavaca/util/log'),
      uuid = require('lavaca/util/uuid');

  /**
   * @class Lavaca.mvc.View
   * @super Lavaca.events.EventDispatcher
   * Base view type
   *
   * @event rendersuccess
   * @event rendererror
   * @event enter
   * @event exit
   *
   * @constructor
   * @param {Object} el The element the view is bound to
   * @param {Object} model  The model used by the view
   *
   * @constructor
   * @param {String} el The CSS selector matching the element the view is bound to
   * @param {Object} model  The model used by the view
   *
   * @constructor
   * @param {Object} el The element that the childView is bound to
   * @param {Object} model  The model used by the view
   * @param {Lavaca.mvc.View} parentView  The View that contains the childView
   */
  var View = EventDispatcher.extend(function(el, model, parentView) {
    EventDispatcher.call(this);
    /**
     * @field {Object} model
     * @default null
     * The model used by the view
     */
    this.model = model || null;

    /**
     * @field {String} id
     * @default generated from className and unique identifier
     * An id is applied to a data attribute on the views container
     */
    this.id = this.className + '-' + uuid();

    /**
     * @field {Object} parentView
     * @default null
     * If the view is created in the context of a childView, the parent view is assigned to this view
     */
    this.parentView = parentView || null;

    /**
     * @field {Object} el
     * @default null
     * The element that is either assigned to the view if in the context of a childView, or is created for the View
     *  if it is a PageView
     */
    this.el = typeof el === 'string' ? $(el) : (el || null);

    /**
     * @field {Object} eventMap
     * @default {}
     * A dictionary of selectors and event types in the form
     *   {eventType: {delegate: 'xyz', callback: func}}
     */
    this.eventMap = {};
    /**
     * @field {Object} childViewMap
     * @default {}
     * A dictionary of selectors, View types and models in the form
     *   {selector: {TView: TView, model: model}}}
     */
    this.childViewMap = {};
    /**
     * @field {Lavaca.util.Cache} childViews
     * @default new Lavaca.util.Cache()
     * Interactive elements used by the view
     */
    this.childViews = new Cache();
    /**
     * @field {Object} widgetMap
     * @default {}
     * A dictionary of selectors and widget types in the form
     *   {selector: widgetType}
     */
    this.widgetMap = {};
    /**
     * @field {Lavaca.util.Cache} widgets
     * @default new Lavaca.util.Cache()
     * Interactive elements used by the view
     */
    this.widgets = new Cache();
    /**
     * @field {Object} childViewEventMap
     * @default {}
     * A map of all the events to be applied to child Views in the form of
     *  {type: {TView: TView, callback : callback}}
     */
    this.childViewEventMap = {};

    this
      .on('rendersuccess', this.onRenderSuccess)
      .on('rendererror', this.onRenderError);

    if (this.autoRender) {
      this.render();
    }
  }, {
    /**
     * @field {jQuery} el
     * @default null
     * The element associated with the view
     */
    el: null,
    /**
     * @field {String} template
     * @default null
     * The name of the template associated with the view
     */
    template: null,
    /**
     * @field {String} className
     * @default null
     * A class name added to the view container
     */
    className: null,
    /**
     * @field {Boolean} AutoRender
     * @default false
     * When autoRender is set to true, the view when created from applyChildView will be rendered automatically
     */
    autoRender: false,
    /**
     * @method render
     * Renders the view using its template and model
     *
     * @event rendersuccess
     * @event rendererror
     *
     * @return {Lavaca.util.Promise}  A promise
     */
    render: function() {
      var self = this,
          promise = new Promise(this),
          renderPromise = new Promise(this),
          template = Template.get(this.template),
          model = this.model;
      if (model instanceof Model) {
        model = model.toObject();
      }

      promise
        .success(function(html) {
          this.trigger('rendersuccess', {html: html});
          renderPromise.resolve();
        })
        .error(function(err) {
          this.trigger('rendererror', {err: err});
          renderPromise.reject();
        });
      template
        .render(model)
        .success(promise.resolver())
        .error(promise.rejector())
        .then(function() {
          if (self.className){
            self.el.addClass(self.className);
          }
        });

      return renderPromise;
    },
    /**
     * @method redraw
     * Re-renders the view's template and replaces the DOM nodes that match
     * the selector argument. If no selector argument is provided, the whole view
     * will be re-rendered. If the first parameter is passed as <code>false</code>
     * the resulting html will pe passed with the promise and nothing will be replaced.
     * Note: the number of elements that match the provided selector must be identical
     * in the current markup and in the newly rendered markup or else the returned
     * promise will be rejected.
     *
     * @sig
     * Re-renders the view's template using the view's model
     * and redraws the entire view
     * @return {Lavaca.util.Promise} A promise
     *
     * @sig
     * Re-renders the view's template using the specified model
     * and redraws the entire view
     * @param {Object} model  The data model to be passed to the template
     * @return {Lavaca.util.Promise} A promise
     *
     * @sig
     * Re-renders the view's template using the view's model and only redraws the
     * elements that match the specified selector string.
     * Note: The numbers of items that match the selector must
     * be exactly the same in the view's current markup and in the newly rendered
     * markup. If that is not the case, the returned promise will be rejected and
     * nothing will be redrawn.
     * @param {String} selector  Selector string that defines elements to redraw
     * @return {Lavaca.util.Promise} A promise
     *
     * @sig
     * Re-renders the view's template using the specified model and only redraws the
     * elements that match the specified selector string.
     * Note: The numbers of items that match the selector must
     * be exactly the same in the view's current markup and in the newly rendered
     * markup. If that is not the case, the returned promise will be rejected and
     * nothing will be redrawn.
     * @param {String} selector  Selector string that defines elements that will be updated
     * @param {Object} model  The data model to be passed to the template
     * @return {Lavaca.util.Promise} A promise
     *
     * @sig
     * Re-renders the view's template using the view's model. If shouldRedraw is true,
     * the entire view will be redrawn. If shouldRedraw is false, nothing will be redrawn,
     * but the returned promise will be resolved with the newly rendered content. This allows
     * the caller to attach a success handler to the returned promise and define their own
     * redrawing behavior.
     * @param {Boolean} shouldRedraw  Whether the view should be automatically redrawn.
     * @return {Lavaca.util.Promise}  A promise
     *
     * @sig
     * Re-renders the view's template using the specified model. If shouldRedraw is true,
     * the entire view will be redrawn. If shouldRedraw is false, nothing will be redrawn,
     * but the returned promise will be resolved with the newly rendered content. This allows
     * the caller to attach a success handler to the returned promise and define their own
     * redrawing behavior.
     * @param {Boolean} shouldRedraw  Whether the view should be automatically redrawn.
     * @param {Object} model  The data model to be passed to the template
     * @return {Lavaca.util.Promise}  A promise
     */
    redraw: function(selector, model) {
      var self = this,
          templateRenderPromise = new Promise(this),
          redrawPromise = new Promise(this),
          template = Template.get(this.template),
          replaceAll;
      if (typeof selector === 'object' || selector instanceof Model) {
        model = selector;
        replaceAll = true;
        selector = null;
      }
      else if (typeof selector === 'boolean') {
        replaceAll = selector;
        selector = null;
      } else if (!selector) {
        replaceAll = true;
      }
      model = model || this.model;
      if (model instanceof Model) {
        model = model.toObject();
      }

      // process widget, child view, and
      // child view event maps
      function processMaps() {
        self.createWidgets();
        self.createChildViews();
        self.applyChildViewEvents();
      }
      templateRenderPromise
        .success(function(html) {
          if (replaceAll) {
            this.disposeChildViews(this.el);
            this.disposeWidgets(this.el);
            this.el.html(html);
            processMaps();
            redrawPromise.resolve(html);
            return;
          }
          if(selector) {
            var $newEl = $('<div>' + html + '</div>').find(selector),
                $oldEl = this.el.find(selector);
            if($newEl.length === $oldEl.length) {
              $oldEl.each(function(index) {
                var $el = $(this);
                self.disposeChildViews($el);
                self.disposeWidgets($el);
                $el.replaceWith($newEl.eq(index)).remove();
              });
              processMaps();
              redrawPromise.resolve(html);
            } else {
              redrawPromise.reject('Count of items matching selector is not the same in the original html and in the newly rendered html.');
            }
          } else {
            redrawPromise.resolve(html);
          }
        })
        .error(redrawPromise.rejector());
      template
        .render(model)
        .success(templateRenderPromise.resolver())
        .error(templateRenderPromise.rejector());
      return redrawPromise;
    },

    // dispose old widgets and child views
    // currently in local caches
    disposeChildViews: function ($el) {
      var childViewSearch,
          self = this;

      // Remove child views
      childViewSearch = $el.find('[data-view-id]');
      if ($el !== self.el && $el.is('[data-view-id]')) {
        childViewSearch = childViewSearch.add($el);
      }
      childViewSearch.each(function(index, item) {
        var $item = $(item),
          childView = $item.data('view');

        self.childViews.remove(childView.id);
        childView.dispose();
      });
    },

    disposeWidgets: function ($el) {
      var self = this;

      // Remove widgets
      $el.add($el.find('[data-has-widgets]')).each(function(index, item) {
        var $item = $(item),
          widgets = $item.data('widgets'),
          selector, widget;
        for (selector in widgets) {
          widget = widgets[selector];
          self.widgets.remove(widget.id);
          widget.dispose();
        }
      });
      $el.removeData('widgets');
    },
    /**
     * @method clearModelEvents
     * Unbinds events from the model
     */
    clearModelEvents: function() {
      var type,
          callback,
          dotIndex;
      if (this.eventMap
          && this.eventMap.model
          && this.model
          && this.model instanceof EventDispatcher) {
        for (type in this.eventMap.model) {
          callback = this.eventMap.model[type];
          if (typeof callback === 'object') {
            callback = callback.on;
          }
          dotIndex = type.indexOf('.');
          if (dotIndex !== -1) {
            type = type.substr(0, dotIndex);
          }
          this.model.off(type, callback);
        }
      }
    },
    /**
     * @method applyEvents
     * Binds events to the view
     */
    applyEvents: function() {
      var el = this.el,
          callbacks,
          callback,
          attribute,
          delegate,
          type,
          dotIndex,
          opts;
      for (delegate in this.eventMap) {
        callbacks = this.eventMap[delegate];
        if (delegate === 'self') {
          delegate = null;
        }
        for (type in callbacks) {
          callback = callbacks[type];
          if (typeof callback === 'object') {
            opts = callback;
            callback = callback.on;
          } else {
            opts = undefined;
          }
          if (delegate === 'model') {
            if (this.model && this.model instanceof Model) {
              dotIndex = type.indexOf('.');
              if (dotIndex !== -1) {
                attribute = type.substr(dotIndex+1);
                type = type.substr(0, dotIndex);
              }
              this.model.on(type, attribute, callback, this);
            }
          } else if (type === 'animationEnd' && el.animationEnd) {
            el.animationEnd(delegate, callback);
          } else if (type === 'transitionEnd' && el.transitionEnd) {
            el.transitionEnd(delegate, callback);
          } else {
            el.on(type, delegate, callback);
          }
        }
      }
    },
    /**
     * @method mapEvent
     *
     * @sig
     * Maps multiple delegated events for the view
     * @param {Object} map  A hash of the delegates, event types, and handlers
     *     that will be bound when the view is rendered. The map should be in
     *     the form <code>{delegate: {eventType: callback}}</code>. For example,
     *     <code>{'.button': {click: onClickButton}}</code>. The events defined in
     *     [[Lavaca.fx.Animation]] and [[Lavaca.fx.Transition]] are also supported.
     *     To map an event to the view's el, use 'self' as the delegate. To map
     *     events to the view's model, use 'model' as the delegate. To limit events
     *     to only a particular attribute on the model, use a period-seperated
     *     syntax such as <code>{model: {'change.myAttribute': myCallback}}</code>
     * @return {Lavaca.mvc.View}  This view (for chaining)
     *
     * @sig
     * Maps an event for the view
     * @param {String} delegate  The element to which to delegate the event
     * @param {String} type  The type of event
     * @param {Function} callback  The event handler
     * @return {Lavaca.mvc.View}  This view (for chaining)
     */
    mapEvent: function(delegate, type, callback) {
      var o;
      if (typeof delegate === 'object') {
        o = delegate;
        for (delegate in o) {
          for (type in o[delegate]) {
            this.mapEvent(delegate, type, o[delegate][type]);
          }
        }
      } else {
        o = this.eventMap[delegate];
        if (!o) {
          o = this.eventMap[delegate] = {};
        }
        o[type] = callback;
      }
      return this;
    },
    /**
     * @method createWidgets
     * Initializes widgets on the view
     */
    createWidgets: function() {
      var cache = this.widgets,
          n,
          o;
      for (n in this.widgetMap) {
        o = this.widgetMap[n];
        (n === 'self' ? this.el : this.el.find(n))
          .each(function(index, item) {
            var $el = $(item),
                widgetMap = $el.data('widgets') || {},
                widget;
            if (!widgetMap[n]) {
              widget = new o($(item));
              widgetMap[n] = widget;
              cache.set(widget.id, widget);
              $el.data('widgets', widgetMap);
              $el.attr('data-has-widgets','');
            }
          });
      }
    },
    /**
     * @method mapWidget
     *
     * @sig
     * Assigns multiple widget types to elements on the view
     * @param {Object} map  A hash of selectors to widget types to be bound when the view is rendered.
     *     The map should be in the form {selector: TWidget}. For example, {'form': Lavaca.ui.Form}
     * @return {Lavaca.mvc.View}  This view (for chaining)
     *
     * @sig
     * Assigns a widget type to be created for elements matching a selector when the view is rendered
     * @param {String} selector  The selector for the root element of the widget
     * @param {Function} TWidget  The [[Lavaca.ui.Widget]]-derived type of widget to create
     * @return {Lavaca.mvc.View}  This view (for chaining)
     */
    mapWidget: function(selector, TWidget) {
      if (typeof selector === 'object') {
        var widgetTypes = selector;
        for (selector in widgetTypes) {
          this.mapWidget(selector, widgetTypes[selector]);
        }
      } else {
        this.widgetMap[selector] = TWidget;
      }
      return this;
    },
    /**
     * @method createChildViews
     * Initializes child views on the view, called from onRenderSuccess
     */
    createChildViews: function() {
      var cache = this.childViews,
          n,
          self = this,
          o;
      for (n in this.childViewMap) {
        o = this.childViewMap[n];
        this.el.find(n)
          .each(function(index, item) {
            var $el = $(item),
                childView;
            if (!$el.data('view')) {
              childView = new o.TView($el, o.model || self.model, self);
              cache.set(childView.id, childView);
            }
          });
      }
    },
    /**
     * @method mapChildView
     *
     * @sig
     * Assigns multiple Views to elements on the view
     * @param {Object} map  A hash of selectors to view types and models to be bound when the view is rendered.
     *     The map should be in the form {selector: {TView : TView, model : Lavaca.mvc.Model}}. For example, {'form': {TView : Lavaca.mvc.ExampleView, model : Lavaca.mvc.Model}}
     * @return {Lavaca.mvc.View}  This view (for chaining)
     *
     * @sig
     * Assigns a View type to be created for elements matching a selector when the view is rendered
     * @param {String} selector  The selector for the root element of the View
     * @param {Function} TView  The [[Lavaca.mvc.View]]-derived type of view to create
     * @param {Function} model  The [[Lavaca.mvc.Model]]-derived model instance to use in the child view
     * @return {Lavaca.mvc.View}  This view (for chaining)
     */
    mapChildView: function(selector, TView, model) {
      if (typeof selector === 'object') {
        var childViewTypes = selector;
        for (selector in childViewTypes) {
          this.mapChildView(selector, childViewTypes[selector].TView, childViewTypes[selector].model);
        }
      } else {
        this.childViewMap[selector] = { TView: TView, model: model };
      }
      return this;
    },

    /**
     * @method mapChildViewEvent
     * Listen for events triggered from child views.
     *
     * @param {String} type The type of event to listen for
     * @param {Function} callback The method to execute when this event type has occured
     * @param {Lavaca.mvc.View} TView (Optional) Only listen on child views of this type
     *
     * @sig
     * Maps multiple child event types
     * @param {Object} map A hash of event types with callbacks and TView's associated with that type
     *  The map should be in the form {type : {callback : {Function}, TView : TView}}
     */
    mapChildViewEvent: function(type, callback, TView) {
      if (typeof type === 'object'){
        var eventTypes = type;
        for (type in eventTypes){
          //add in view type to limit events created
          this.mapChildViewEvent(type, eventTypes[type].callback, eventTypes[type].TView);
        }
      } else {
        this.childViewEventMap[type] = {
                                      TView: TView,
                                      callback: callback
                                   };
      }
    },

    /**
     * @method applyChildViewEvent
     * Called from onRenderSuccess of the view, adds listeners to all childviews if present
     *
     */
    applyChildViewEvents: function() {
      var childViewEventMap = this.childViewEventMap,
          type;
      for (type in childViewEventMap) {
        this.childViews.each(function(key, item) {
          var callbacks,
              callback,
              i = -1;

          if (!childViewEventMap[type].TView || item instanceof childViewEventMap[type].TView) {
            callbacks = item.callbacks[type] || [];
            while (!!(callback = callbacks[++i])) {
              if (callback === childViewEventMap[type].callback) {
                return;
              }
            }
            item.on(type, childViewEventMap[type].callback);
          }
        });
      }
    },
    /**
     * @method onRenderSuccess
     * Executes when the template renders successfully
     *
     * @param {Event} e  The render event. This object should have a string property named "html"
     *   that contains the template's rendered HTML output.
     */
    onRenderSuccess: function(e) {
      this.el.html(e.html);
      this.applyEvents();
      this.createWidgets();
      this.createChildViews();
      this.applyChildViewEvents();
      this.el.data('view', this);
      this.el.attr('data-view-id', this.id);
      this.hasRendered = true;
    },
    /**
     * @method onRenderError
     * Executes when the template fails to render
     *
     * @param {Event} e  The error event. This object should have a string property named "err"
     *   that contains the error message.
     */
    onRenderError: function(e) {
      log(e.err);
    },
    /**
     * @method dispose
     * Readies the view for garbage collection
     */
    dispose: function() {
      if (this.model) {
        this.clearModelEvents();
      }
      if (this.childViews.count) {
        this.disposeChildViews(this.el);
      }
      if (this.widgets.count) {
        this.disposeWidgets(this.el);
      }

      // Do not dispose of template or model
      this.template
        = this.model
        = this.parentView
        = null;

      EventDispatcher.prototype.dispose.apply(this, arguments);
    }
  });

  return View;

});
