//@tag dom,core

/**
 * Provides information about browser.
 *
 * Should not be manually instantiated unless for unit-testing.
 * Access the global instance stored in {@link Ext.browser} instead.
 * @private
 */
Ext.define('Ext.env.Feature', {

    requires: ['Ext.env.Browser', 'Ext.env.OS'],

    constructor: function() {
        this.testElements = {};

        this.has = function(name) {
            return !!this.has[name];
        };

        if (!Ext.theme) {
            Ext.theme = {
                name: 'Default'
            };
        }

        Ext.theme.is = {};
        Ext.theme.is[Ext.theme.name] = true;

        Ext.onDocumentReady(function() {
            this.registerTest({
                ProperHBoxStretching: function() {
                    // IE10 currently has a bug in their flexbox row layout. We feature detect the issue here.
                    var bodyElement = document.createElement('div'),
                        innerElement = bodyElement.appendChild(document.createElement('div')),
                        contentElement = innerElement.appendChild(document.createElement('div')),
                        innerWidth;

                    bodyElement.setAttribute('style', 'width: 100px; height: 100px; position: relative;');
                    innerElement.setAttribute('style', 'position: absolute; display: -ms-flexbox; display: -webkit-flex; display: -moz-flexbox; display: flex; -ms-flex-direction: row; -webkit-flex-direction: row; -moz-flex-direction: row; flex-direction: row; min-width: 100%;');
                    contentElement.setAttribute('style', 'width: 200px; height: 50px;');
                    document.body.appendChild(bodyElement);
                    innerWidth = innerElement.offsetWidth;
                    document.body.removeChild(bodyElement);

                    return (innerWidth > 100);
                }
            });
        }, this);
    },

    getTestElement: function(tag, createNew) {
        if (tag === undefined) {
            tag = 'div';
        }
        else if (typeof tag !== 'string') {
            return tag;
        }

        if (createNew) {
            return document.createElement(tag);
        }

        if (!this.testElements[tag]) {
            this.testElements[tag] = document.createElement(tag);
        }

        return this.testElements[tag];
    },

    isStyleSupported: function(name, tag) {
        var elementStyle = this.getTestElement(tag).style,
            cName = Ext.String.capitalize(name);

        if (typeof elementStyle[name] !== 'undefined'
            || typeof elementStyle[Ext.browser.getStylePrefix(name) + cName] !== 'undefined') {
            return true;
        }

        return false;
    },

    isStyleSupportedWithoutPrefix: function(name, tag) {
        var elementStyle = this.getTestElement(tag).style;

        if (typeof elementStyle[name] !== 'undefined') {
            return true;
        }

        return false;
    },

    isEventSupported: function(name, tag) {
        if (tag === undefined) {
            tag = window;
        }

        var element = this.getTestElement(tag),
            eventName = 'on' + name.toLowerCase(),
            isSupported = (eventName in element);

        if (!isSupported) {
            if (element.setAttribute && element.removeAttribute) {
                element.setAttribute(eventName, '');
                isSupported = typeof element[eventName] === 'function';

                if (typeof element[eventName] !== 'undefined') {
                    element[eventName] = undefined;
                }

                element.removeAttribute(eventName);
            }
        }

        return isSupported;
    },

    getSupportedPropertyName: function(object, name) {
        var vendorName = Ext.browser.getVendorProperyName(name);

        if (vendorName in object) {
            return vendorName;
        }
        else if (name in object) {
            return name;
        }

        return null;
    },

    registerTest: Ext.Function.flexSetter(function(name, fn) {
        this.has[name] = fn.call(this);

        return this;
    })

}, function() {

    /**
     * @class Ext.feature
     * @extend Ext.env.Feature
     * @singleton
     *
     * A simple class to verify if a browser feature exists or not on the current device.
     *
     *     if (Ext.feature.has.Canvas) {
     *         // do some cool things with canvas here
     *     }
     *
     * See the {@link #has} property/method for details of the features that can be detected.
     *
     * @aside guide environment_package
     */
    Ext.feature = new this;

    var has = Ext.feature.has;

    /**
     * @method has
     * @member Ext.feature
     * Verifies if a browser feature exists or not on the current device.
     *
     * A "hybrid" property, can be either accessed as a method call, i.e:
     *
     *     if (Ext.feature.has('Canvas')) {
     *         // ...
     *     }
     *
     * or as an object with boolean properties, i.e:
     *
     *     if (Ext.feature.has.Canvas) {
     *         // ...
     *     }
     *
     * Possible properties/parameter values:
     *
     * - Canvas
     * - Svg
     * - Vml
     * - Touch - supports touch events (`touchstart`).
     * - Orientation - supports different orientations.
     * - OrientationChange - supports the `orientationchange` event.
     * - DeviceMotion - supports the `devicemotion` event.
     * - Geolocation
     * - SqlDatabase
     * - WebSockets
     * - Range - supports [DOM document fragments.][1]
     * - CreateContextualFragment - supports HTML fragment parsing using [range.createContextualFragment()][2].
     * - History - supports history management with [history.pushState()][3].
     * - CssTransforms
     * - Css3dTransforms
     * - CssAnimations
     * - CssTransitions
     * - Audio - supports the `<audio>` tag.
     * - Video - supports the `<video>` tag.
     * - ClassList - supports the HTML5 classList API.
     * - LocalStorage - LocalStorage is supported and can be written to.
     * - NumericInputPlaceHolder - Supports placeholders on numeric input fields
     * - XHR2 - Supports XMLHttpRequest 
     * - XHRUploadProgress - Supports XMLHttpRequest upload progress info
     *
     * [1]: https://developer.mozilla.org/en/DOM/range
     * [2]: https://developer.mozilla.org/en/DOM/range.createContextualFragment
     * [3]: https://developer.mozilla.org/en/DOM/Manipulating_the_browser_history#The_pushState().C2.A0method
     *
     * @param {String} value The feature name to check.
     * @return {Boolean}
     */
    Ext.feature.registerTest({
        Canvas: function() {
            var element = this.getTestElement('canvas');
            return !!(element && element.getContext && element.getContext('2d'));
        },

        Svg: function() {
            var doc = document;

            return !!(doc.createElementNS && !!doc.createElementNS("http:/" + "/www.w3.org/2000/svg", "svg").createSVGRect);
        },

        Vml: function() {
            var element = this.getTestElement(),
                ret = false;

            element.innerHTML = "<!--[if vml]><br><![endif]-->";
            ret = (element.childNodes.length === 1);
            element.innerHTML = "";

            return ret;
        },

        Touch: function() {
            return Ext.browser.is.Ripple || (this.isEventSupported('touchstart') && !(Ext.os && Ext.os.name.match(/Windows|MacOS|Linux/) && !Ext.os.is.BlackBerry6));
        },

        Pointer: function() {
            return !!window.navigator.msPointerEnabled;
        },

        Orientation: function() {
            return ('orientation' in window) && this.isEventSupported('orientationchange');
        },

        OrientationChange: function() {
            return this.isEventSupported('orientationchange');
        },

        DeviceMotion: function() {
            return this.isEventSupported('devicemotion');
        },

        Geolocation: function() {
            return 'geolocation' in window.navigator;
        },

        SqlDatabase: function() {
            return 'openDatabase' in window;
        },

        WebSockets: function() {
            return 'WebSocket' in window;
        },

        Range: function() {
            return !!document.createRange;
        },

        CreateContextualFragment: function() {
            var range = !!document.createRange ? document.createRange() : false;
            return range && !!range.createContextualFragment;
        },

        History: function() {
            return ('history' in window && 'pushState' in window.history);
        },

        CssTransforms: function() {
            return this.isStyleSupported('transform');
        },

        CssTransformNoPrefix: function() {
            return this.isStyleSupportedWithoutPrefix('transform');
        },

        Css3dTransforms: function() {
            // See https://sencha.jira.com/browse/TOUCH-1544
            return this.has('CssTransforms') && this.isStyleSupported('perspective') && !Ext.browser.is.AndroidStock2;
        },

        CssAnimations: function() {
            return this.isStyleSupported('animationName');
        },

        CssTransitions: function() {
            return this.isStyleSupported('transitionProperty');
        },

        Audio: function() {
            return !!this.getTestElement('audio').canPlayType;
        },

        Video: function() {
            return !!this.getTestElement('video').canPlayType;
        },

        ClassList: function() {
            return "classList" in this.getTestElement();
        },

        LocalStorage : function() {
            var supported = false;

            try {
                if ('localStorage' in window && window['localStorage'] !== null) {
                    //this should throw an error in private browsing mode in iOS
                    localStorage.setItem('sencha-localstorage-test', 'test success');
                    //clean up if setItem worked
                    localStorage.removeItem('sencha-localstorage-test');
                    supported = true;
                }
            } catch ( e ) {}

            return supported;
        },

        XHR2 : function() {
          return window.ProgressEvent && window.FormData && window.XMLHttpRequest && ('withCredentials' in new XMLHttpRequest);
        },

        XHRUploadProgress : function() {
            if(window.XMLHttpRequest && !Ext.browser.is.AndroidStock) {
                var xhr = new XMLHttpRequest();
                return xhr && ('upload' in xhr) && ('onprogress' in xhr.upload);
            }
            return false;
        },

        NumericInputPlaceHolder: function() {
            return !(Ext.browser.is.AndroidStock4 && Ext.os.version.getMinor() < 2);
        }
    });

    //<deprecated product=touch since=2.0>
    /**
     * @class Ext.supports
     * Determines information about features are supported in the current environment.
     * @deprecated 2.0.0
     * Please use the {@link Ext.browser}, {@link Ext.os} and {@link Ext.feature} classes.
     */

    /**
     * @member Ext.supports
     * @property Transitions
     * True if current device supports CSS transitions.
     * @deprecated 2.0.0 Please use {@link Ext.feature#has}.CssTransitions instead
     */
    Ext.deprecatePropertyValue(has, 'Transitions', has.CssTransitions,
                          "Ext.supports.Transitions is deprecated, please use Ext.feature.has.CssTransitions instead");

    /**
     * @member Ext.supports
     * @property SVG
     * True if current device supports SVG.
     * @deprecated 2.0.0 Please use {@link Ext.feature#has}.Svg instead
     */
    Ext.deprecatePropertyValue(has, 'SVG', has.Svg,
                          "Ext.supports.SVG is deprecated, please use Ext.feature.has.Svg instead");

    /**
     * @member Ext.supports
     * @property VML
     * True if current device supports VML.
     * @deprecated 2.0.0 Please use {@link Ext.feature#has}.Vml instead
     */
    Ext.deprecatePropertyValue(has, 'VML', has.Vml,
                          "Ext.supports.VML is deprecated, please use Ext.feature.has.Vml instead");

    /**
     * @member Ext.supports
     * @property AudioTag
     * True if current device supports `<audio>` tag.
     * @deprecated 2.0.0 Please use {@link Ext.feature#has}.Audio instead
     */
    Ext.deprecatePropertyValue(has, 'AudioTag', has.Audio,
                          "Ext.supports.AudioTag is deprecated, please use Ext.feature.has.Audio instead");

    /**
     * @member Ext.supports
     * @property GeoLocation
     * True if current device supports geolocation.
     * @deprecated 2.0.0 Please use {@link Ext.feature#has}.Geolocation instead
     */
    Ext.deprecatePropertyValue(has, 'GeoLocation', has.Geolocation,
                          "Ext.supports.GeoLocation is deprecated, please use Ext.feature.has.Geolocation instead");
    var name;

    if (!Ext.supports) {
        Ext.supports = {};
    }

    for (name in has) {
        if (has.hasOwnProperty(name)) {
            Ext.deprecatePropertyValue(Ext.supports, name, has[name], "Ext.supports." + name + " is deprecated, please use Ext.feature.has." + name + " instead");
        }
    }
    //</deprecated>
});
