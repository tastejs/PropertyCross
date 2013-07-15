define(function(require) {

  var $ = require('$'),
      Widget = require('./Widget');

  /**
   * @class Lavaca.ui.LoadingIndicator
   * @super Lavaca.ui.Widget
   * Type that shows/hides a loading indicator
   *
   * @constructor
   * @param {jQuery} el  The DOM element that is the root of the widget
   */
  var LoadingIndicator = Widget.extend({
    /**
     * @field {String} className
     * @default 'loading'
     * Class name applied to the root
     */
    className: 'loading',
    /**
     * @method show
     * Activates the loading indicator
     */
    show: function() {
      this.el.addClass(this.className);
    },
    /**
     * @method hide
     * Deactivates the loading indicator
     */
    hide: function() {
      this.el.removeClass(this.className);
    }
  });
  /** 
   * @method init
   * @static
   * Creates a loading indicator and binds it to the document's AJAX events
   *
   * @sig
   *
   * @sig
   * @param {Function} TLoadingIndicator  The type of loading indicator to create (should derive from [[Lavaca.ui.LoadingIndicator]])
   */
  LoadingIndicator.init = function(TLoadingIndicator) {
    TLoadingIndicator = TLoadingIndicator || LoadingIndicator;
    var indicator = new TLoadingIndicator(document.body);
    function show() {
      indicator.show();
    }
    function hide() {
      indicator.hide();
    }
    $(document)
      .on('ajaxStart', show)
      .on('ajaxStop', hide)
      .on('ajaxError', hide);
    return indicator;
  };

  return LoadingIndicator.init();

});
