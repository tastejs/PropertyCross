/**
 * @class Ext.draw.engine.SvgContext
 *
 * A class that imitates a canvas context but generates svg elements instead.
 */
Ext.define('Ext.draw.engine.SvgContext', {
    /**
     * @private
     * Properties to be saved/restored in `save` and `restore` method.
     */
    toSave: ["strokeOpacity", "strokeStyle", "fillOpacity", "fillStyle", "globalAlpha", "lineWidth", "lineCap",
             "lineJoin", "miterLimit", "shadowOffsetX", "shadowOffsetY", "shadowBlur", "shadowColor",
             "globalCompositeOperation", "position"],

    "strokeOpacity": 1,
    "strokeStyle": "none",
    "fillOpacity": 1,
    "fillStyle": "none",
    "globalAlpha": 1,
    "lineWidth": 1,
    "lineCap": "butt",
    "lineJoin": "miter",
    "miterLimit": 10,
    "shadowOffsetX": 0,
    "shadowOffsetY": 0,
    "shadowBlur": 0,
    "shadowColor": "none",
    "globalCompositeOperation": "src",

    constructor: function (SvgSurface) {
        this.surface = SvgSurface;
        this.status = [];
        this.matrix = new Ext.draw.Matrix();
        this.path = null;
        this.clear();
    },

    /**
     * Clears the context.
     */
    clear: function () {
        this.group = this.surface.mainGroup;
        this.position = 0;
        this.path = null;
    },

    /**
     * @private
     * @param tag
     * @return {*}
     */
    getElement: function (tag) {
        return this.surface.getSvgElement(this.group, tag, this.position++);
    },

    /**
     * Pushes the context state to the state stack.
     */
    save: function () {
        var toSave = this.toSave,
            obj = {},
            group = this.getElement('g');

        for (var i = 0; i < toSave.length; i++) {
            if (toSave[i] in this) {
                obj[toSave[i]] = this[toSave[i]];
            }
        }
        this.position = 0;
        obj.matrix = this.matrix.clone();
        this.status.push(obj);
        this.group = group;
        return group;
    },

    /**
     * Pops the state stack and restores the state.
     */
    restore: function () {
        var toSave = this.toSave,
            obj = this.status.pop(),
            children = this.group.dom.childNodes;
        while (children.length > this.position) {
            Ext.fly(children[children.length - 1]).destroy();
        }
        for (var i = 0; i < toSave.length; i++) {
            if (toSave[i] in obj) {
                this[toSave[i]] = obj[toSave[i]];
            } else {
                delete this[toSave[i]];
            }
        }

        this.setTransform.apply(this, obj.matrix.elements);
        this.group = this.group.getParent();
    },

    /**
     * Changes the transformation matrix to apply the matrix given by the arguments as described below.
     * @param xx
     * @param yx
     * @param xy
     * @param yy
     * @param dx
     * @param dy
     */
    transform: function (xx, yx, xy, yy, dx, dy) {
        if (this.path) {
            var inv = Ext.draw.Matrix.fly([xx, yx, xy, yy, dx, dy]).inverse();
            this.path.transform(inv);
        }
        this.matrix.append(xx, yx, xy, yy, dx, dy);
    },

    /**
     * Changes the transformation matrix to the matrix given by the arguments as described below.
     * @param xx
     * @param yx
     * @param xy
     * @param yy
     * @param dx
     * @param dy
     */
    setTransform: function (xx, yx, xy, yy, dx, dy) {
        if (this.path) {
            this.path.transform(this.matrix);
        }
        this.matrix.reset();
        this.transform(xx, yx, xy, yy, dx, dy);
    },

    setGradientBBox: function (bbox) {
        this.bbox = bbox;
    },

    /**
     * Resets the current default path.
     */
    beginPath: function () {
        this.path = new Ext.draw.Path();
    },

    /**
     * Creates a new subpath with the given point.
     * @param x
     * @param y
     */
    moveTo: function (x, y) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.moveTo(x, y);
        this.path.element = null;
    },

    /**
     * Adds the given point to the current subpath, connected to the previous one by a straight line.
     * @param x
     * @param y
     */
    lineTo: function (x, y) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.lineTo(x, y);
        this.path.element = null;
    },

    /**
     * Adds a new closed subpath to the path, representing the given rectangle.
     * @param x
     * @param y
     * @param width
     * @param height
     */
    rect: function (x, y, width, height) {
        this.moveTo(x, y);
        this.lineTo(x + width, y);
        this.lineTo(x + width, y + height);
        this.lineTo(x, y + height);
        this.closePath();
    },

    /**
     * Paints the box that outlines the given rectangle onto the canvas, using the current stroke style.
     * @param x
     * @param y
     * @param width
     * @param height
     */
    strokeRect: function (x, y, width, height) {
        this.beginPath();
        this.rect(x, y, width, height);
        this.stroke();
    },

    /**
     * Paints the given rectangle onto the canvas, using the current fill style.
     * @param x
     * @param y
     * @param width
     * @param height
     */
    fillRect: function (x, y, width, height) {
        this.beginPath();
        this.rect(x, y, width, height);
        this.fill();
    },

    /**
     * Marks the current subpath as closed, and starts a new subpath with a point the same as the start and end of the newly closed subpath.
     */
    closePath: function () {
        if (!this.path) {
            this.beginPath();
        }
        this.path.closePath();
        this.path.element = null;
    },

    /**
     * Arc command using svg parameters.
     * @param r1
     * @param r2
     * @param rotation
     * @param large
     * @param swipe
     * @param x2
     * @param y2
     */
    arcSvg: function (r1, r2, rotation, large, swipe, x2, y2) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.arcSvg(r1, r2, rotation, large, swipe, x2, y2);
        this.path.element = null;
    },

    /**
     * Adds points to the subpath such that the arc described by the circumference of the circle described by the arguments, starting at the given start angle and ending at the given end angle, going in the given direction (defaulting to clockwise), is added to the path, connected to the previous point by a straight line.
     * @param x
     * @param y
     * @param radius
     * @param startAngle
     * @param endAngle
     * @param anticlockwise
     */
    arc: function (x, y, radius, startAngle, endAngle, anticlockwise) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.arc(x, y, radius, startAngle, endAngle, anticlockwise);
        this.path.element = null;
    },

    /**
     * Adds points to the subpath such that the arc described by the circumference of the ellipse described by the arguments, starting at the given start angle and ending at the given end angle, going in the given direction (defaulting to clockwise), is added to the path, connected to the previous point by a straight line.
     * @param x
     * @param y
     * @param radiusX
     * @param radiusY
     * @param rotation
     * @param startAngle
     * @param endAngle
     * @param anticlockwise
     */
    ellipse: function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
        this.path.element = null;
    },

    /**
     * Adds an arc with the given control points and radius to the current subpath, connected to the previous point by a straight line.
     * If two radii are provided, the first controls the width of the arc's ellipse, and the second controls the height. If only one is provided, or if they are the same, the arc is from a circle.
     * In the case of an ellipse, the rotation argument controls the clockwise inclination of the ellipse relative to the x-axis.
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @param radiusX
     * @param radiusY
     * @param rotation
     */
    arcTo: function (x1, y1, x2, y2, radiusX, radiusY, rotation) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.arcTo(x1, y1, x2, y2, radiusX, radiusY, rotation);
        this.path.element = null;
    },

    /**
     * Adds the given point to the current subpath, connected to the previous one by a cubic Bézier curve with the given control points.
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @param x3
     * @param y3
     */
    bezierCurveTo: function (x1, y1, x2, y2, x3, y3) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.bezierCurveTo(x1, y1, x2, y2, x3, y3);
        this.path.element = null;
    },

    /**
     * Strokes the given text at the given position. If a maximum width is provided, the text will be scaled to fit that width if necessary.
     * @param text
     * @param x
     * @param y
     */
    strokeText: function (text, x, y) {
        text = String(text);
        if (this.strokeStyle) {
            var element = this.getElement('text'),
                tspan = this.surface.getSvgElement(element, 'tspan', 0);
            this.surface.setElementAttributes(element, {
                "x": x,
                "y": y,
                "transform": this.matrix.toSvg(),
                "stroke": this.strokeStyle,
                "fill": "none",
                "opacity": this.globalAlpha,
                "stroke-opacity": this.strokeOpacity,
                "style": "font: " + this.font
            });
            if (tspan.dom.firstChild) {
                tspan.dom.removeChild(tspan.dom.firstChild);
            }
            this.surface.setElementAttributes(tspan, {
                "alignment-baseline": "middle",
                "baseline-shift": "-50%"
            });
            tspan.appendChild(document.createTextNode(Ext.String.htmlDecode(text)));
        }
    },

    /**
     * Fills the given text at the given position. If a maximum width is provided, the text will be scaled to fit that width if necessary.
     * @param text
     * @param x
     * @param y
     */
    fillText: function (text, x, y) {
        text = String(text);
        if (this.fillStyle) {
            var element = this.getElement('text'),
                tspan = this.surface.getSvgElement(element, 'tspan', 0);
            this.surface.setElementAttributes(element, {
                "x": x,
                "y": y,
                "transform": this.matrix.toSvg(),
                "fill": this.fillStyle,
                "opacity": this.globalAlpha,
                "fill-opacity": this.fillOpacity,
                "style": "font: " + this.font
            });
            if (tspan.dom.firstChild) {
                tspan.dom.removeChild(tspan.dom.firstChild);
            }
            this.surface.setElementAttributes(tspan, {
                "alignment-baseline": "middle",
                "baseline-shift": "-50%"
            });
            tspan.appendChild(document.createTextNode(Ext.String.htmlDecode(text)));
        }
    },

    /**
     * Draws the given image onto the canvas.
     * If the first argument isn't an img, canvas, or video element, throws a TypeMismatchError exception. If the image has no image data, throws an InvalidStateError exception. If the one of the source rectangle dimensions is zero, throws an IndexSizeError exception. If the image isn't yet fully decoded, then nothing is drawn.
     * @param image
     * @param sx
     * @param sy
     * @param sw
     * @param sh
     * @param dx
     * @param dy
     * @param dw
     * @param dh
     */
    drawImage: function (image, sx, sy, sw, sh, dx, dy, dw, dh) {
        var me = this,
            element = me.getElement('image'),
            x = sx, y = sy,
            width = typeof sw === 'undefined' ? image.width : sw,
            height = typeof sh === 'undefined' ? image.height : sh,
            viewBox = null;
        if (typeof dh !== 'undefined') {
            viewBox = sx + " " + sy + " " + sw + " " + sh;
            x = dx;
            y = dy;
            width = dw;
            height = dh;
        }
        element.dom.setAttributeNS("http:/" + "/www.w3.org/1999/xlink", "href", image.src);
        me.surface.setElementAttributes(element, {
            viewBox: viewBox,
            x: x,
            y: y,
            width: width,
            height: height,
            opacity: me.globalAlpha,
            transform: me.matrix.toSvg()
        });
    },

    /**
     * Fills the subpaths of the current default path or the given path with the current fill style.
     */
    fill: function () {
        if (!this.path) {
            return;
        }
        if (this.fillStyle) {
            var path,
                fillGradient = this.fillGradient,
                bbox = this.bbox,
                element = this.path.element;
            if (!element) {
                path = this.path.toString();
                element = this.path.element = this.getElement('path');
                this.surface.setElementAttributes(element, {
                    "d": path,
                    "transform": this.matrix.toSvg()
                });
            }
            this.surface.setElementAttributes(element, {
                "fill": fillGradient && bbox ? fillGradient.getGradient(this, bbox) : this.fillStyle,
                "fill-opacity": this.fillOpacity * this.globalAlpha
            });
        }
    },

    /**
     * Strokes the subpaths of the current default path or the given path with the current stroke style.
     */
    stroke: function () {
        if (!this.path) {
            return;
        }
        if (this.strokeStyle) {
            var path,
                strokeGradient = this.strokeGradient,
                bbox = this.bbox,
                element = this.path.element;
            if (!element || !this.path.svgString) {
                path = this.path.toString();
                element = this.path.element = this.getElement('path');
                this.surface.setElementAttributes(element, {
                    "fill": "none",
                    "d": path,
                    "transform": this.matrix.toSvg()
                });
            }
            this.surface.setElementAttributes(element, {
                "stroke": strokeGradient && bbox ? strokeGradient.getGradient(this, bbox) : this.strokeStyle,
                "stroke-linecap": this.lineCap,
                "stroke-linejoin": this.lineJoin,
                "stroke-width": this.lineWidth,
                "stroke-opacity": this.strokeOpacity * this.globalAlpha
            });
        }
    },

    /**
     * @protected
     *
     * Note: After the method guarantees the transform matrix will be inverted.
     * @param {Object} attr The attribute object
     * @param {Boolean} [transformFillStroke] Indicate whether to transform fill and stroke. If this is not
     *      given, then uses `attr.transformFillStroke` instead.
     */
    fillStroke: function (attr, transformFillStroke) {
        var ctx = this,
            fillStyle = ctx.fillStyle,
            strokeStyle = ctx.strokeStyle,
            fillOpacity = ctx.fillOpacity,
            strokeOpacity = ctx.strokeOpacity;

        if (transformFillStroke === undefined) {
            transformFillStroke = attr.transformFillStroke;
        }

        if (!transformFillStroke) {
            attr.inverseMatrix.toContext(ctx);
        }

        if (fillStyle && fillOpacity !== 0) {
            ctx.fill();
        }

        if (strokeStyle && strokeOpacity !== 0) {
            ctx.stroke();
        }
    },

    appendPath: function (path) {
        this.path = path.clone();
    },

    /**
     * Returns an object that represents a linear gradient that paints along the line given by the coordinates represented by the arguments.
     * @param x0
     * @param y0
     * @param x1
     * @param y1
     * @return {Ext.draw.engine.SvgContext.Gradient}
     */
    createLinearGradient: function (x0, y0, x1, y1) {
        var element = this.surface.getNextDef('linearGradient');
        this.surface.setElementAttributes(element, {
            "x1": x0,
            "y1": y0,
            "x2": x1,
            "y2": y1,
            "gradientUnits": "userSpaceOnUse"
        });
        return new Ext.draw.engine.SvgContext.Gradient(this, this.surface, element);
    },

    /**
     * Returns a CanvasGradient object that represents a radial gradient that paints along the cone given by the circles represented by the arguments.
     * If either of the radii are negative, throws an IndexSizeError exception.
     * @param x0
     * @param y0
     * @param r0
     * @param x1
     * @param y1
     * @param r1
     * @return {Ext.draw.engine.SvgContext.Gradient}
     */
    createRadialGradient: function (x0, y0, r0, x1, y1, r1) {
        var element = this.surface.getNextDef('radialGradient');
        this.surface.setElementAttributes(element, {
            "fx": x0,
            "fy": y0,
            "cx": x1,
            "cy": y1,
            "r": r1,
            "gradientUnits": "userSpaceOnUse"
        });
        return new Ext.draw.engine.SvgContext.Gradient(this, this.surface, element, r0 / r1);
    }
});

/**
 * @class Ext.draw.engine.SvgContext.Gradient
 */
Ext.define("Ext.draw.engine.SvgContext.Gradient", {
    constructor: function (ctx, surface, element, compression) {
        this.ctx = ctx;
        this.surface = surface;
        this.element = element;
        this.position = 0;
        this.compression = compression || 0;
    },

    /**
     * Adds a color stop with the given color to the gradient at the given offset. 0.0 is the offset at one end of the gradient, 1.0 is the offset at the other end.
     * @param offset
     * @param color
     */
    addColorStop: function (offset, color) {
        var stop = this.surface.getSvgElement(this.element, 'stop', this.position++),
            compression = this.compression;
        this.surface.setElementAttributes(stop, {
            "offset": (((1 - compression) * offset + compression) * 100).toFixed(2) + '%',
            "stop-color": color,
            "stop-opacity": Ext.draw.Color.fly(color).a.toFixed(15)
        });
    },

    toString: function () {
        return 'url(#' + this.element.getId() + ')';
    }
});