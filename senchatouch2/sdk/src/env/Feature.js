/**
 * @aside guide environment_package
 *
 * A class to detect if the current browser supports various features.
 *
 * Please refer to the documentation of {@link Ext.feature.has} on how to use it.
 *
 *     if (Ext.feature.has.Canvas) {
 *         // do some cool things with canvas here
 *     }
 */
Ext.define('Ext.env.Feature', {

    requires: ['Ext.env.Browser', 'Ext.env.OS'],

    constructor: function() {
        this.testElements = {};

        this.has = function(name) {
            return !!this.has[name];
        };

        return this;
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

    Ext.feature = new this;

    var has = Ext.feature.has;

    /**
     * @class Ext.feature.has
     * A simple class to verify if a browser feature exists or not on the current device.
     *
     *     if (Ext.feature.has.Canvas) {
     *         // do some cool things with canvas here
     *     }
     *
     * See the list of properties below too see which features are available for detection.
     */

    Ext.feature.registerTest({
        /**
         * @member Ext.feature.has
         * @property {Boolean} Canvas
         * True if the current device supports Canvas.
         */
        Canvas: function() {
            var element = this.getTestElement('canvas');
            return !!(element && element.getContext && element.getContext('2d'));
        },

        /**
         * @member Ext.feature.has
         * @property {Boolean} Svg
         * True if the current device supports SVG.
         */
        Svg: function() {
            var doc = document;

            return !!(doc.createElementNS && !!doc.createElementNS("http:/" + "/www.w3.org/2000/svg", "svg").createSVGRect);
        },

        /**
         * @member Ext.feature.has
         * @property {Boolean} Vml
         * True if the current device supports VML.
         */
        Vml: function() {
            var element = this.getTestElement(),
                ret = false;

            element.innerHTML = "<!--[if vml]><br><![endif]-->";
            ret = (element.childNodes.length === 1);
            element.innerHTML = "";

            return ret;
        },

        /**
         * @member Ext.feature.has
         * @property {Boolean} Touch
         * True if the current device supports touch events (`touchstart`).
         */
        Touch: function() {
            return this.isEventSupported('touchstart') && !(Ext.os && Ext.os.name.match(/Windows|MacOS|Linux/));
        },

        /**
         * @member Ext.feature.has
         * @property {Boolean} Orientation
         * True if the current device supports different orientations.
         */
        Orientation: function() {
            return ('orientation' in window) && this.isEventSupported('orientationchange');
        },

        /**
         * @member Ext.feature.has
         * @property {Boolean} OrientationChange
         * True if the current device supports the `orientationchange` event.
         */
        OrientationChange: function() {
            return this.isEventSupported('orientationchange');
        },

        /**
         * @member Ext.feature.has
         * @property {Boolean} DeviceMotion
         * True if the current device supports the `devicemotion` event.
         */
        DeviceMotion: function() {
            return this.isEventSupported('devicemotion');
        },

        /**
         * @member Ext.feature.has
         * @property {Boolean} Geolocation
         * True if the current device supports Geolocation.
         */
        Geolocation: function() {
            return 'geolocation' in window.navigator;
        },

        /**
         * @member Ext.feature.has
         * @property {Boolean} SqlDatabase
         * True if the current device supports SQL Databases.
         */
        SqlDatabase: function() {
            return 'openDatabase' in window;
        },

        /**
         * @member Ext.feature.has
         * @property {Boolean} WebSockets
         * True if the current device supports WebSockets.
         */
        WebSockets: function() {
            return 'WebSocket' in window;
        },

        /**
         * @member Ext.feature.has
         * @property {Boolean} Range
         * True if the current device supports [DOM document fragments.][1]
         *
         * [1]: https://developer.mozilla.org/en/DOM/range
         */
        Range: function() {
            return !!document.createRange;
        },

        /**
         * @member Ext.feature.has
         * @property {Boolean} CreateContextualFragment
         * True if the current device supports HTML fragment parsing using [range.createContextualFragment()][1].
         *
         * [1]: https://developer.mozilla.org/en/DOM/range.createContextualFragment
         */
        CreateContextualFragment: function() {
            var range = !!document.createRange ? document.createRange() : false;
            return range && !!range.createContextualFragment;
        },

        /**
         * @member Ext.feature.has
         * @property {Boolean} History
         * True if the current device supports history management with [history.pushState()][1].
         *
         * [1]: https://developer.mozilla.org/en/DOM/Manipulating_the_browser_history#The_pushState().C2.A0method
         */
        History: function() {
            return ('history' in window && 'pushState' in window.history);
        },

        /**
         * @member Ext.feature.has
         * @property {Boolean} CssTransforms
         * True if the current device supports CSS Transform animations.
         */
        CssTransforms: function() {
            return this.isStyleSupported('transform');
        },

        /**
         * @member Ext.feature.has
         * @property {Boolean} Css3dTransforms
         * True if the current device supports CSS 3D Transform animations.
         */
        Css3dTransforms: function() {
            // See https://sencha.jira.com/browse/TOUCH-1544
            return this.has('CssTransforms') && this.isStyleSupported('perspective') && !Ext.os.is.Android2;
        },

        /**
         * @member Ext.feature.has
         * @property {Boolean} CssAnimations
         * True if the current device supports CSS Animations.
         */
        CssAnimations: function() {
            return this.isStyleSupported('animationName');
        },

        /**
         * @member Ext.feature.has
         * @property {Boolean} CssTransitions
         * True if the current device supports CSS Transitions.
         */
        CssTransitions: function() {
            return this.isStyleSupported('transitionProperty');
        },

        /**
         * @member Ext.feature.has
         * @property {Boolean} Audio
         * True if the current device supports the `<audio>` tag.
         */
        Audio: function() {
            return !!this.getTestElement('audio').canPlayType;
        },

        /**
         * @member Ext.feature.has
         * @property {Boolean} Video
         * True if the current device supports the `<video>` tag.
         */
        Video: function() {
            return !!this.getTestElement('video').canPlayType;
        },

        /**
         * @member Ext.feature.has
         * @property {Boolean} ClassList
         * True if document environment supports the HTML5 classList API.
         */
        ClassList: function() {
            return "classList" in this.getTestElement();
        }
    });

    //<deprecated product=touch since=2.0>
    /**
     * @class Ext.supports
     * Determines information about features are supported in the current environment.
     * @deprecated 2.0.0
     * Please use the {@link Ext.env.Browser}, {@link Ext.env.OS} and {@link Ext.feature.has} classes.
     */

    /**
     * @member Ext.supports
     * @property Transitions
     * @inheritdoc Ext.feature.has#CssTransitions
     * @deprecated 2.0.0 Please use {@link Ext.feature.has#CssTransitions} instead
     */
    Ext.deprecatePropertyValue(has, 'Transitions', has.CssTransitions,
                          "Ext.supports.Transitions is deprecated, please use Ext.feature.has.CssTransitions instead");

    /**
     * @member Ext.supports
     * @property SVG
     * @inheritdoc Ext.feature.has#Svg
     * @deprecated 2.0.0 Please use {@link Ext.feature.has#Svg} instead
     */
    Ext.deprecatePropertyValue(has, 'SVG', has.Svg,
                          "Ext.supports.SVG is deprecated, please use Ext.feature.has.Svg instead");

    /**
     * @member Ext.supports
     * @property VML
     * @inheritdoc Ext.feature.has#Vml
     * @deprecated 2.0.0 Please use {@link Ext.feature.has#Vml} instead
     */
    Ext.deprecatePropertyValue(has, 'VML', has.Vml,
                          "Ext.supports.VML is deprecated, please use Ext.feature.has.Vml instead");

    /**
     * @member Ext.supports
     * @property AudioTag
     * @inheritdoc Ext.feature.has#Audio
     * @deprecated 2.0.0 Please use {@link Ext.feature.has#Audio} instead
     */
    Ext.deprecatePropertyValue(has, 'AudioTag', has.Audio,
                          "Ext.supports.AudioTag is deprecated, please use Ext.feature.has.Audio instead");

    /**
     * @member Ext.supports
     * @property GeoLocation
     * @inheritdoc Ext.feature.has#Geolocation
     * @deprecated 2.0.0 Please use {@link Ext.feature.has#Geolocation} instead
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
