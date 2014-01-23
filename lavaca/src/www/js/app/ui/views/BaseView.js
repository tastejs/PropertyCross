define(function(require) {

  var Detection = require('lavaca/env/Detection'),
      PageView = require('lavaca/mvc/PageView'),
      Promise = require('lavaca/util/Promise'),
      viewManager = require('lavaca/mvc/ViewManager'),
      History = require('lavaca/net/History');
  require('lavaca/fx/Animation'); //jquery plugins

  /**
   * @class app.ui.views.BaseView
   * @super Lavaca.mvc.View
   *
   * A View from which all other application Views can extend.
   * Adds support for animating between views.
   */
  var BaseView = PageView.extend(function() {
    PageView.apply(this, arguments);
    this.mapEvent('.cancel', 'tap', this.onTapCancel);
  }, {

    /**
     * @field {String} template
     * @default 'default'
     * The name of the template used by the view
     */
    template: 'default',
    /**
     * @field {Object} pageTransition
     * @default 'default'
     * The name of the template used by the view
     */
    pageTransition: {
      'in': 'pt-page-moveFromRight',
      'out': 'pt-page-moveToLeft',
      'inReverse': 'pt-page-moveFromLeft',
      'outReverse': 'pt-page-moveToRight'
    },
    /**
     * @method onRenderSuccess
     * Executes when the template renders successfully. This implementation
     * adds support for animations between views, based off of the animation
     * property on the prototype.
     *
     * @param {Event} e  The render event. This object should have a string property named "html"
     *   that contains the template's rendered HTML output.
     */
    onRenderSuccess: function() {
      PageView.prototype.onRenderSuccess.apply(this, arguments);
    },
    /**
     * @method onTapCancel
     * Handler for when a cancel control is tapped
     *
     * @param {Event} e  The tap event.
     */
    onTapCancel: function(e) {
      e.preventDefault();
      viewManager.dismiss(e.currentTarget);
    },
    /**
     * @method enter
     * Executes when the user navigates to this view. This implementation
     * adds support for animations between views, based off of the animation
     * property on the prototype.
     *
     * @param {jQuery} container  The parent element of all views
     * @param {Array} exitingViews  The views that are exiting as this one enters
     * @return {Lavaca.util.Promise} A promise
     */
    enter: function(container, exitingViews) {
      return PageView.prototype.enter.apply(this, arguments)
        .then(function() {
          if (History.isRoutingBack) {
            if (History.animationBreadcrumb.length > 0) {
              this.pageTransition = History.animationBreadcrumb.pop();
            }
          } else {
            History.animationBreadcrumb.push(this.pageTransition);
          }
          var animationIn = History.isRoutingBack ? this.pageTransition['inReverse']:this.pageTransition['in'],
              animationOut = History.isRoutingBack ? this.pageTransition['outReverse']:this.pageTransition['out'],
              i = -1,
              exitingView;

          var triggerEnterComplete = function() {
            this.trigger('entercomplete');
            this.shell.removeClass(animationIn);
          };

          if (Detection.animationEnabled && animationIn !== '') {

            if (exitingViews.length) {
              i = -1;
              while (!!(exitingView = exitingViews[++i])) {
                exitingView.shell.addClass(animationOut);
                if (animationOut === '') {
                  exitingView.exitPromise.resolve();
                  //exitingView.shell.detach();
                }
              }
            }

            if ((this.layer > 0 || exitingViews.length > 0)) {
              this.shell
                  .nextAnimationEnd(triggerEnterComplete.bind(this))
                  .addClass(animationIn + ' current');
            } else {
              this.shell.addClass('current');
              this.trigger('entercomplete');
            }

          } else {
            this.shell.addClass('current');
            if (exitingViews.length > 0) {
              i = -1;
              while (!!(exitingView = exitingViews[++i])) {
                exitingView.shell.removeClass('current');
                if (exitingView.exitPromise) {
                  exitingView.exitPromise.resolve();
                  //exitingView.shell.detach();
                }
              }
            }
            this.trigger('entercomplete');
          }
        });
    },
    /**
     * @method exit
     * Executes when the user navigates away from this view. This implementation
     * adds support for animations between views, based off of the animation
     * property on the prototype.
     *
     * @param {jQuery} container  The parent element of all views
     * @param {Array} enteringViews  The views that are entering as this one exits
     * @return {Lavaca.util.Promise} A promise
     */
    exit: function(container, enteringViews) {
      var animation = History.isRoutingBack ? this.pageTransition['outReverse'] : (enteringViews.length ? enteringViews[0].pageTransition['out'] : '');

      if (History.isRoutingBack && this.shell.data('layer-index') > 0) {
        this.pageTransition = History.animationBreadcrumb.pop();
        animation = this.pageTransition['outReverse'];
      }

      if (Detection.animationEnabled && animation) {
        this.exitPromise = new Promise(this);

        this.shell
          .nextAnimationEnd(function() {
            PageView.prototype.exit.apply(this, arguments).then(function() {
              this.exitPromise.resolve();
            });
            this.shell.removeClass(animation + ' current');
          }.bind(this))
          .addClass(animation);

        return this.exitPromise;
      } else {
        this.shell.removeClass('current');
        return PageView.prototype.exit.apply(this, arguments);
      }
    }
  });

  return BaseView;

});
