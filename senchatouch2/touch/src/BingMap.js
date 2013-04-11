Ext.define('Ext.BingMap', {
    extend: 'Ext.Map',
    xtype : 'bingmap',
    requires: ['Ext.util.Geolocation'],

    // @private
    renderMap: function() {
        var me = this,
            element = me.mapContainer,
            mapOptions = me.getMapOptions(),
            event;

        var MM = Microsoft.Maps;
        var key = "AokX-S2lieXTaXG8pvEw3i2AKYuStBMK8RsUu6BDJ6hrL5AYv0IfQqM9zc-BAA-v";
        //TODO Investigate why does merge lead to exception in Bing
            mapOptions = Ext.merge({
                credentials: key,
                mapTypeId: "r",
                zoom: 12
            }, mapOptions);

        // This is done separately from the above merge so we don't have to instantiate
        // a new LatLng if we don't need to
        if (!mapOptions.center) {
            mapOptions.center = new MM.Location(37.381592, -122.135672); // Palo Alto
        }

        if (element.dom.firstChild) {
            Ext.fly(element.dom.firstChild).destroy();
        }

        MM.loadModule('Microsoft.Maps.Overlays.Style', { callback: function () {
            me.setMap(new MM.Map(element.dom,mapOptions));
            if(mapOptions.callback){
                mapOptions.callback();
            }
        }
        });

        var map = me.getMap();

        //Track zoomLevel and mapType changes
//        event = MM.event;
        //TODO Investigate how to add listeners in Bing
//            event.addListener(map, 'zoom_changed', Ext.bind(me.onZoomChange, me));
//            event.addListener(map, 'maptypeid_changed', Ext.bind(me.onTypeChange, me));
//            event.addListener(map, 'center_changed', Ext.bind(me.onCenterChange, me));

        me.fireEvent('maprender', me, map);
        return;

    },
    setMapCenter: function(coordinates) {
        var me = this,
            map = me.getMap(),
            MM = Microsoft.Maps;

        if (!me.isPainted()) {
            me.un('painted', 'setMapCenter', this);
            me.on('painted', 'setMapCenter', this, { delay: 150, single: true, args: [coordinates] });
            return;
        }
        coordinates = coordinates || new MM.Location(37.381592, -122.135672);

        if (coordinates && !(coordinates instanceof MM.Location) && 'longitude' in coordinates) {
            coordinates = new MM.Location(coordinates.latitude, coordinates.longitude);
        }

        if (!map) {
            me.renderMap();
            map = me.getMap();
        }

        if (map && coordinates instanceof MM.Location) {
            map.updateMapPosition(coordinates);
        }
        else {
            this.options = Ext.apply(this.getMapOptions(), {
                center: coordinates
            });
        }
    }
}, function() {

});
