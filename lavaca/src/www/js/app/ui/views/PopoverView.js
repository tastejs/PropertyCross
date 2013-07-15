define(function(require) {

  var $ = require('$'),
      Detection = require('lavaca/env/Detection'),
      BaseView = require('./BaseView');

  /**
   * @class app.ui.views.PopoverView
   * @super app.ui.views.BaseView
   * Base popover view type
   */
  var PopoverView = BaseView.extend({
    /**
     * @field {String} animation
     * @default 'pop'
     * The name of the animation used by the view
     */
    animation: 'pop',
    /**
     * @field {String} overlayAnimation
     * @default 'fade'
     * The name of the animation used by the overlay
     */
    overlayAnimation: 'fade',
    /**
     * @method overlayWrapper
     * Creates the view's overlay element
     *
     * @return {jQuery} The overlay element
     */
    overlayWrapper: function() {
      return $('<div class="ui-blocker"></div>');
    },
    /**
     * @method onrendersuccess
     * Executes when the template renders successfully
     *
     * @param {Event} e  The render event. This object should have a string property named "html"
     *   that contains the template's rendered HTML output.
     */
    onRenderSuccess: function(e) {
      BaseView.prototype.onRenderSuccess.apply(this, arguments);
      if (Detection.animationEnabled) {
        this.overlay.addClass(this.overlayAnimation);
      }
    },
    /**
     * @method render
     * Renders the view using its template and model
     *
     * @event rendersuccess
     * @event rendererror
     *
     * @return {Lavaca.util.Promise} A promise
     */
    render: function() {
      if (this.overlay) {
        this.overlay.remove();
      }
      this.overlay = this.overlayWrapper();
      this.overlay.attr('data-layer-index', this.layer);
      if (this.overlayClassName) {
        this.overlay.addClass(this.overlayClassName);
      }
      return BaseView.prototype.render.apply(this, arguments);
    },
    /**
     * @method insertInto
     * Adds this view to a container
     *
     * @param {jQuery} container  The containing element
     */
    insertInto: function(container) {
      var doInsert = this.el.parent()[0] !== container[0];
      BaseView.prototype.insertInto.apply(this, arguments);
      if (doInsert) {
        this.overlay.insertBefore(this.shell);
      }
    },
    /**
     * @method enter
     * Executes when the user navigates to this view
     *
     * @param {jQuery} container  The parent element of all views
     * @param {Array} exitingViews  The views that are exiting as this one enters
     * @return {Lavaca.util.Promise} A promise
     */
    enter: function() {
      if (Detection.animationEnabled) {
        this.overlay
          .removeClass('out')
          .addClass('in');
      }
      return BaseView.prototype.enter.apply(this, arguments);
    },
    /**
     * @method exit
     * Executes when the user navigates away from this view
     *
     * @param {jQuery} container  The parent element of all views
     * @param {Array} enteringViews  The views that are entering as this one exits
     * @return {Lavaca.util.Promise} A promise
     */
    exit: function() {
      if (Detection.animationEnabled) {
        this.overlay
          .nextAnimationEnd(function(e) {
            $(e.currentTarget).remove();
          })
          .removeClass('in')
          .addClass('out');
      }
      return BaseView.prototype.exit.apply(this, arguments);
    }
  });

  return PopoverView;

});
