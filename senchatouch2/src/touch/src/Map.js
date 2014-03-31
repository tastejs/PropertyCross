/**
 * Wraps a Google Map in an Ext.Component using the [Google Maps API](http://code.google.com/apis/maps/documentation/v3/introduction.html).
 *
 * To use this component you must include an additional JavaScript file from Google:
 *
 *     <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
 *
 * ## Example
 *
 *     Ext.Viewport.add({
 *         xtype: 'map',
 *         useCurrentLocation: true
 *     });
 *
 * @aside example maps
 */
Ext.define('Ext.Map', {
    extend: 'Ext.Container',
    xtype : 'map',
    requires: ['Ext.util.Geolocation'],

    isMap: true,

    config: {
        /**
         * @event maprender
         * Fired when Map initially rendered.
         * @param {Ext.Map} this
         * @param {google.maps.Map} map The rendered google.map.Map instance
         */

        /**
         * @event centerchange
         * Fired when map is panned around.
         * @param {Ext.Map} this
         * @param {google.maps.Map} map The rendered google.map.Map instance
         * @param {google.maps.LatLng} center The current LatLng center of the map
         */

        /**
         * @event typechange
         * Fired when display type of the map changes.
         * @param {Ext.Map} this
         * @param {google.maps.Map} map The rendered google.map.Map instance
         * @param {Number} mapType The current display type of the map
         */

        /**
         * @event zoomchange
         * Fired when map is zoomed.
         * @param {Ext.Map} this
         * @param {google.maps.Map} map The rendered google.map.Map instance
         * @param {Number} zoomLevel The current zoom level of the map
         */

        /**
         * @cfg {String} baseCls
         * The base CSS class to apply to the Map's element
         * @accessor
         */
        baseCls: Ext.baseCSSPrefix + 'map',

        /**
         * @cfg {Boolean/Ext.util.Geolocation} useCurrentLocation
         * Pass in true to center the map based on the geolocation coordinates or pass a
         * {@link Ext.util.Geolocation GeoLocation} config to have more control over your GeoLocation options
         * @accessor
         */
        useCurrentLocation: false,

        /**
         * @cfg {google.maps.Map} map
         * The wrapped map.
         * @accessor
         */
        map: null,

        /**
         * @cfg {Ext.util.Geolocation} geo
         * Geolocation provider for the map.
         * @accessor
         */
        geo: null,

        /**
         * @cfg {Object} mapOptions
         * MapOptions as specified by the Google Documentation:
         * [http://code.google.com/apis/maps/documentation/v3/reference.html](http://code.google.com/apis/maps/documentation/v3/reference.html)
         * @accessor
         */
        mapOptions: {},

        /**
         * @cfg {Object} mapListeners
         * Listeners for any Google Maps events specified by the Google Documentation:
         * [http://code.google.com/apis/maps/documentation/v3/reference.html](http://code.google.com/apis/maps/documentation/v3/reference.html)
         *
         * @accessor
         */
        mapListeners: null
    },

    constructor: function() {
        this.callParent(arguments);
        // this.element.setVisibilityMode(Ext.Element.OFFSETS);

        if (!(window.google || {}).maps) {
            this.setHtml('Google Maps API is required');
        }
    },

    initialize: function() {
        this.callParent();
        this.initMap();

        this.on({
            painted: 'doResize',
            scope: this
        });
        this.innerElement.on('touchstart', 'onTouchStart', this);
    },

    initMap: function() {
        var map = this.getMap();
        if(!map) {
            var gm = (window.google || {}).maps;
            if(!gm) return null;

            var element = this.mapContainer,
                mapOptions = this.getMapOptions(),
                event = gm.event,
                me = this;

            //Remove the API Required div
            if (element.dom.firstChild) {
                Ext.fly(element.dom.firstChild).destroy();
            }

            if (Ext.os.is.iPad) {
                Ext.merge({
                    navigationControlOptions: {
                        style: gm.NavigationControlStyle.ZOOM_PAN
                    }
                }, mapOptions);
            }

            mapOptions.mapTypeId = mapOptions.mapTypeId || gm.MapTypeId.ROADMAP;
            mapOptions.center = mapOptions.center || new gm.LatLng(37.381592, -122.135672); // Palo Alto

            if (mapOptions.center && mapOptions.center.latitude && !Ext.isFunction(mapOptions.center.lat)) {
                mapOptions.center = new gm.LatLng(mapOptions.center.latitude, mapOptions.center.longitude);
            }

            mapOptions.zoom = mapOptions.zoom || 12;

            map = new gm.Map(element.dom, mapOptions);
            this.setMap(map);

            event.addListener(map, 'zoom_changed', Ext.bind(me.onZoomChange, me));
            event.addListener(map, 'maptypeid_changed', Ext.bind(me.onTypeChange, me));
            event.addListener(map, 'center_changed', Ext.bind(me.onCenterChange, me));
            event.addListenerOnce(map, 'tilesloaded', Ext.bind(me.onTilesLoaded, me));
            this.addMapListeners();
        }
        return this.getMap();
    },

    // added for backwards compatibility for touch < 2.3
    renderMap: function() {
        this.initMap();
    },

    getElementConfig: function() {
        return {
            reference: 'element',
            className: 'x-container',
            children: [{
                reference: 'innerElement',
                className: 'x-inner',
                children: [{
                    reference: 'mapContainer',
                    className: Ext.baseCSSPrefix + 'map-container'
                }]
            }]
        };
    },

    onTouchStart: function(e) {
        e.makeUnpreventable();
    },

    applyMapOptions: function(options) {
        return Ext.merge({}, this.options, options);
    },

    updateMapOptions: function(newOptions) {
        var gm = (window.google || {}).maps,
            map = this.getMap();

        if (gm && map) {
            map.setOptions(newOptions);
        }
    },

    doMapCenter: function() {
        this.setMapCenter(this.getMapOptions().center);
    },

    getMapOptions: function() {
        return Ext.merge({}, this.options || this.getInitialConfig('mapOptions'));
    },

    updateUseCurrentLocation: function(useCurrentLocation) {
        this.setGeo(useCurrentLocation);
        if (!useCurrentLocation) {
            this.setMapCenter();
        }
    },

    applyGeo: function(config) {
        return Ext.factory(config, Ext.util.Geolocation, this.getGeo());
    },

    updateGeo: function(newGeo, oldGeo) {
        var events = {
            locationupdate : 'onGeoUpdate',
            locationerror : 'onGeoError',
            scope : this
        };

        if (oldGeo) {
            oldGeo.un(events);
        }

        if (newGeo) {
            newGeo.on(events);
            newGeo.updateLocation();
        }
    },

    doResize: function() {
        var gm = (window.google || {}).maps,
            map = this.getMap();

        if (gm && map) {
            gm.event.trigger(map, "resize");
        }
    },

	// @private
	onTilesLoaded: function() {
		this.fireEvent('maprender', this, this.getMap());
	},

    // @private
    addMapListeners: function() {
        var gm = (window.google || {}).maps,
            map = this.getMap(),
            mapListeners = this.getMapListeners();


        if (gm) {
            var event = gm.event,
                me = this,
                listener, scope, fn, callbackFn, handle;
            if (Ext.isSimpleObject(mapListeners)) {
                for (var eventType in mapListeners) {
                    listener = mapListeners[eventType];
                    if (Ext.isSimpleObject(listener)) {
                        scope = listener.scope;
                        fn = listener.fn;
                    } else if (Ext.isFunction(listener)) {
                        scope = null;
                        fn = listener;
                    }

                    if (fn) {
                        callbackFn = function() {
                            this.fn.apply(this.scope, [me]);
                            if(this.handle) {
                                event.removeListener(this.handle);
                                delete this.handle;
                                delete this.fn;
                                delete this.scope;
                            }
                        };
                        handle = event.addListener(map, eventType, Ext.bind(callbackFn, callbackFn));
                        callbackFn.fn = fn;
                        callbackFn.scope = scope;
                        if(listener.single === true) callbackFn.handle = handle;
                    }
                }
            }
        }
    },

    // @private
    onGeoUpdate: function(geo) {
        if (geo) {
            this.setMapCenter(new google.maps.LatLng(geo.getLatitude(), geo.getLongitude()));
        }
    },

    // @private
    onGeoError: Ext.emptyFn,

    /**
     * Moves the map center to the designated coordinates hash of the form:
     *
     *     { latitude: 37.381592, longitude: -122.135672 }
     *
     * or a google.maps.LatLng object representing to the target location.
     *
     * @param {Object/google.maps.LatLng} coordinates Object representing the desired Latitude and
     * longitude upon which to center the map.
     */
    setMapCenter: function(coordinates) {
        var me = this,
            map = me.getMap(),
            mapOptions = me.getMapOptions(),
            gm = (window.google || {}).maps;
        if (gm) {
            if (!coordinates) {
                if (map && map.getCenter) {
                    coordinates = map.getCenter();
                }
                else if (mapOptions.hasOwnProperty('center')) {
                    coordinates = mapOptions.center;
                }
                else {
                    coordinates = new gm.LatLng(37.381592, -122.135672); // Palo Alto
                }
            }

            if (coordinates && !(coordinates instanceof gm.LatLng) && 'longitude' in coordinates) {
                coordinates = new gm.LatLng(coordinates.latitude, coordinates.longitude);
            }

            if (!map) {
                mapOptions.center = mapOptions.center || coordinates;
                me.renderMap();
                map = me.getMap();
            }

            if (map && coordinates instanceof gm.LatLng) {
                map.panTo(coordinates);
            }
            else {
                this.options = Ext.apply(this.getMapOptions(), {
                    center: coordinates
                });
            }
        }
    },

    // @private
    onZoomChange : function() {
        var mapOptions = this.getMapOptions(),
            map = this.getMap(),
            zoom;

        zoom = (map && map.getZoom) ? map.getZoom() : mapOptions.zoom || 10;

        this.options = Ext.apply(mapOptions, {
            zoom: zoom
        });

        this.fireEvent('zoomchange', this, map, zoom);
    },

    // @private
    onTypeChange : function() {
        var mapOptions = this.getMapOptions(),
            map = this.getMap(),
            mapTypeId;

        mapTypeId = (map && map.getMapTypeId) ? map.getMapTypeId() : mapOptions.mapTypeId;

        this.options = Ext.apply(mapOptions, {
            mapTypeId: mapTypeId
        });

        this.fireEvent('typechange', this, map, mapTypeId);
    },

    // @private
    onCenterChange: function() {
        var mapOptions = this.getMapOptions(),
            map = this.getMap(),
            center;

        center = (map && map.getCenter) ? map.getCenter() : mapOptions.center;

        this.options = Ext.apply(mapOptions, {
            center: center
        });

        this.fireEvent('centerchange', this, map, center);

    },

    // @private
    destroy: function() {
        Ext.destroy(this.getGeo());
        var map = this.getMap();

        if (map && (window.google || {}).maps) {
            google.maps.event.clearInstanceListeners(map);
        }

        this.callParent();
    }
}, function() {
    //<deprecated product=touch since=2.0>

    /**
     * @cfg {Boolean} maskMap
     * Masks the map
     * @removed 2.0.0 Please mask this components container instead.
     */

    /**
     * @cfg {String} maskMapCls
     * CSS class to add to the map when maskMap is set to true.
     * @removed 2.0.0 Please mask this components container instead.
     */

    /**
     * @method getState
     * Returns the state of the Map.
     * @deprecated 2.0.0 Please use {@link #getMapOptions} instead.
     * @return {Object} mapOptions
     */
    Ext.deprecateClassMethod(this, 'getState', 'getMapOptions');

    /**
     * @method update
     * Moves the map center to the designated coordinates hash of the form:
     *
     *     { latitude: 37.381592, longitude: -122.135672 }
     *
     * or a google.maps.LatLng object representing to the target location.
     *
     * @deprecated 2.0.0 Please use the {@link #setMapCenter}
     * @param {Object/google.maps.LatLng} coordinates Object representing the desired Latitude and
     * longitude upon which to center the map.
     */
    Ext.deprecateClassMethod(this, 'update', 'setMapCenter');

    //</deprecated>
});
