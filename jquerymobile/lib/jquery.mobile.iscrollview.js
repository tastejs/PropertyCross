/******************************************************************************
  jslint directives. In case you hate yourself, and need that reinforced...

  You will still get a few warnings that can't be turned off, or that I'm just
  too stubborn to "fix"

  sloppy, white: let me indent any way I damn please! I like to line things
                 up nice and purty.

  nomen: tolerate leading _ for variable names. Leading _ is a requirement for
         JQuery Widget Factory private members
*******************************************************************************/

/*jslint browser: true, sloppy: true, white: true, nomen: true, regexp: true, todo: true, 
maxerr: 50, indent: 2 */
/*global jQuery:false, iScroll:false, console:false, Event:false*/

/*******************************************************************************
  But instead, be kind to yourself, and use jshint.

  Note jshint nomen and white options are opposite of jslint

  You can't specify an indent of you use white: false, otherwise it will
  still complain
*******************************************************************************/

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, 
curly:true, browser:true, jquery:true, indent:2, maxerr:50, sloppy:true, white:false, nomen:false, 
regexp:false, todo:true */


/*
jquery.mobile.iscrollview.js
Version: 1.2.5
jQuery Mobile iScroll4 view widget
Copyright (c), 2012 Watusiware Corporation
Distributed under the MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to the following
conditions: NO ADDITIONAl CONDITIONS.

The above copyright notice and this permission notice shall be included in all copies
or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.

Derived in part from jquery.mobile.iscroll.js:
Portions Copyright (c) Kazuhiro Osawa
Dual licensed under the MIT or GPL Version 2 licenses.

Derived in part from (jQuery mobile) jQuery UI Widget-factory
plugin boilerplate (for 1.8/9+)
Author: @scottjehl
Further changes: @addyosmani
Licensed under the MIT license

dependency:  iScroll 4.1.9 https://github.com/cubiq/iscroll or later (4.2 provided in demo)
             jQuery 1.6.4  (JQM 1.0.1) or 1.7.1 (JQM 1.1) or 1.7.2 (JQM 1.2)
             JQuery Mobile = 1.0.1 or 1.1 or 1.2-alpha1
*/


;   // Ignore jslint/jshint warning - for safety - terminate previous file if unterminated

(function ($, window, document, undefined) {   /* Ignore islint warning on "undefined" */
  "use strict";

  //----------------------------------
  // "class constants"
  //----------------------------------
  var HasTouch = document.ontouchend !== undefined,
      IsWebkit =  (/webkit/i).test(navigator.appVersion),
      IsAndroid = (/android/gi).test(navigator.appVersion),
      IsFirefox = (/firefox/i).test(navigator.userAgent),
      IsTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
      IsIDevice = (/(iPhone|iPad|iPod).*AppleWebKit/).test(navigator.appVersion),
      IsIPad = (/iPad.*AppleWebKit/).test(navigator.appVersion),
      // IDevice running Mobile Safari - not embedded UIWebKit or Standalone (= saved to desktop)
      IsMobileSafari = (/(iPhone|iPad|iPod).*AppleWebKit.*Safari/).test(navigator.appVersion),
      // IDevice native app using embedded UIWebView
      IsUIWebView = (/(iPhone|iPad|iPod).*AppleWebKit.(?!.*Safari)/).test(navigator.appVersion),
      // Standalone is when running a website saved to the desktop (SpringBoard)
      IsIDeviceStandalone = IsIDevice && (window.navigator.Standalone !== undefined),

      // Kludgey way to seeing if we have JQM v1.0.x, since there apparently is no
      // way to access the version number!
      JQMIsV1_0 = $.mobile.ignoreContentEnabled === undefined,

      nextPageID = 1;      // Used to generate event namespaces


   /* Placed here instead of anonymous functions to facilitate debugging.
      No logging, because these events are too frequent */

  function _pageTouchmoveFunc(e) {
    e.preventDefault();
    }

  //===============================================================================
  // This essentially subclasses iScroll. Originally, this was just so that we could
  // inject an iscrollview variable at the time of construction (so that it is
  // available from the refresh callback which is first called during construction).
  // But now we override several iScroll methods, as well.
  //===============================================================================
    // See: www.golimojo.com/etc/js-subclass.html
  function _subclass(constructor, superConstructor) {
    function SurrogateConstructor() {}
    SurrogateConstructor.prototype = superConstructor.prototype;
    var prototypeObject = new SurrogateConstructor();
    prototypeObject.constructor = constructor;
    constructor.prototype = prototypeObject;
    }

  function IScroll(iscrollview, scroller, options) {

    // We need to add an iscrollview member to iScroll, so that we can efficiently
    // pass the iscrollview when triggering jQuery events. Otherwise, we'd have to
    // make a call to $(wrapper).jqmData() on each event trigger, which could have an impact
    // on performance for high-frequency events.
    this.iscrollview = iscrollview;

    // The following functions are called from the proxy event functions. These are things
    // we want to do in certain iScroll4 events.

    // Emulate bottomOffset functionality in case iScroll doesn't have patch for bottomOffset
    this._emulateBottomOffset =  function(e) {
      if (this.iscrollview.options.emulateBottomOffset) {
        this.maxScrollY = this.wrapperH - this.scrollerH +
          this.minScrollY + this.iscrollview.options.bottomOffset;
        }
    };

    // Allow mouse clicks through to input elements
    // Note that this is not an issue for touch devices, just mouse
    this._fixInput = function(e) {
     if (this.iscrollview.options.fixInput ) {
       var tagName,
           target = e.target;
       while (target.nodeType !== 1) { target = target.parentNode; }
         tagName = target.tagName.toLowerCase();
         if (tagName === "select" || tagName === "input" || tagName === "textarea") {
           return;
         }
       }

      // If preventTouchHover, stop hover from occuring inside scroller for jQuery Mobile 1.0
      // (Not used for 1.1)
      if (this.iscrollview.options.preventTouchHover) { e.stopImmediatePropagation(); }
      else                                            { e.preventDefault(); }
    };

    // Perform an iScroll callback.
    this._doCallback = function(callbackName, e, f) {
      var v = this.iscrollview,
          then = v._logCallback(callbackName, e);
      if (f) { f.call(this, e); }                          // Perform passed function if present
      v._trigger(callbackName.toLowerCase(), e, {"iscrollview": v}); // Then trigger widget event
      v._logCallback(callbackName, e, then);
    };

    // Override _bind and _unbind functions in iScroll, so that we can monitor performance,
    // gain control over events reaching/not reaching iScroll, and potentially use jQuery events
    // instead of addEventListener().
    //
    // As of v1.2, using jQuery events is an experimental feature, and does not work in all
    // scenarios. For example, jQuery 1.7.1 breaks mousewheel support. This feature is left in
    // only to permit further experimentation.
    //
    // If using jQuery events, we ignore bubble (really, useCapture) parameter. Fortunately,
    // iScroll never uses it.
    //
    // If using jQuery events, we substitute jQuery's mouseleave for mouseout, to prevent iScroll
    // from getting a cascade of events when the mouse enters some inner element within the
    // scroller. iScroll is only interested in the mouse leaving the scroller to the OUTSIDE.
    // While iScroll doesn't spend much time in the callback if moving to an inner element,
    // the cascade of events is annoying when monitoring performance with the debug option.

    this._bind = function (type, el, bubble) {
      var jqEvents = this.iscrollview.options.bindIscrollUsingJqueryEvents,
          _type =  jqEvents && type === "mouseout" ? "mouseleave" : type;
      // Ignore attempt to bind to orientationchange or resize, since the widget handles that
      if (type === "orientationchange" || type === "resize") {
        this.iscrollview._logIscrollEvent("iScroll bind (ignored)", type);
        return;
      }
      this.iscrollview._logIscrollEvent("iScroll bind", type);
      if (jqEvents) { (el ? $(el) : this.iscrollview.$scroller).bind(_type, $.proxy(this.handleEvent, this)); }
      else          { (el || this.scroller).addEventListener(_type, this, !!bubble); }
    };

    this._unbind = function(type, el, bubble) {
      var jqEvents = this.iscrollview.options.bindIscrollUsingJqueryEvents,
          _type = jqEvents && type === "mouseout" ? "mouseleave" : type;
      if (type === "orientationchange" || type === "resize") {
        this.iscrollview._logIscrollEvent("iScroll unbind (ignored)");
        return;
      }
      this.iscrollview._logIscrollEvent("iScroll unbind", type);
      if (jqEvents) { $(el || this.iscrollview.$scroller).unbind(_type, this.handleEvent); }
      else          {  (el || this.scroller).removeEventListener(_type, this, !!bubble); }
    };

    // Save a reference to the original handleEvent in iScroll. We'll need to call it from our
    // override.
    this._origHandleEvent = iScroll.prototype.handleEvent;

    // Shim around iScroll.handleEvent, allows us to trace
    this.handleEvent = function(e) {
      var jqEvents = this.iscrollview.options.bindIscrollUsingJqueryEvents,
          then;
      then = this.iscrollview._logIscrollEvent("iScroll.handleEvent", e);
      // If jQuery mouseleave, make iScroll think we are handling a mouseout event
      if (jqEvents && e.type === "mouseleave") {
        e.type = "mouseout";
        this._origHandleEvent(e);
        e.type = "mouseleave";
        }
      else { this._origHandleEvent(e); }
      this.iscrollview._logIscrollEvent("iScroll.handleEvent", e, then);
    };

    // Override _resize function in iScroll, which calls refresh() and is only called on resize
    // and orientationchange events. We call refresh() when necessary, so these are redundant.
    // As well, some refreshes are deferred, and the user will need to refresh any jQuery Mobile
    // widgets using a callbackBefore. So, it makes no sense to have iScroll do event-based
    // refresh.
    this._resize = function() { };

    iScroll.call(this, scroller, options);
    }

  _subclass(IScroll, iScroll);
  $.widget("mobile.iscrollview", $.mobile.widget, {

  widgetEventPrefix: "iscroll_",

  //=========================================================
  // All instance variables are declared here. This is not
  // strictly necessary, but is helpful to document the use
  // of instance variables.
  //=========================================================

  iscroll:            null,  // The underlying iScroll object
  $window:            $(window),
  $wrapper:           [],  // The wrapper element
  $scroller:          [],  // The scroller element (first child of wrapper)
  $scrollerContent:   [],  // Content of scroller, sandwitched between any pull-down/pull-up
  $pullDown:          [],  // The pull-down element (if any)
  $pullUp:            [],  // The pull-up element (if any)
  $pullUpSpacer:      [],
  $page:              [],  // The page element that contains the wrapper
  _wrapperHeightAdjustForBoxModel: 0,  // This is set in _create

  _firstScrollerExpand:    true,  // True on first scroller expand, so we can capture original CSS

  createdAt:          null,   // Time when created - used as unique ID
  pageID:             null,   // Each page that has 1 or more iscrollviews gets a unique page ID #
  instanceID:         null,   // Each isntance of iscrollview created on a page gets a unique instance ID #

  // True if this scroller content is "dirty" - i.e. needs refresh because refresh
  // was deferred when the page was not the active page. This does NOT imply that the wrapper
  // needs to be refreshed - see _sizeDirty, below.
  _dirty:               false,
  _dirtyCallbackBefore: null,
  _dirtyCallbackAfter:  null,
  _sizeDirty:     false,  // True if wrapper resize is needed because page size or fixed content
                          //  size changed

  //----------------------------------------------------
  // Options to be used as defaults
  //----------------------------------------------------
  options: {
    // iScroll4 options
    // We only define those options here which have values that differ from
    // iscroll4 defaults.
    hScroll:    false,   // iScroll4 default is true
    hScrollbar: false,   // iScroll4 default is true

    // Additional iScroll4 options will be back-filled from iscroll4

    // iscrollview widget options

    debug: false,                      // Enable some messages to console
                                       // Debug true needed for any trace options
    traceResizeWrapper: false,         // Enable to trace resize wrapper
    traceRefresh: false,               // Enable to trace refresh
    traceCreateDestroy: false,         // Enable to trace create/destroy
    traceIscrollEvents: false,         // Enable to trace events handled by iScroll
    tracedIscrollEvents: [],           // List of specific iScroll events to trace, empty list for all
                                       // Items are strings, like "touchstart"
    traceWidgetEvents: false,          // Enable to trace events registered by widget
    // Note: in some cases we might bind to multiple events. You will have to include the multiple
    // events in one string to filter on such a bind. For example, "resize orientationchange"
    tracedWidgetEvents: [],            // List of specific widget events to trace
    traceIscrollCallbacks: false,      // Enable to trace iScroll callbacks to the widget
    tracedIscrollCallbacks: [],        // List of specific iScroll callbacks to trace, empty list for all
                                       // Items are strings, like "onRefresh"
    traceWidgetCallbacks: false,
    tracedWidgetCallbacks: [],


    // bottomOffset is currently only in Watusi-patched iScroll. We emulate it in case it isn't
    // there.
    bottomOffset: 0,
    emulateBottomOffset: true,

    pageClass:       "iscroll-page",        // Class to be applied to pages containing this widget
    wrapperClass:    "iscroll-wrapper",     // Class to be applied to wrapper containing this widget
    scrollerClass:   "iscroll-scroller",    // Class to be applied to scroller within wrapper
    pullDownClass:   "iscroll-pulldown",    // Class for pulldown element (if any)
    pullUpClass:     "iscroll-pullup",      // Class for pullup element (if any)
    pullLabelClass:  "iscroll-pull-label",  // Class for pull element label span
    pullUpSpacerClass: "iscroll-pullup-spacer", // Class added to generated pullup spacer
    scrollerContentClass: "iscroll-content", // Real content of scroller, not including pull-up, pull-down
    fixedHeightClass: "iscroll-fixed",       // Class applied to elements that match fixedHeightSelector

    // The widget adds the fixedHeightClass to all elements that match fixedHeightSelector.
    // Don't add the fixedHeightClass to elements manually. Use data-iscroll-fixed instead.
    fixedHeightSelector: ":jqmData(role='header'), :jqmData(role='footer'), :jqmData(iscroll-fixed)",

    // true to resize the wrapper to take all viewport space after fixed-height elements
    // (typically header/footer)
    // false to not change the size of the wrapper
    // For example, if using multiple iscrollview widgets on the same page, a maximum
    // of one of them could resize to remaining space. You would need to explicitly
    // set the height of additional iscrollviews and give them the fixed height class.
    resizeWrapper:  true,

    // Space-separated list of events on which to resize/refresh iscroll4
    // On some mobile devices you may wish to add/substitute orientationchange event
    // iOS 4.x will trigger resize twice then orientationchange
    // iOS 5.x will trigger resize once then orientationchange
    // Android devices can trigger multiple events, but generally orientationchange before resize
    // Devices are inconsistent as to when they first report the new width/height
    // Android tends to first trigger orientationchange with the width/height unchanged, the
    //  orientationchange with the new width/height.
    // Experimentation with other devices would be useful
    resizeEvents:  "resize" + ($.support.orientation ? " orientationchange" : ""),

    // Refresh iscrollview on page show event. This should be true if content inside a
    // scrollview might change while the page is cached but not shown, and application hasn't
    // called refresh(), or deferRefresh is false.
    refreshOnPageBeforeShow: false,

    // true to fix iscroll4 input element focus problem in the widget.
    // false if you are using a patched iscroll4 with different fix or to
    // disable for some other reason
    fixInput: true,

    wrapperAdd: 0,      // Shouldn't be necessary, but in case user needs to fudge
                        // Can be + or -

    // Timeout to allow page to render prior to refresh()
    refreshDelay:  IsAndroid ? 200 : 0,   // Wild-ass guesses

    // true to set the minimum height of scroller content (not including
    // any pull-down or pull-up) to the height of the wrapper. Note that
    // if there is a pull-down or pull-up, then this is done regardless of
    // this option, because you have to be able to scroll the empty content
    // to access the pull-down or pull-up. Set this option false if you do
    // not want to show a scrollbar on short content. However, this will have
    // the side-effect of making the "empty" part of the scroller non-draggable.
    // Leaving this true provides a more consistent UI behaviour.
    scrollShortContent: true,

    // Normally, we need the wrapper to have no padding. Otherwise, the result will look awkward,
    // you won't be able to grab the padded area to scroll, etc.
    removeWrapperPadding: true,

    // But we want to add that padding back inside the scroller. We add a div around the content
    // inside any pull-down/pull-up to replace the padding removed from the wrapper.
    addScrollerPadding: true,

    // On some platforms (iOS, for example) we need to scroll to top after orientation change,
    // because the address bar pushed the window down. jQuery Mobile handles this for page links,
    // but doesn't for orientationchange.
    // If you have multiple scrollers, only enable this for one of them
    scrollTopOnResize: true,

    scrollTopOnOrientatationChange: true,

    // iScroll scrolls the first child of the wrapper. I don't see a use case for having more
    // than one child. What kind of mess is going to be shown in that case? So, by default, we
    // just wrap ALL of the children of the wrapper with a new <div> that will be the scroller.
    // This way you don't need to worry about wrapping all the elements to be scrolled if there
    // is more than one. If there is only one child, we create this <div> unnecessarily, but -
    // big deal. If, for some reason, you want to create the markup for the scroller yourself,
    // set this to false.
    createScroller: true,

    // True to defer refresh() on non-active pages until pagebeforeshow. This avoids
    // unnecessary refresh in case of resize/orientation change when pages are cached,
    // as well as unnecessary refresh when pages are updated when they are not the active
    // page.
    deferNonActiveRefresh: true,

    // Same deal, for re-sizing the wrapper
    deferNonActiveResize: true,

    // True to prevent hover in scroller touch devices.  If this is false, you will get
    //  "piano keyboard" effect in JQM <1.1 when scrolling due to hover, which is both
    // time-consuming and distracting. A negative is that with the current implementation, you will
    // never get a "hover" visual effect within a scroller on touch devices, even when not scrolling.
    // But you still will on desktop browser with mouse, and you will still get "down" effect
    // when a link is selected. This really is a jQuery Mobile problem with listview, and is
    // fixed in JQM 1.1.
    preventTouchHover: JQMIsV1_0 && HasTouch,   // Enable if touch device and JQM version is < 1.1

    // This is an experimental feature under development and DOES NOT WORK completely!
    // For one, it breaks mousewheel with jQuery Mobile 1.1 (because jQuery Mobile 1.1 breaks
    // mousewheel...)
    bindIscrollUsingJqueryEvents: false,

    // If fastDestroy is true, don't tear down the widget on destroy. The assumption is destroy
    // will only be called when the page is removed, so there is no need. Is anyone really
    // going to un-enhance a scroller? If so, set this to false, but then you will have to
    // fix the unbind issue...
    fastDestroy: false,

    // Prevent scrolling the page by grabbing areas outside of the scroller.
    // Normally, this should be true. Set this false if you are NOT using a fixed-height page,
    // but instead are using iScroll to scroll an area within a scollable page. If you have
    // multiple scrollers on a scrollable page, then set this false for all of them.
    // Note that we ALWAYS prevent scrolling the page by dragging inside the scroller.
    preventPageScroll: true,

    pullDownResetText   : "Pull down to refresh...",
    pullDownPulledText  : "Release to refresh...",
    pullDownLoadingText : "Loading...",
    pullUpResetText     : "Pull up to refresh...",
    pullUpPulledText    : "Release to refresh...",
    pullUpLoadingText   : "Loading...",

    pullPulledClass     : "iscroll-pull-pulled",
    pullLoadingClass    : "iscroll-pull-loading",

    //-------------------------------------------------------------
    // For better or worse, widgets have two mechanisms for dealing
    // with events. The needs to be a set of options that correspond
    // to each event. If present, the option is a function. As
    // well, the widget prepends the widget event prefix ("iscroll_")
    // to each event name and triggers a jQuery event by that name.
    // BOTH mechanisms can be used simultaneously, though not sure
    // why you'd want to. If you need to handle an event during
    // iScroll4 instantiation, (only one I know about that might be
    // called is refresh) then you have to use a function option.
    //-------------------------------------------------------------
    onrefresh:           null,
    onbeforescrollstart: null,
    onscrollstart:       null,
    onbeforescrollmove:  null,
    onscrollmove:        null,
    onbeforescrollend:   null,
    onscrollend:         null,
    ontouchend:          null,
    ondestroy:           null,
    onzoomstart:         null,
    onzoom:              null,
    onzoomend:           null,

    onpulldownreset:     null,
    onpulldownpulled:    null,
    onpulldown:          null,
    onpullupreset:       null,
    onpulluppulled:      null,
    onpullup:            null,

    onbeforerefresh:     null,
    onafterrefresh:      null
    },

    //---------------------------------------------------------------------------------------
    // Array of keys of options that are widget-only options (not options in iscroll4 object)
    //---------------------------------------------------------------------------------------
    _widgetOnlyOptions: [
      "debug",
      "traceIscrollEvents",
      "tracedIscrollEvents",
      "traceIscrollCallbacks",
      "tracedIscrollCallbacks",
      "traceWidgetEvents",
      "tracedWidgetEvents",
      "traceWidgetCallbacks",
      "tracedWidgetCallbacks",
      "traceResizeWrapper",
      "traceRefresh",
      "traceCreateDestroy",
      "bottomOffset",
      "emulateBottomOffset",
      "pageClass",
      "wrapperClass",
      "scrollerClass",
      "pullDownClass",
      "pullUpClass",
      "scrollerContentClass",
      "pullLabelClass",
      "pullUpSpacerClass",
      "fixedHeightSelector",
      "resizeWrapper",
      "resizeEvents",
      "refreshOnPageBeforeShow",
      "fixInput",
      "wrapperAdd",
      "refreshDelay",
      "scrollShortContent",
      "removeWrapperPadding",
      "addScrollerPadding",
      "createScroller",
      "deferNonActiveRefresh",
      "preventTouchHover",
      "deferNonActiveResize",
      "bindIscrollUsingJqueryEvents",
      "scrollTopOnResize",
      "scrollTopOnOrientationChange",
      "pullDownResetText",
      "pullDownPulledText",
      "pullDownLoadingText",
      "pullUpResetText",
      "pullUpPulledText",
      "pullUpLoadingText",
      "pullPulledClass",
      "pullLoadingClass",
      "onpulldownreset",
      "onpulldownpulled",
      "onpulldown",
      "onpullupreset",
      "onpulluppulled",
      "onpullup",
      "onbeforerefresh",
      "onafterrefresh",
      "fastDestroy"
      ],

    //-----------------------------------------------------------------------
    // Map of widget event names to corresponding iscroll4 object event names
    //-----------------------------------------------------------------------
    _event_map: {
      onrefresh:           "onRefresh",
      onbeforescrollstart: "onBeforeScrollStart",
      onscrollstart:       "onScrollStart",
      onbeforescrollmove:  "onBeforeScrollMove",
      onscrollmove:        'onScrollMove',
      onbeforescrollend:   'onBeforeScrollEnd',
      onscrollend:         "onScrollEnd",
      ontouchend:          "onTouchEnd",
      ondestroy:           "onDetroy",
      onzoomstart:         "onZoomStart",
      onzoom:              "onZoom",
      onzoomend:           "onZoomEnd"
      },

    //------------------------------------------------------------------------------
    // Functions that adapt iscroll callbacks to Widget Factory conventions.
    // These are copied to the iscroll object's options object on instantiation.
    // They  call the private _trigger method provided by the widget factory
    // base object. Normally, iscroll4 callbacks can be null or omitted. But since
    // we can't know in advance whether the corresponding widget events might be bound
    // or delegated in the future, we have set a callback for each that calls _trigger.
    // This will call the corresponding widget callback as well as trigger the
    // corresponding widget event if bound.
    //
    // Event callbacks are passed two values:
    //
    //  e   The underlying DOM event (if any) associated with this event
    //  d   Data map
    //        iscrollview : The iscrollview object
    //------------------------------------------------------------------------------

    _proxy_event_funcs: {

      onRefresh: function(e) {
        this._doCallback("onRefresh", e, function(e) {
          this._emulateBottomOffset();
          this.iscrollview._pullOnRefresh.call(this.iscrollview,e);
          });
        },

      onBeforeScrollStart: function(e) {
        this._doCallback("onBeforeScrollStart", e, function(e) {
          this._fixInput(e);
          });
        },

      onScrollStart:       function(e) { this._doCallback("onScrollStart",      e); },

      onBeforeScrollMove:  function(e) {
        this._doCallback("onBeforeScrollMove", e);
        e.preventDefault();    // Don't scroll the page for touchmove inside scroller
        },

      onScrollMove: function(e) {
        this._doCallback("onScrollMove", e, function(e) {
          this.iscrollview._pullOnScrollMove.call(this.iscrollview, e);
          });
        },

      onBeforeScrollEnd:   function(e) { this._doCallback("onBeforeScrollEnd", e); },

      onScrollEnd: function(e) {
        this._doCallback("onScrollEnd", e, function(e){
          this.iscrollview._pullOnScrollEnd.call(this.iscrollview, e);
          });
        },

      onTouchEnd:          function(e) { this._doCallback("onTouchEnd",  e); },
      onDestroy:           function(e) { this._doCallback("onDestroy",   e); },
      onZoomStart:         function(e) { this._doCallback("onZoomStart", e); },
      onZoom:              function(e) { this._doCallback("onZoom",      e); },
      onZoomEnd:           function(e) { this._doCallback("onZoomEnd",   e); }
      },

  // Merge options from the iscroll object into the widget options
  // So, this will backfill iscroll4 defaults that we don't set in
  // the widget, giving a full set of iscroll options, and leaving
  // widget-only options untouched.
  _merge_from_iscroll_options: function() {
    var options = $.extend(true, {}, this.iscroll.options);
    // Delete event options from the temp options
    $.each(this._proxy_event_funcs, function(k,v) {delete options[k];});
    if (this.options.emulateBottomOffset) { delete options.bottomOffset; }
    $.extend(this.options, options);   // Merge result into widget options
    },

  // Create a set of iscroll4 object options from the widget options.
  // We have to omit any widget-specific options that are
  // not also iscroll4 options. Also, copy the proxy event functions to the
  // iscroll4 options.
  _create_iscroll_options: function() {
    var options = $.extend(true, {}, this.options);  // temporary copy of widget options
    // Remove options that are widget-only options
    $.each(this._widgetOnlyOptions, function(i,v) {delete options[v];});
    // Remove widget event options
    $.each(this._event_map, function(k,v) {delete options[k];});
    if (this.options.emulateBottomOffset) { delete options.bottomOffset; }
    // Add proxy event functions
    return $.extend(options, this._proxy_event_funcs);
    },

  // Formats number with fixed digits
  _pad: function(num, digits, padChar) {
    var str = num.toString(),
        _padChar = padChar || "0";
    while (str.length < digits) { str = _padChar + str; }
    return str;
  },

  // Format time for logging
  _toTime: function(date) {
    return this._pad(date.getHours(), 2) + ":" +
           this._pad(date.getMinutes(), 2) + ":" +
           this._pad(date.getSeconds(), 2) + "." +
           this._pad(date.getMilliseconds(), 3);
  },

  // Log a message to console
  // text - message to log
  // now - optional timestamp, if missing generates new timestamp
  // Returns timestamp
  _log: function(text, now) {
    var _now, id, idStr;
    if (!this.options.debug) { return null; }
    _now = now || new Date();
    id = this.$wrapper.attr("id");
    idStr = id ? "#" + id : "";
    console.log(this._toTime(_now) + " " +
                $.mobile.path.parseUrl(this.$page.jqmData("url")).filename + idStr + " " +
                text );
    return _now;
  },

  // Log elapsed time from then to now
  _logInterval: function(text, then) {
    var now;
    if (!this.options.debug) { return null; }
    now = new Date();
    return this._log(text + " " + (now - then) + "mS from " + this._toTime(then), now );
    },

  // Log an event
  // Like _logInterval, but additional optional parameter e
  // If e is present, additionally show interval from original event to now
  _logEvent: function(text, e, then) {
    var now,
        eventTime,
        haveEvent = e && e instanceof Object,
        type = haveEvent ? e.type : e,
        _text = type + " " + text;

    if (!this.options.debug) { return null; }

    now = new Date();

    if (then) {
      _text += " end " + (+(now-then)) + "mS from " + this._toTime(then);
      }
    else if (haveEvent) {
      _text += " begin";
    }
    if (haveEvent) {
      eventTime = new Date(e.timeStamp);
      _text +=  " (" +  (now - eventTime) + "mS from " +e.type + " @ " + this._toTime(eventTime) + ")";
      }

    return this._log(_text, now);
  },

  // Log a callback issued by iScroll
  _logCallback: function(callbackName, e, then) {
    if (!this.options.debug ||
        !this.options.traceIscrollCallbacks ||
       (this.options.tracedIscrollCallbacks.length !== 0 &&
        $.inArray(callbackName, this.options.tracedIscrollCallbacks) === -1) ) {
      return null;
      }
    if (e)         { return this._logEvent(callbackName, e, then); }
    if (then)      { return this._logInterval(callbackName + " end", then); }
    return this._log(callbackName + " begin");
  },

  // Log an event handled by Iscroll
  // e can be Event or event name
  _logIscrollEvent: function(text, e, then) {
    var haveEvent = e instanceof Event,
        type = haveEvent ? e.type : e;
    if (!this.options.debug ||
        !this.options.traceIscrollEvents ||
        (this.options.tracedIscrollEvents.length !== 0 &&
         $.inArray(type, this.options.tracedIscrollEvents) === -1)) {
      return null;
      }
    return this._logEvent(text, e, then);
  },

  // Log an event handled by the widget
  _logWidgetEvent: function(text, e, then) {
    var haveEvent = e instanceof Object,
        type = haveEvent ? e.type : e;
    if (!this.options.debug ||
        !this.options.traceWidgetEvents ||
        (this.options.tracedWidgetEvents.length !== 0 &&
         $.inArray(type, this.options.tracedWidgetEvents) === -1)) {
      return null;
      }
    return this._logEvent(text, e, then);
  },

  // Log a callback issued by the widtet
  _logWidgetCallback: function(callbackName, e, then) {
    if (!this.options.debug ||
        !this.options.traceWidgetCallbacks ||
       (this.options.tracedWidgetCallbacks.length !== 0 &&
        $.inArray(callbackName, this.options.tracedWidgetCallbacks) === -1) ) {
      return null;
      }
    if (e)         { return this._logEvent(callbackName, e, then); }
    if (then)      { return this._logInterval(callbackName + " end", then); }
    return this._log(callbackName + " begin");
  },

  // Log elapsed time from then to now and later to now
  _logInterval2: function(text, then, later) {
    var now;
    if (!this.options.debug) { return; }
    now = new Date();
    this._log(text + " " +
              (now - later) + "mS from " + this._toTime(later) +
              " (" + (now - then) + "mS from " + this._toTime(then) + ")" );
    },

  _startTiming: function() {
    if (!this.options.debug) { return null; }
    return new Date();
    },

  // Returns the event namespace for the page containing this widget
  _pageEventNamespace: function() {
    return ".iscroll_" + this.pageID;
  },

   // Returns the event namespace for this widget
  _instanceEventNamespace: function() {
    return this._pageEventNamespace() + "_" + this.instanceID;
  },

  // Takes a space-separated list of event types, and appends the given namespace to each
  _addEventsNamespace: function(types_in, namespace) {
    var types = types_in.split(" ");
    $.each(types, function(k,v) {types[k] += namespace;});
    return types.join(" ");
  },

  // All bind/unbind done by the widget goes through here, to permit logging
  // Note: this used to be called _bind, but starting with JQM 1.2, this is a naming conflict with
  // the Widget Factory code in JQM
  _isvBind: function(obj, types_in, func, objName) {
    var types = this._addEventsNamespace(types_in, this._instanceEventNamespace());
    this._logWidgetEvent("bind " + objName, types);
    obj.bind(types, $.proxy(func, this));
  },

  _bindPage: function(types_in, func) {
    var types = this._addEventsNamespace(types_in, this._pageEventNamespace());
    this._logWidgetEvent("bind $page", types);
    this.$page.bind(types, $.proxy(func, this));
  },

  _isvUnbind: function(obj, types_in, objName) {
    var types = this._addEventsNamespace(types_in, this._instanceEventNamespace());
    this._logWidgetEvent("unbind " + objName, types);
    obj.unbind(types);
  },

  _unbindPage: function(types_in) {
    var types = this._addEventsNamespace(types_in, this._instanceEventNamespace());
    this._logWidgetEvent("unbind  $page", types);
    this.$page.unbind(types);
  },

  // Currently unused - just in case we need it
  _delegate: function(obj, selector, type, func, objName) {
    this._logWidgetEvent("delegate " + objName + " " + selector, type);
    obj.delegate(selector, type, $.proxy(func, this));
  },

  _triggerWidget: function(type, e) {
    var then = this._logWidgetCallback(type);
    this._trigger(type, e, {"iscrollview":this});
    this._logWidgetCallback(type, e, then);
  },

  //-------------------------------------------------------------------
  // Returns status of dirty flag, indicating that refresh() was called
  // while the page was not active, and refresh will be deferred until
  // pagebeforeshow.
  //-------------------------------------------------------------------
  isDirty: function() {
    return this._dirty;
    },

  //-----------------------------------------------------------------------------
  // Restore an element's styles to original

  // If the style was never modified by the widget, the value passed in
  // originalStyle will be undefined.
  //
  //If there originally was no style attribute, but styles were added by the
  // widget, the value passed in originalStyle will be null.
  //
  // If there originally was a style attribute, but the widget modified it
  // (actually, set some CSS, which changes the style, the value is a string in
  // originalStyle.
  //-----------------------------------------------------------------------------
  _restoreStyle: function($ele, originalStyle) {
    if (originalStyle === undefined) { return; }
    if (originalStyle === null)      { $ele.removeAttr("style"); }
    else                             { $ele.attr("style", originalStyle); }
    },

  //------------------------------------------------------------------------------
  // Functions that we bind to. They are declared as named members rather than as
  // inline closures so we can properly unbind them.
  //------------------------------------------------------------------------------
  _pageBeforeShowFunc: function(e) {
   var then = this._logWidgetEvent("_pageBeforeShowFunc", e);
   if (this._dirty) {
     this.resizeWrapper();
     this.refresh(null, this._dirtyCallbackBefore, this._dirtyCallbackAfter, true);
     this._dirty = false;
     this._dirtyCallbackBefore = null;
     this._dirtyCallbackAfter = null;
     }
   else if (this.options.refreshOnPageBeforeShow || this._sizeDirty) {
      this.refresh(null,$.proxy(this._resizeWrapper, this),null,true);
      }
   this._sizeDirty = false;
   this._logWidgetEvent("_pageBeforeShowFunc", e, then);
   },

  // Called on resize events
  // TODO: Detect if size is unchanged, and if so just ignore?
  _windowResizeFunc: function(e) {
    var then = this._logWidgetEvent("_windowResizeFunc", e);
    // Defer if not active page
    if (this.options.deferNonActiveResize && !(this.$page.is($.mobile.activePage))) {
      this._sizeDirty = true;
      if (this.options.traceResizeWrapper) { this._log("resizeWrapper() (deferred)"); }
      }
    else {
      this.resizeWrapper();
      this.refresh(null,null,null,true);
      }
    this._logWidgetEvent("_windowResizeFunc", e, then);
    },

  // On some platforms (iOS, for example) you need to scroll back to top after orientation change,
  // because the address bar pushed the window down. jQuery Mobile handles this for page links,
  // but doesn't for orientationchange
  _orientationChangeFunc: function(e) {
    var then = this._logWidgetEvent("_orientationChangeFunc", e);
    if (this.options.scrollTopOnOrientationChange) {
      $.mobile.silentScroll(0);
      }
    this._logWidgetEvent("_orientationChangeFunc", e, then);
    },

   // Called when jQuery Mobile updates content such that a reflow is needed. This happens
   // on collapsible content, etc.
    _updateLayoutFunc: function(e) {
      this.refresh();
  },

  // Get or set the count of instances on the page containing the widget
  // This increases or decreases depending on the number of iscrollview widgets currently
  // instantiated on the page.
  _instanceCount: function(count_in) {
    var key = "iscroll-private",
        count = 0,
        data = this.$page.jqmData(key) || {};
    if (count_in !== undefined) {
      count = count_in;
      data.instanceCount = count;
      this.$page.jqmData(key, data);
      }
    else {
      if (data.instanceCount !== undefined) {
        count = data.instanceCount;
        }
      }
    return count;
  },

  _nextInstanceID: function(id_in) {
    var key = "iscroll-private",
        id = 1,
        data = this.$page.jqmData(key) || {};
    if (id_in !== undefined) {
      id = id_in;
      data.nextInstanceID = id;
      this.$page.jqmData(key, data);
      }
    else {
      if (data.nextInstanceID !== undefined) {
        id = data.nextInstanceID;
        }
      }
    return id;
  },

  _pageID: function(id_in) {
    var key = "iscroll-private",
        id = 1,
        data = this.$page.jqmData(key) || {};
    if (id_in !== undefined) {
      id = id_in;
      data.pageID = id;
      this.$page.jqmData(key, data);
      }
    else {
      if (data.pageID !== undefined) {
        id = data.pageID;
        }
      }
    return id;
  },

  //--------------------------------------------------------------------------
  // Adapt the page for this widget
  //--------------------------------------------------------------------------
  _adaptPage: function() {
    var _this = this;

    // Only adapt the page if this is the only iscrollview widget instantiated on the page
    // If the count >1, then the page has already been adapted. When the count goes back
    // to 0, the changes will be un-done
    if (this._instanceCount() === 1) {
      this.$page.addClass(this.options.pageClass);
      this.$page.find(this.options.fixedHeightSelector).each(function() {  // Iterate over headers/footers/etc.
        $(this).addClass(_this.options.fixedHeightClass);
        });
      if (HasTouch && this.options.preventPageScroll) {
        this._bindPage("touchmove", _pageTouchmoveFunc);
        }
      }
    },

  _undoAdaptPage: function() {
    var _this = this;
    if (this._instanceCount() === 1) {
      this.$page.find(this.options.fixedHeightSelector).each(function() {  // Iterate over headers/footers/etc.
        $(this).removeClass(_this.options.fixedHeightClass);
        });
      this.$page.removeClass(this.options.pageClass);
      }
    },

  //--------------------------------------------------------
  // Calculate total bar heights.
  //--------------------------------------------------------
  _calculateBarsHeight: function() {
    var barsHeight = 0,
        fixedHeightSelector = "." + this.options.fixedHeightClass,
        // Persistent footers are sometimes inside the page, sometimes outside of all pages! (as
        // direct descendant of <body>). And sometimes both. During transitions, the page that
        // is transitioning in will have had it's persistent footer moved outside of the page,
        // while all other pages will have their persistent footer internal to the page.
        //
        // To deal with this, we find iscroll-fixed elements in the page, as well as outside
        // of the page (as direct descendants of <body>). We avoid double-counting persistent
        // footers that have the same data-id. (Experimentally, then, we also permit the user
        // to place fixed-height elements outside of the page, but unsure if this is of any
        // practical use.)
        $barsInPage = this.$page.find(fixedHeightSelector),
        $barsOutsidePage = $("body").children(fixedHeightSelector);

    $barsInPage.each(function() {  // Iterate over headers/footers/etc.
        barsHeight += $(this).outerHeight(true);
        });

    $barsOutsidePage.each(function() {
      var id = $(this).jqmData("id");  // Find data-id if present
      // Count bars outside of the page if they don't have data-id (so not a persistent
      // footer, but something the developer put there and tagged with data-iscroll-fixed class),
      // or if a matching data-id is NOT found among the bars that are inside the page.
      if (id === "" || !$barsInPage.is( ":jqmData(id='" + id + "')" )) {
        barsHeight += $(this).outerHeight(true);
        }
      });
    return barsHeight;
    },

  //-----------------------------------------------------------------------
  // Determine the box-sizing model of an element
  // While jQuery normalizes box-sizing models when retriving geometry,
  // it doesn't consider it when SETTING geometry. So, this is useful when
  // setting geometry. (e.g. the height of the wrapper)
  //-----------------------------------------------------------------------
  _getBoxSizing: function($elem) {
    var  boxSizing,
         prefix = "";

    if (IsFirefox)     { prefix = "-moz-"; }
    else if (IsWebkit) { prefix = "-webkit-"; } // note: can drop prefix for Chrome >=10, Safari >= 5.1 (534.12)
    boxSizing = $elem.css(prefix + "box-sizing");
    if (!boxSizing && prefix) { boxSizing = $elem.css("box-sizing"); }  // Not found, try again with standard CSS
    if (!boxSizing) {     // Still not found - no CSS property available to guide us.
      // See what JQuery thinks the global box model is
      if ($.boxModel) { boxSizing = "content-box"; }
      else            { boxSizing = "border-box"; }
      }
    return boxSizing;
    },

  //-----------------------------------------------------------------
  // Get the height adjustment for setting the height of an element,
  // based on the content-box model
  //-----------------------------------------------------------------
  _getHeightAdjustForBoxModel: function($elem) {
    // Take into account the box model. This defaults to either W3C or traditional
    // model for a given browser, but can be overridden with CSS
    var adjust;
    switch (this._getBoxSizing($elem)) {
      case "border-box":      // AKA traditional, or IE5 (old browsers and IE quirks mode)
        // only subtract margin
        adjust = $elem.outerHeight(true) - $elem.outerHeight();
        break;

      case "padding-box":    // Firefox-only
        // subtract margin and border
        adjust = $elem.outerHeight() - $elem.height();
        break;

      case "content-box":     // AKA W3C  Ignore jshint warning
      default:                // Ignore jslint warning
        // We will subtract padding, border, margin
        adjust = $elem.outerHeight(true) - $elem.height();
        break;
      }
    return adjust;
    },

  //--------------------------------------------------------
  // If there's a pull-down element, we need to set the
  // topOffset to the height of that element. If user
  // specified a topOffset option, use that instead, though.
  //--------------------------------------------------------
  _setTopOffsetForPullDown: function() {
    if (this.$pullDown.length && !this.options.topOffset) {
      this.options.topOffset = this.$pullDown.outerHeight(true);
      }
    },

  //--------------------------------------------------------
  // If there's a pull-up element, we need to set the
  // bottomOffset to the height of that element. If user
  // specified a bottomOffset option, use that instead, though.
  //--------------------------------------------------------
  _setBottomOffsetForPullUp: function() {
    if (this.$pullUp.length && !this.options.bottomOffset) {
      this.options.bottomOffset = this.$pullUp.outerHeight(true);
      }
    },

   _removeWrapperPadding: function() {
     var $wrapper = this.$wrapper;
     if (this.options.removeWrapperPadding) {
       // Save padding so we can re-apply it to the iscroll-content div that we create
       this._origWrapperPaddingLeft   = $wrapper.css("padding-left");
       this._origWrapperPaddingRight  = $wrapper.css("padding-right");
       this._origWrapperPaddingTop    = $wrapper.css("padding-top");
       this._origWrapperPaddingBottom = $wrapper.css("padding-bottom");
       this.$wrapper.css("padding", 0);
       }
   },

  //---------------------------------------------------------
  // Modify some wrapper CSS
  //---------------------------------------------------------
  _modifyWrapperCSS: function() {
    this._origWrapperStyle = this.$wrapper.attr("style") || null;
    this._removeWrapperPadding();
    },

  _undoModifyWrapperCSS: function() {
    this._restoreStyle(this.$wrapper, this._origWrapperStyle);
    },

  //---------------------------------------------------------
  // Adds padding around scrolled content (not including
  // any pull-down or pull-up) using a div with padding
  // removed from wrapper.
  //---------------------------------------------------------
  _addScrollerPadding: function () {
  if (this.options.removeWrapperPadding && this.options.addScrollerPadding) {
    // We do not store $scrollerContent in the object, because elements might be added/deleted
    // after instantiation. When we undo, we need the CURRENT children in order to unwrap
    var $scrollerContentWrapper,
        $scrollerChildren = this.$scroller.children(),
        $scrollerContent = $scrollerChildren.not(this.$pullDown).not(this.$pullUp).not(this.$pullUpSpacer);
    $scrollerContent.wrapAll("<div/>");

    $scrollerContentWrapper = $scrollerContent.parent().addClass(this.options.scrollerContentClass);
    $scrollerContentWrapper.css({
      "padding-left"   : this._origWrapperPaddingLeft,
      "padding-right"  : this._origWrapperPaddingRight,
      "padding-top"    : this._origWrapperPaddingTop,
      "padding-bottom" : this._origWrapperPaddingBottom
      });
    }
  },

  _undoAddScrollerPadding: function () {
    if (this.options.removeWrapperPadding && this.options.addScrollerPadding) {
      $("." + this.options.scrollerContentClass, this.$scroller).children().unwrap();
      }
    },

  //---------------------------------------------------------
  // Add some convenient classes in case user wants to style
  // wrappers/scrollers that use iscroll.
  //---------------------------------------------------------
  _addWrapperClasses: function() {
    this.$wrapper.addClass(this.options.wrapperClass);
    this.$scroller.addClass(this.options.scrollerClass);
    },

  _undoAddWrapperClasses: function() {
    this.$scroller.removeClass(this.options.scrollerClass);
    this.$wrapper.removeClass(this.options.wrapperClass);
    },

  //--------------------------------------------------------
  // Expands the scroller to fill the wrapper. This permits
  // dragging an empty scroller, or one that is shorter than
  // the wrapper. Otherwise, you could never do pull to
  // refresh if some content wasn't initially present. As
  // well, this pushes any pull-up element down so that it
  // will not be visible until the user pulls up.
  //--------------------------------------------------------
  _expandScrollerToFillWrapper: function() {
    if (this.options.scrollShortContent || this.$pullDown.length || this.pullUp.length) {
      if (this._firstScrollerExpand) {
        this._origScrollerStyle = this.$scroller.attr("style") || null;
        this._firstScrollerExpand = false;
        }

      this.$scroller.css("min-height",
        this.$wrapper.height() +
        (this.$pullDown.length ? this.$pullDown.outerHeight(true) : 0) +
        (this.$pullUp.length ? this.$pullUp.outerHeight(true) : 0)
        );
      }
    },

  _undoExpandScrollerToFillWrapper: function() {
    this._restoreStyle(this.$scroller, this._origScrollerStyle);
    },

  //--------------------------------------------------------
  //Resize the wrapper for the scrolled region to fill the
  // viewport remaining after all fixed-height elements
  //--------------------------------------------------------
  _resizeWrapper: function() {
    var then = null,
         viewportHeight,
         barsHeight,
         newWrapperHeight;

    if (!this.options.resizeWrapper) {
      return;
      }
    if (this.options.traceResizeWrapper) {
      then = this._log("resizeWrapper() start");
      }
    this.$wrapper.trigger("updatelayout");  // Let jQuery mobile update fixed header/footer, collapsables, etc.
    // Get technically-correct viewport height. jQuery documentation is in error on this.
    // The viewport height is NOT in all cases the same as the window height, because the height
    // of window might have been manually set. And, guess what? jQuery Mobile sets it to 99.99%.
    // The viewport is considered the parent of window, and can be retrieved as shown below.
    // At 99.99% and common browser sizes, this is probably not an issue. But let's do it right.
    //viewportHeight = this.$window.height();   // Wrong
    viewportHeight = document.documentElement.clientHeight;
    barsHeight = this._calculateBarsHeight();

    newWrapperHeight =
      viewportHeight -
      barsHeight -                             // Height of fixed bars or "other stuff" outside of the wrapper
      this._wrapperHeightAdjustForBoxModel +   // Make adjustment based on content-box model
      // Note: the following will fail for Safari desktop with Develop/User Agent/iPhone
      // Fake fullscreen or webview by using custom user agent and removing "Safari" from string
      (IsMobileSafari && !IsIPad ? 60 : 0) +  // Add 60px for space recovered from Mobile Safari address bar
      this.options.wrapperAdd;                // User-supplied fudge-factor if needed

    this.$wrapper.css("height", newWrapperHeight);
    this._expandScrollerToFillWrapper();

    if (this.options.traceResizeWrapper) {
      this._logInterval("resizeWrapper() end" + (this._sizeDirty ? " (dirty)" : ""), then);
      }
    },

    resizeWrapper: function () {
      var hidden = this._setPageVisible();
      this._resizeWrapper();
      this._restorePageVisibility(hidden);
    },

  _undoResizeWrapper: function() {
    },

  //---------------------------------------------------------
  // Make various modifications to the wrapper
  //---------------------------------------------------------
  _modifyWrapper: function() {
    this._addWrapperClasses();
    this._modifyWrapperCSS();

    this._wrapperHeightAdjustForBoxModel = this._getHeightAdjustForBoxModel(this.$wrapper);
    },

  _undoModifyWrapper: function() {
    this._undoResizeWrapper();
    this._undoModifyWrapperCSS();
    this._undoAddWrapperClasses();
    },

  //--------------------------------------------------------
  // Modify the pull-down (if any) with reset text
  // Also, read data-iscroll-release and data-iscroll-loading
  // values (if present ) into the corresponding options.
  //--------------------------------------------------------
  _modifyPullDown: function () {
    var $pullDownLabel, pulledText, loadingText;
    if (this.$pullDown.length === 0) { return; }
    $pullDownLabel = $("." + this.options.pullLabelClass, this.$pullDown);
    if ($pullDownLabel.length) {
      this._origPullDownLabelText = $pullDownLabel.text();
      if (this._origPullDownLabelText) { this.options.pullDownResetText = this._origPullDownLabelText; }
      else { $pullDownLabel.text(this.options.pullDownResetText); }
      pulledText = $pullDownLabel.jqmData("iscroll-pulled-text");
      if (pulledText) { this.options.pullDownPulledText = pulledText; }
      loadingText = $pullDownLabel.jqmData("iscroll-loading-text");
      if (loadingText) { this.options.pullDownLoadingText = loadingText; }
      }
    },

  _undoModifyPullDown: function () {
    if (this.$pullDown.length === 0) { return; }
    var $pullDownLabel = $("." + this.options.pullLabelClass, this.$pullDown);
    if ($pullDownLabel.length === 0) { return; }
    $pullDownLabel.text(this._origPullDownLabelText);
  },

  //--------------------------------------------------------
  // Modify the pullup element (if any) to prevent visual
  // glitching. Position at the bottom of the scroller.
  //
  // Modify the pull-up (if any) with reset text
  // Also, read data-iscroll-release and data-iscroll-loading
  // values (if present ) into the corresponding options.
  //--------------------------------------------------------
  _modifyPullUp: function () {
    var $pullUpLabel, pulledText, loadingText;

    if (this.$pullUp.length === 0) { return; }

    // Since we are positioning the pullUp element absolutely, it is pulled out of the
    // document flow. We need to add a dummy <div> with the same height as the pullUp.
    $("<div></div>").insertBefore(this.$pullUp).css(
     "height", this.$pullUp.outerHeight(true) );
    this.$pullUpSpacer = this.$pullUp.prev();
    this.$pullUpSpacer.addClass(this.options.pullUpSpacerClass);

    $pullUpLabel = $("." + this.options.pullLabelClass, this.$pullUp);
    if ($pullUpLabel.length) {
      this._origPullUpLabelText = $pullUpLabel.text();
      if (this._origPullUpLabelText) { this.options.pullUpResetText = this._origPullUpLabelText; }
      else { $pullUpLabel.text(this.options.pullUpResetText); }
      pulledText = $pullUpLabel.jqmData("iscroll-pulled-text");
      if (pulledText) { this.options.pullUpPulledText = pulledText; }
      loadingText = $pullUpLabel.jqmData("iscroll-loading-text");
      if (loadingText) { this.options.pullUpLoadingText = loadingText; }
      }

    },

  _undoModifyPullUp: function () {
    if (this.$pullUp.length === 0) { return; }
    this.$pullUp.prev().remove();  // Remove the dummy div
    if (this._origPullUpLabelText) {
      $("." + this.options.pullLabelClass, this.$pullUp).text(this._origPullUpLabelText);
      }
  },

  _correctPushedDownPage: function() {
    // Scroll to top in case address bar pushed the page down
    if (this.options.resizeWrapper && this.options.scrollTopOnResize) {
      $.mobile.silentScroll(0);
      }
  },

  //----------------------------------------------------------------------
  // Refresh the iscroll object. Insure that refresh is called with proper
  // timing. Call optional before and after refresh callbacks and trigger
  // before and after refresh events.
  //-----------------------------------------------------------------------
  refresh: function(delay, callbackBefore, callbackAfter, noDefer) {

    var _this, _delay, _callbackBefore, _callbackAfter, _noDefer, then;

    // If non-active-page refresh is deferred, make a note of it.
    // Note that each call to refresh() overwrites the callback and context variables.
    // Our expectation is that callback and context will be identical for all such refresh
    // calls. In any case, only the last callback and context will be used. This allows
    // refresh of jQuery Mobile widgets within the scroller to be deferred, as well.
    if (!noDefer && this.options.deferNonActiveRefresh && !(this.$page.is($.mobile.activePage))) {
      this._dirty = true;
      this._dirtyCallbackBefore = callbackBefore;
      this._dirtyCallbackAfter = callbackAfter;
      if (this.options.traceRefresh) {
        this._log("refresh() (deferred)");
      }
      return;
    }

  // Let the browser complete rendering, then refresh the scroller
  //
  // Optional delay parameter for timeout before actually calling iscroll.refresh().
  // If missing (undefined) or null, use options.refreshDelay.
  //
  // Optional callback parameters are called if present before and after iScroll internal
  // refresh() is called.  While the caller might bind to the before or after refresh events,
  // this can be more convenient and avoids any ambiguity over WHICH call to refresh is involved.
    _this = this;
    _delay = delay;
    _callbackBefore = callbackBefore;
    _callbackAfter = callbackAfter;
    _noDefer = noDefer;
    then = this._startTiming();
    if ((_delay === undefined) || (_delay === null) ) { _delay = this.options.refreshDelay; }

    setTimeout(function() {
      var later = null,
          hidden;

      if (_this.options.traceRefresh) {
       later =  _this._logInterval("refresh() start", then);
       }

       hidden = _this._setPageVisible();
        if (_callbackBefore) { _callbackBefore(); }
      _this._triggerWidget("onbeforerefresh");
      _this.iscroll.refresh();
      _this._triggerWidget("onafterrefresh");
        if (_callbackAfter) { _callbackAfter(); }
      _this._restorePageVisibility(hidden);

      // Scroll to top in case address bar pushed the page down
      if (!hidden) { _this._correctPushedDownPage(); }

      if (_this.options.traceRefresh) {
        _this._logInterval2("refresh() end" + (_noDefer ? " (dirty)" : ""), then, later);
        }
      }, _delay);

    if (this.options.traceRefresh) {
      this._log("refresh() will occur after >= " + _delay + "mS");
      }

    },


   //---------------------------
   // Create the iScroll object
   //---------------------------
  _create_iscroll_object: function() {
    /*jslint newcap:true */
    this.iscroll = new IScroll(this, this.$wrapper.get(0), this._create_iscroll_options());
    /* jslint newcap:false */
    },

  //-----------------------------------------
  // Create scroller
  //-----------------------------------------
  _createScroller: function() {
    if (this.options.createScroller) {
      if (this.$wrapper.children().length) {
        // Wrap the content with a div
        this.$wrapper.children().wrapAll("<div/>");
        }
      else {
        // Create an empty div for content and wrap with a div
        this.$wrapper.append("<div><div></div></div>");
        }
      }
    },

  _undoCreateScroller: function() {
    if (this.options.createScroller) {
      this.$scroller.children().unwrap();
    }
  },

  // Temporarily change page CSS to make it "visible" so that dimensions can be read.
  // This can be used in any event callback, and so can be used in _create(), since it's called
  // from pageinit event. Because event processing is synchronous, the browser won't render the
  // change, as long as the page style is set back before the callback returns. So, a hidden
  // page will remain hidden as long as _restorePageVisibility() is called before return.
  // This way, we can just use normal dimension functions and avoid using jquery.actual, which
  // slows things down significantly.
  //
  // jquery.actual goes up the tree from the element being measured and sets every element to
  // visible, which is unnecessary. (We only have to be concerned about the page element, which
  // jQuery Mobile sets to display:none for all but the currently-visible page.) It also does this
  // for every dimension read. This essentially does the same thing, but then allows us to "batch"
  // reading dimensions
  _setPageVisible: function() {
    var hidden = this.$page.is(":hidden");
    if (hidden) { this.$page.css("display", "block"); }
    return hidden;
  },

  _restorePageVisibility: function(hidden) {
   if (hidden) { this.$page.css("display", ""); }
  },

  //-----------------------------------------
  // Automatically called on page creation
  //-----------------------------------------
  _create: function() {
    var then = new Date(),
        hidden;

    this.$wrapper = this.element;  // JQuery object containing the element we are creating this widget for
    this.$page = this.$wrapper.parents(":jqmData(role='page')");  // The page containing the wrapper

    if (this.options.debug && this.options.traceCreateDestroy) {
      this._log("_create() start", then);
      }

    this.createdAt = then;
    this._instanceCount(this._instanceCount() + 1);  // The count of extant instances of this widget on the page
    this.instanceID = this._nextInstanceID();       // The serial ID of this instance of this widget on the page
    this._nextInstanceID(this._instanceID + 1);
    if (this.instanceID === 1) {
      this._pageID(nextPageID);
      nextPageID += 1;
    }
    this.pageID = this._pageID();

    hidden = this._setPageVisible();   // Fake page visibility, so dimension functions work
    this._adaptPage();
    this._createScroller();
    this.$scroller = this.$wrapper.children(":first");   // Get the first child of the wrapper, which is the
                                                         //   element that we will scroll
    if (this.$scroller.length === 0) { return; }

    // Find pull elements, if present
    this.$pullDown = $("." + this.options.pullDownClass, this.$scroller);
    this._modifyPullDown();

    this.$pullUp = $("." + this.options.pullUpClass, this.$scroller);
    this._modifyPullUp();

    // Merge options from data-iscroll, if present
    $.extend(true, this.options, this.$wrapper.jqmData("iscroll"));

    this._modifyWrapper();                 // Various changes to the wrapper

    // Need this for deferred refresh processing
    this._bindPage("pagebeforeshow", this._pageBeforeShowFunc);

    this._setTopOffsetForPullDown();  // If there's a pull-down, set the top offset
    this._setBottomOffsetForPullUp(); // If there's a pull-up, set the bottom offset
    this._resizeWrapper();             // Resize the wrapper to fill available space
    this._addScrollerPadding();            // Put back padding removed from wrapper
    this._create_iscroll_object();
    this._merge_from_iscroll_options();     // Merge iscroll options into widget options
    this._restorePageVisibility(hidden);

        // Setup bindings for window resize and orientationchange

    if (this.options.resizeWrapper) {
      this._isvBind(this.$window, this.options.resizeEvents, this._windowResizeFunc, "$window");
      if (this.options.scrollTopOnOrientationChange) {
         this._isvBind(this.$window, "orientationchange", this._orientationChangeFunc, "$window");
         }
      }

    // Refresh on trigger of updatelayout of content
    this.$scrollerContent = this.$scroller.find("." + this.options.scrollerContentClass);
    this._isvBind(this.$scrollerContent, "updatelayout", this._updateLayoutFunc, "$scrollerContent");

    if (this.options.debug && this.options.traceCreateDestroy) {
      this._logInterval("_create() end", then);
      }
    },

  //----------------------------------------------------------
  // Destroy an instantiated plugin and clean up modifications
  // the widget has made to the DOM
  //----------------------------------------------------------
  destroy: function () {
    var then = null;
    if (this.options.debug && this.options.traceCreateDestroy) {
      then = this._log("destroy() start");
      }

    // Unbind events
    this._isvUnbind(this.$scrollerContent, "updatelayout", "$scrollerContent");
    this._isvUnbind(this.$window, this.options.resizeEvents, "$window");
    this._isvUnbind(this.$window, "orientationchange", "$window");
    if (this._instanceCount() === 1) {
      this._unbindPage("pagebeforeshow");
      if (HasTouch) {
      this._unbindPage("touchmove");
      }
    }

    // fastDestroy option skips tearing down the modifications to the page, because we assume
    // that the page itself is being removed, and nobody is going to be silly enough to
    // un-ehance a scroller and keep the page.
    if (!this.options.fastDestroy) {
      this.iscroll.destroy();
      this.iscroll = null;
      this._undoExpandScrollerToFillWrapper();
      this._undoModifyPullDown();
      this._undoModifyPullUp();
      this._undoAddScrollerPadding();
      this._undoModifyWrapper();
      this.$wrapper.removeClass(this.options.wrapperClass);
      this.$scroller.removeClass(this.options.scrollerClass);
      this._undoCreateScroller();
      }

    this._instanceCount(this._instanceCount() - 1);   // The count of extant instances of this widget on the page
    if (this._instanceCount() === 0) {
      this._undoAdaptPage();
    }

    // For UI 1.8, destroy must be invoked from the
    // base widget
    $.Widget.prototype.destroy.call(this);
    if (this.options.debug && this.options.traceCreateDestroy) {
      this._logInterval("destroy() end", then);
      }
     // For UI 1.9, define _destroy instead and don't
     // worry about calling the base widget
    },

  // Enable the widget
  enable: function() {
    this.iscroll.enable();
    $.Widget.prototype.enable.call(this);
    },

  // Disable the widget
  disable: function() {
    this.iscroll.disable();
    $.Widget.prototype.disable.call(this);
    },

    //----------------------------------------------------------
    //Respond to any changes the user makes to the option method
    //----------------------------------------------------------
    _setOption: function( key, value ) {
      var hidden;

      // iScroll4 doesn't officially support changing options after an iscroll object has been
      // instantiated. However, some changes will work if you do a refresh() after changing the
      // option. This is undocumented other than from user comments on the iscroll4 Google
      // Groups support group. If an option change doesn't work with refresh(), then it
      // is necessary to destroy and re-create the iscroll object. This is a functionality
      // that the author of iscroll4 intends to support in the future.
      //
      // TODO: Research which options can be successfully changed without destroying and
      //       re-creating the iscroll object. For now, I'm taking a safe approach and
      //       always destroying and re-creating the iscroll object.
      //switch (key) {
        //case "hScroll":
        //case "vScroll":
        //case "hScrollbar":
        //case "vScrollbar":
          //this.options[ key ] = value;          // Change our options object
          //this.iscroll.options[ key ] = value;  // ... and iscroll's options object
          //this.iscroll.refresh();               // Don't think we need the timing hack here
          //break;

        //default:
          this.options[ key ] = value;
          this.iscroll.destroy();
          hidden = this._setPageVisible();
          this._create_iscroll_object();
          this._restorePageVisibility(hidden);
          //break;
        //}
      // For UI 1.8, _setOption must be manually invoked from
      // the base widget
      $.Widget.prototype._setOption.apply(this, arguments);
      // For UI 1.9 the _super method can be used instead
      // this._super( "_setOption", key, value );
      },

    //----------------------------------------------------
    // Convenience wrappers around iscroll4 public methods
    // So, you can use:
    //
    // $(".some-class").iscrollview("scrollTo", x, y, time, relative);
    //
    // instead of:
    //
    // $(".some-class").jqmData("iscrollview").iscroll.scrollTo(x, y, time, relative);
    //
    //----------------------------------------------------
    scrollTo:        function(x,y,time,relative) { this.iscroll.scrollTo(x,y,time,relative); },
    scrollToElement: function(el,time)           { this.iscroll.scrollToElement(el,time); },
    scrollToPage:    function(pageX,pageY,time)  { this.iscroll.scrollToPage(pageX,pageY,time); },
    stop:            function()                  { this.iscroll.stop(); },
    zoom:            function(x,y,scale,time)    { this.iscroll.zoom(x,y,scale,time); },
    isReady:         function()                  { return this.iscroll.isReady(); },
    // See disable() enable() elsewhere above - they are standard widget methods

    //----------------------------------------------------------------------------------
    // Accessors for iscroll4 internal variables. These are sometimes useful externally.
    // For example, let's say you are adding elements to the end of a scrolled list.
    // You'd like to scroll up (using scrollToElement) if the new element would be
    // below the visible area. But if the list is intially empty, you'd want to avoid
    // this until the scrolling area is initially full. So you need to compare the
    // scroller height (scrollerH) to the wrapper height (wrapperH).
    //
    // These are also useful for creating "pull to refresh" functionality.
    //
    //-----------------------------------------------------------------------------------
    x:          function() { return this.iscroll.x; },
    y:          function() { return this.iscroll.y; },
    wrapperW:   function() { return this.iscroll.wrapperW; },
    wrapperH:   function() { return this.iscroll.wrapperH; },
    scrollerW:  function() { return this.iscroll.scrollerW; },
    scrollerH:  function() { return this.iscroll.scrollerH; },

    // These have setters. Useful for "pull to refresh".
    minScrollX: function(val) { if (val !== undefined) { this.iscroll.minScrollX = val; } return this.iscroll.minScrollX; },
    minScrollY: function(val) { if (val !== undefined) { this.iscroll.minScrollY = val; } return this.iscroll.minScrollY; },
    maxScrollX: function(val) { if (val !== undefined) { this.iscroll.maxScrollX = val; } return this.iscroll.maxScrollX; },
    maxScrollY: function(val) { if (val !== undefined) { this.iscroll.maxScrollY = val; } return this.iscroll.maxScrollY; },

    //-----------------------------------------------------------------------------------
    // Pull-down/Pull-up support
    //-----------------------------------------------------------------------------------
    // Is pull-down in "pulled" state?
    _pullDownIsPulled: function () {
      return this.$pullDown.length && this.$pullDown.hasClass(this.options.pullPulledClass);
      },

    // Is pull-up in "pulled" state?
    _pullUpIsPulled: function () {
      return this.$pullUp.length && this.$pullUp.hasClass(this.options.pullPulledClass);
      },

    // Replace the text in a pull block
    _replacePullText: function ($pull, text) {
      var $label;
      if (text) {
        $label = $("." + this.options.pullLabelClass, $pull);
        if ($label) { $label.text(text); }
        }
      },

    // Reset a pull block to the initial state
    _pullSetStateReset: function ($pull, text) {
      if ($pull.is("." + this.options.pullLoadingClass + ", ." + this.options.pullPulledClass)) {
        $pull.removeClass(this.options.pullPulledClass + " " + this.options.pullLoadingClass);
        this._replacePullText($pull, text);
        }
      },

    _pullDownSetStateReset: function(e) {
        this._pullSetStateReset(this.$pullDown, this.options.pullDownResetText);
      this._triggerWidget("onpulldownreset", e);
      },

    _pullUpSetStateReset: function(e) {
        this._pullSetStateReset(this.$pullUp, this.options.pullUpResetText);
      this._triggerWidget("onpullupreset", e);
      },

    // Set a pull block to pulled state
    _pullSetStatePulled: function($pull, text) {
      $pull.removeClass(this.options.pullLoadingClass).addClass(this.options.pullPulledClass);
      this._replacePullText($pull, text);
      },

    _pullDownSetStatePulled: function(e) {
        this._pullSetStatePulled(this.$pullDown, this.options.pullDownPulledText);
      this._triggerWidget("onpulldownpulled", e);
      },

    _pullUpSetStatePulled: function (e) {
        this._pullSetStatePulled(this.$pullUp, this.options.pullUpPulledText);
      this._triggerWidget("onpulluppulled", e);
      },

    // Set a pull block to the loading state
    _pullSetStateLoading: function($pull, text) {
      $pull.removeClass(this.options.pullPulledClass).addClass(this.options.pullLoadingClass);
      this._replacePullText($pull, text);
      },

    _pullDownSetStateLoading: function (e) {
        this._pullSetStateLoading(this.$pullDown, this.options.pullDownLoadingText);
      this._triggerWidget("onpulldownloading", e);
      },

    _pullUpSetStateLoading: function(e) {
        this._pullSetStateLoading(this.$pullUp, this.options.pullUpLoadingText);
      this._triggerWidget("onpulluploading", e);
     },

    _pullOnRefresh: function (e) {
      // It's debatable if this is the right place to do this. On one hand, it might be best
      // to do this in the pullup/down action function. We expect that we will always do a refresh
      // after the action, though (unless the action doesn't actually update anything, in which
      // case it can still call refresh().) On the other hand, it might be desirable to
      // "reset" the pull if a refresh comes along for some other reason. If the content were
      // updated because of something other than the user's pull action, then we consider the
      // pull moot.

      // Reset pull blocks to their initial state
      if (this.$pullDown.length) { this._pullDownSetStateReset(e); }
      if (this.$pullUp.length)   { this._pullUpSetStateReset(e); }
      },

    _pullOnScrollMove: function (e) {
      var pullDownIsPulled, pullUpIsPulled, pullDownHeight, pullDownPast, pullUpHeight, pullUpPast,
          y = this.y();

      if (this.$pullDown.length) {
        pullDownIsPulled = this._pullDownIsPulled();
        pullDownHeight = this.options.topOffset;
        // User needs to pull down past the top edge of the pulldown element. To prevent false
        // triggers from aggressive scrolling, they should have to pull down some additional
        // amount. Half the height of the pulldown seems reasonable, but adjust per preference.
        pullDownPast = pullDownHeight / 2;

        // Set "pulled" state if not pulled and user has pulled past the pulldown element
        // by pullDownPast pixels
        if (!pullDownIsPulled && y > pullDownPast ) {
          this._pullDownSetStatePulled(e);
          this.minScrollY(0);   // Circumvent top offset so pull-down element doesn't rubber-band
          }

        // Allow user to "oopsie", and scroll back to cancel and avoid pull-down action
        // Cancel if pulled and user has scrolled back to top of pulldown element
        else if (pullDownIsPulled && y <= 0) {
          this._pullDownSetStateReset(e);
          this.minScrollY(-pullDownHeight);  // Re-instate top offset
          }
        }

     if (this.$pullUp.length) {
          pullUpIsPulled = this._pullUpIsPulled();
          pullUpHeight = this.options.bottomOffset;
          pullUpPast = pullUpHeight / 2;
       if (!pullUpIsPulled && y < this.maxScrollY() - pullUpHeight - pullUpPast ) {
         this._pullUpSetStatePulled(e);
         this.maxScrollY(this.wrapperH() - this.scrollerH() + this.minScrollY());
         }

        else if (pullUpIsPulled && y >= this.maxScrollY() ) {
          this._pullUpSetStateReset(e);
          this.maxScrollY(this.wrapperH() - this.scrollerH() + this.minScrollY() + pullUpHeight);
          }
       }

      },

    _pullOnScrollEnd: function (e) {
      if (this._pullDownIsPulled(e)) {
          this._pullDownSetStateLoading(e);
        this._triggerWidget("onpulldown", e);
        }
      else if (this._pullUpIsPulled(e)) {
          this._pullUpSetStateLoading(e);
        this._triggerWidget("onpullup", e);
        }
      }

    });

}( jQuery, window, document ));

// Self-init
jQuery(document).bind("pagecreate", function (e) {
  "use strict";

  // In here, e.target refers to the page that was created (it's the target of the pagecreate event)
  // So, we can simply find elements on this page that match a selector of our choosing, and call
  // our plugin on them.

  // The find() below returns an array of elements within a newly-created page that have
  // the data-iscroll attribute. The Widget Factory will enumerate these and call the widget
  // _create() function for each member of the array.
  // If the array is of zero length, then no _create() fucntion is called.
  var elements = jQuery(e.target).find(":jqmData(iscroll)");
    elements.iscrollview();
  });


