/**
 * The Draw Component is a surface in which sprites can be rendered. The Draw Component
 * manages and holds a `Surface` instance: an interface that has
 * an SVG or VML implementation depending on the browser capabilities and where
 * Sprites can be appended.
 * One way to create a draw component is:
 *
 *     var drawComponent = new Ext.draw.Component({
 *         items: [{
 *             type: 'circle',
 *             fill: '#79BB3F',
 *             radius: 100,
 *             x: 100,
 *             y: 100
 *         }]
 *     });
 *
 *     new Ext.Panel({
 *         fullscreen: true,
 *         items: [drawComponent]
 *     });
 *
 * In this case we created a draw component and added a sprite to it.
 * The *type* of the sprite is *circle* so if you run this code you'll see a yellow-ish
 * circle in a Window. When setting `viewBox` to `false` we are responsible for setting the object's position and
 * dimensions accordingly.
 *
 * You can also add sprites by using the surface's add method:
 *
 *     drawComponent.getSurface('main').add({
 *         type: 'circle',
 *         fill: '#79BB3F',
 *         radius: 100,
 *         x: 100,
 *         y: 100
 *     });
 *
 * For more information on Sprites, the core elements added to a draw component's surface,
 * refer to the {@link Ext.draw.sprite.Sprite} documentation.
 */
Ext.define('Ext.draw.Component', {

    extend: 'Ext.Container',
    xtype: 'draw',
    defaultType: 'surface',

    requires: [
        'Ext.draw.Surface',
        'Ext.draw.engine.Svg',
        'Ext.draw.engine.Canvas',
        'Ext.draw.sprite.GradientDefinition'
    ],
    engine: 'Ext.draw.engine.Canvas',
    statics: {
        WATERMARK: 'Powered by <span style="color:#22E962; font-weight: 900">Sencha Touch</span> <span style="color:#75cdff; font-weight: 900">GPLv3</span>'
    },
    config: {
        cls: 'x-draw-component',

        /**
         * @deprecated 2.2.0 Please implement custom resize event handler.
         * Resize the draw component by the content size of the main surface.
         *
         * __Note:__ It is applied only when there is only one surface.
         */
        autoSize: false,

        /**
         * @deprecated 2.2.0 Please implement custom resize event handler.
         * Pan/Zoom the content in main surface to fit the component size.
         *
         * __Note:__ It is applied only when there is only one surface.
         */
        viewBox: false,

        /**
         * @deprecated 2.2.0 Please implement custom resize event handler.
         * Fit the main surface to the size of component.
         *
         * __Note:__ It is applied only when there is only one surface.
         */
        fitSurface: true,

        /**
         * @cfg {Function} [resizeHandler] The resize function that can be configured to have a behavior.
         */
        resizeHandler: null,

        background: null,

        sprites: null,

        /**
         * @cfg {Object[]} gradients
         * Defines a set of gradients that can be used as color properties
         * (fillStyle and strokeStyle, but not shadowColor) in sprites.
         * The gradients array is an array of objects with the following properties:
         * - **id** - string - The unique name of the gradient.
         * - **type** - string, optional - The type of the gradient. Available types are: 'linear', 'radial'. Defaults to 'linear'.
         * - **angle** - number, optional - The angle of the gradient in degrees.
         * - **stops** - array - An array of objects with 'color' and 'offset' properties, where 'offset' is a real number from 0 to 1.
         *
         * For example:
         *
         *     gradients: [{
         *         id: 'gradientId1',
         *         type: 'linear',
         *         angle: 45,
         *         stops: [{
         *             offset: 0,
         *             color: 'red'
         *         }, {
         *            offset: 1,
         *            color: 'yellow'
         *         }]
         *     }, {
         *        id: 'gradientId2',
         *        type: 'radial',
         *        stops: [{
         *            offset: 0,
         *            color: '#555',
         *        }, {
         *            offset: 1,
         *            color: '#ddd',
         *        }]
         *     }]
         *
         * Then the sprites can use 'gradientId1' and 'gradientId2' by setting the color attributes to those ids, for example:
         *
         *     sprite.setAttributes({
         *         fillStyle: 'url(#gradientId1)',
         *         strokeStyle: 'url(#gradientId2)'
         *     });
         */
        gradients: []
    },

    constructor: function (config) {
        config = config || {};
        this.callSuper(arguments);
        this.frameCallbackId = Ext.draw.Animator.addFrameCallback('renderFrame', this);
    },

    applyGradients: function (gradients) {
        var result = [],
            i, n, gradient;
        if (!Ext.isArray(gradients)) {
            return result;
        }
        for (i = 0, n = gradients.length; i < n; i++) {
            gradient = gradients[i];
            if (!Ext.isObject(gradient)) {
                continue;
            }
            // ExtJS only supported linear gradients, so we didn't have to specify their type
            if (typeof gradient.type !== 'string') {
                gradient.type = 'linear';
            }
            if (gradient.angle) {
                gradient.degrees = gradient.angle;
                delete gradient.angle;
            }
            // Convert ExtJS stops object to Touch stops array
            if (Ext.isObject(gradient.stops)) {
                gradient.stops = (function (stops) {
                    var result = [], stop;
                    for (offset in stops) {
                        stop = stops[offset];
                        stop.offset = offset / 100;
                        result.push(stop);
                    }
                    return result;
                })(gradient.stops);
            }
            result.push(gradient);
        }
        Ext.draw.sprite.GradientDefinition.add(result);
        return result;
    },

    initialize: function () {
        var me = this;
        me.callSuper();
        me.element.on('resize', 'onResize', this);
    },

    applySprites: function (sprites) {
        // Never update
        if (!sprites) {
            return;
        }

        sprites = Ext.Array.from(sprites);

        var ln = sprites.length,
            i, surface;

        for (i = 0; i < ln; i++) {
            if (sprites[i].surface instanceof Ext.draw.Surface) {
                surface = sprites[i].surface;
            } else if (Ext.isString(sprites[i].surface)) {
                surface = this.getSurface(sprites[i].surface);
            } else {
                surface = this.getSurface('main');
            }
            surface.add(sprites[i]);
        }
    },

    getElementConfig: function () {
        return {
            reference: 'element',
            className: 'x-container',
            children: [
                {
                    reference: 'innerElement',
                    className: 'x-inner',
                    children: [
                        {
                            reference: 'watermarkElement',
                            cls: 'x-chart-watermark',
                            html: Ext.draw.Component.WATERMARK,
                            style: Ext.draw.Component.WATERMARK ? '': 'display: none'
                        }
                    ]
                }
            ]
        };
    },

    updateBackground: function (background) {
        this.element.setStyle({
            background: background
        });
    },

    /**
     * @protected
     * Place water mark after resize.
     */
    onPlaceWatermark: function () {
        // Do nothing
    },

    onResize: function () {
        var me = this,
            size = me.element.getSize();
        me.fireEvent('resize', me, size);
        if (me.getResizeHandler()) {
            me.getResizeHandler().call(me, size);
        } else {
            me.resizeHandler(size);
        }
        me.renderFrame();
        me.onPlaceWatermark();
    },

    resizeHandler: function (size) {
        var me = this;

        //<deprecated product=touch since=2.2>
        var surfaces = me.getItems(),
            surface, bbox, mat, zoomX, zoomY, zoom;

        if (surfaces.length === 1) {
            surface = surfaces.get(0);
            if (me.getAutoSize()) {
                bbox = surface.getItems().getBBox();
                mat = new Ext.draw.Matrix();
                mat.prepend(1, 0, 0, 1, -bbox.x, -bbox.y);
                surface.matrix = mat;
                surface.inverseMatrix = mat.inverse();
                surface.setRegion([0, 0, bbox.width, bbox.height]);
            } else if (me.getViewBox()) {
                bbox = surface.getItems().getBBox();
                zoomX = size.width / bbox.width;
                zoomY = size.height / bbox.height;
                zoom = Math.min(zoomX, zoomY);
                mat = new Ext.draw.Matrix();
                mat.prepend(
                    zoom, 0, 0, zoom,
                    size.width * 0.5 + (-bbox.x - bbox.width * 0.5) * zoom,
                    size.height * 0.5 + (-bbox.y - bbox.height * 0.5) * zoom);
                surface.matrix = mat;
                surface.inverseMatrix = mat.inverse();
                surface.setRegion([0, 0, size.width, size.height]);
            } else if (me.getFitSurface()) {
                surface.setRegion([0, 0, size.width, size.height]);
            }
        } else if (!me.getFitSurface()) {
            return;
        }
        //</deprecated>

        me.getItems().each(function (surface) {
            surface.setRegion([0, 0, size.width, size.height]);
        });
    },

    /**
     * Get a surface by the given id or create one if it doesn't exist.
     * @param {String} [id="main"]
     * @return {Ext.draw.Surface}
     */
    getSurface: function (id) {
        id = this.getId() + '-' + (id || 'main');
        var me = this,
            surfaces = me.getItems(),
            surface = surfaces.get(id),
            size;

        if (!surface) {
            surface = me.add({xclass: me.engine, id: id});
            if (me.getFitSurface()) {
                size = me.element.getSize();
                surface.setRegion([0, 0, size.width, size.height]);
            }
            surface.renderFrame();
        }
        return surface;
    },

    /**
     * Render all the surfaces in the component.
     */
    renderFrame: function () {
        var me = this,
            i, ln, bbox,
            surfaces = me.getItems();

        for (i = 0, ln = surfaces.length; i < ln; i++) {
            surfaces.items[i].renderFrame();
        }
        //<deprecated product=touch since=2.2>
        // TODO: Throw a deprecation message
        if (surfaces.length === 1 && me.getAutoSize()) {
            bbox = me.getSurface().getItems().getBBox();
            me.setSize(Math.ceil(bbox.width) + 1, Math.ceil(bbox.height) + 1);
        }
        //</deprecated>
    },

    destroy: function () {
        Ext.draw.Animator.removeFrameCallback(this.frameCallbackId);
        this.callSuper();
    }
}, function () {
    if (location.search.match('svg')) {
        Ext.draw.Component.prototype.engine = 'Ext.draw.engine.Svg';
    } else if ((Ext.os.is.BlackBerry && Ext.os.version.getMajor() === 10) || (Ext.browser.is.AndroidStock4 && (Ext.os.version.getMinor() === 1 || Ext.os.version.getMinor() === 2 || Ext.os.version.getMinor() === 3))) {
        // http://code.google.com/p/android/issues/detail?id=37529
        Ext.draw.Component.prototype.engine = 'Ext.draw.engine.Svg';
    }
});
