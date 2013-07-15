define(function(require) {

  var $ = require('$'),
      Model = require('lavaca/mvc/Model'),
      View = require('lavaca/mvc/View'),
      Template = require('lavaca/ui/Template'),
      Promise = require('lavaca/util/Promise'),
      delay = require('lavaca/util/delay');

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
   * @param {Object} el  The element that the PageView is bound to
   * @param {Object} model  The model used by the view
   * @param {Number} layer  The index of the layer on which the view sits
   *
   * @constructor
   * @param {Object} model  The model used by the view
   * @param {Number} layer  The index of the layer on which the view sits
   */
  var PageView = View.extend(function(el, model, layer) {

    View.call(this, el, model);
    /**
     * @field {Number} layer
     * @default 0
     * The index of the layer on which the view sits
     */
    this.layer = layer || 0;


  }, {

    /**
     * @field {jQuery} shell
     * @default null
     * The element containing the view
     */
    shell: null,


    /**
     * @method wrapper
     * Creates the view's wrapper element
     *
     * @return {jQuery}  The wrapper element
     */
    wrapper: function() {
      return $('<div class="view"></div>');
    },
    /**
     * @method interior
     * Creates the view's interior content wrapper element
     *
     * @return {jQuery} The interior content wrapper element
     */
    interior: function() {
      return $('<div class="view-interior"></div>');
    },


    /**
     * @method insertInto
     * Adds this view to a container
     *
     * @param {jQuery} container  The containing element
     */
    insertInto: function(container) {
      if (this.shell.parent()[0] !== container[0]) {
        var layers = container.children('[data-layer-index]'),
            i = -1,
            layer;
        while (!!(layer = layers[++i])) {
          layer = $(layer);
          if (layer.attr('data-layer-index') > this.index) {
            this.shell.insertBefore(layer);
            return;
          }
        }
        container.append(this.shell);
      }
    },
    /**
     * @method render
     * Renders the view using its template and model, overrides the View class render method
     *
     * @event rendersuccess
     * @event rendererror
     *
     * @return {Lavaca.util.Promise}  A promise
     */
    render: function() {
      var promise = new Promise(this),
          renderPromise = new Promise(this),
          template = Template.get(this.template),
          model = this.model;
      if (model instanceof Model) {
        model = model.toObject();
      }
      if (this.el) {
        this.el.remove();
      }

      this.shell = this.wrapper();
      this.el = this.interior();
      this.shell.append(this.el);
      this.shell.attr('data-layer-index', this.layer);
      if (this.className) {
        this.shell.addClass(this.className);
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
        .error(promise.rejector());

      return renderPromise;
    },
    /**
     * @method enter
     * Executes when the user navigates to this view
     *
     * @param {jQuery} container  The parent element of all views
     * @param {Array} exitingViews  The views that are exiting as this one enters
     * @return {Lavaca.util.Promise}  A promise
     */
    enter: function(container) {
      var promise = new Promise(this),
          renderPromise;
      container = $(container);
      if (!this.hasRendered) {
        renderPromise = this
          .render()
          .error(promise.rejector());
      }
      this.insertInto(container);
      if (renderPromise) {
        promise.when(renderPromise);
      } else {
        delay(promise.resolver());
      }
      promise.then(function() {
        this.trigger('enter');
      });
      return promise;
    },
    /**
     * @method exit
     * Executes when the user navigates away from this view
     *
     * @param {jQuery} container  The parent element of all views
     * @param {Array} enteringViews  The views that are entering as this one exits
     * @return {Lavaca.util.Promise}  A promise
     */
    exit: function() {
      var promise = new Promise(this);
      this.shell.detach();
      delay(promise.resolver());
      promise.then(function() {
        this.trigger('exit');
      });
      return promise;
    }
  });

  return PageView;

});
