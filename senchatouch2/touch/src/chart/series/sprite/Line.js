/**
 * @class Ext.chart.series.sprite.Line
 * @extends Ext.chart.series.sprite.Aggregative
 *
 * Line series sprite.
 */
Ext.define("Ext.chart.series.sprite.Line", {
    alias: 'sprite.lineSeries',
    extend: 'Ext.chart.series.sprite.Aggregative',

    inheritableStatics: {
        def: {
            processors: {
                smooth: 'bool',
                fillArea: 'bool',
                step: 'bool',
                preciseStroke: 'bool'
            },

            defaults: {
                /**
                 * @cfg {Boolean} smooth 'true' if the sprite uses line smoothing.
                 */
                smooth: false,

                /**
                 * @cfg {Boolean} fillArea 'true' if the sprite paints the area underneath the line.
                 */
                fillArea: false,

                /**
                 * @cfg {Boolean} step 'true' if the line uses steps instead of straight lines to connect the dots.
                 * It is ignored if `smooth` is true.
                 */
                step: false,

                /**
                 * @cfg {Boolean} preciseStroke 'true' if the line uses precise stroke.
                 */
                preciseStroke: true
            },

            dirtyTriggers: {
                dataX: 'dataX,bbox,smooth',
                dataY: 'dataY,bbox,smooth',
                smooth: 'smooth'
            },

            updaters: {
                "smooth": function (attr) {
                    if (attr.smooth && attr.dataX && attr.dataY && attr.dataX.length > 2 && attr.dataY.length > 2) {
                        this.smoothX = Ext.draw.Draw.spline(attr.dataX);
                        this.smoothY = Ext.draw.Draw.spline(attr.dataY);
                    } else {
                        delete this.smoothX;
                        delete this.smoothY;
                    }
                }
            }
        }
    },

    list: null,

    updatePlainBBox: function (plain) {
        var attr = this.attr,
            ymin = Math.min(0, attr.dataMinY),
            ymax = Math.max(0, attr.dataMaxY);
        plain.x = attr.dataMinX;
        plain.y = ymin;
        plain.width = attr.dataMaxX - attr.dataMinX;
        plain.height = ymax - ymin;
    },

    drawStroke: function (surface, ctx, list, xAxis) {
        var attr = this.attr,
            matrix = attr.matrix,
            xx = matrix.getXX(),
            yy = matrix.getYY(),
            dx = matrix.getDX(),
            dy = matrix.getDY(),
            smooth = attr.smooth,
            step = attr.step,
            start = list[2],
            smoothX = this.smoothX,
            smoothY = this.smoothY,
            i, j, lineConfig, changes,
            cx1, cy1, cx2, cy2, x, y, x0, y0, saveOpacity;
        ctx.beginPath();
        if (smooth && smoothX && smoothY) {
            ctx.moveTo(smoothX[start * 3] * xx + dx, smoothY[start * 3] * yy + dy);
            for (i = 0, j = start * 3 + 1; i < list.length - 3; i += 3, j += 3) {
                cx1 = smoothX[j] * xx + dx;
                cy1 = smoothY[j] * yy + dy;
                cx2 = smoothX[j + 1] * xx + dx;
                cy2 = smoothY[j + 1] * yy + dy;
                x = list[i + 3];
                y = list[i + 4];
                x0 = list[i];
                y0 = list[i + 1];
                if (attr.renderer) {
                    lineConfig = {
                        type: "line",
                        smooth: true,
                        step: step,
                        cx1: cx1,
                        cy1: cy1,
                        cx2: cx2,
                        cy2: cy2,
                        x: x,
                        y: y,
                        x0: x0,
                        y0: y0
                    };
                    changes = attr.renderer.call(this, this, lineConfig, {store:this.getStore()}, (i/3 + 1));
                    ctx.save();
                        Ext.apply(ctx, changes);
                        // Fill the area if we need to, using the fill color and transparent strokes.
                        if (attr.fillArea) {
                            saveOpacity = ctx.strokeOpacity;
                            ctx.save();
                                ctx.strokeOpacity = 0;
                                ctx.moveTo(x0, y0);
                                ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
                                ctx.lineTo(x, xAxis);
                                ctx.lineTo(x0, xAxis);
                                ctx.lineTo(x0, y0);
                                ctx.closePath();
                                ctx.fillStroke(attr, true);
                            ctx.restore();
                            ctx.strokeOpacity = saveOpacity;
                            ctx.beginPath();
                        }
                        // Draw the line on top of the filled area.
                        ctx.moveTo(x0, y0);
                        ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
                        ctx.moveTo(x0, y0);
                        ctx.closePath();
                        ctx.stroke();
                    ctx.restore();
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                } else {
                    ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
                }
            }
        } else {
            ctx.moveTo(list[0], list[1]);
            for (i = 3; i < list.length; i += 3) {
                x = list[i];
                y = list[i + 1];
                x0 = list[i - 3];
                y0 = list[i - 2];
                if (attr.renderer) {
                    lineConfig = {
                        type: "line",
                        smooth: false,
                        step: step,
                        x: x,
                        y: y,
                        x0: x0,
                        y0: y0
                    };
                    changes = attr.renderer.call(this, this, lineConfig, {store:this.getStore()}, i/3);
                    ctx.save();
                        Ext.apply(ctx, changes);
                        // Fill the area if we need to, using the fill color and transparent strokes.
                        if (attr.fillArea) {
                            saveOpacity = ctx.strokeOpacity;
                            ctx.save();
                                ctx.strokeOpacity = 0;
                                if (step) {
                                    ctx.lineTo(x, y0);
                                } else {
                                    ctx.lineTo(x, y);
                                }
                                ctx.lineTo(x, xAxis);
                                ctx.lineTo(x0, xAxis);
                                ctx.lineTo(x0, y0);
                                ctx.closePath();
                                ctx.fillStroke(attr, true);
                            ctx.restore();
                            ctx.strokeOpacity = saveOpacity;
                            ctx.beginPath();
                        }
                        // Draw the line (or the 2 lines if 'step') on top of the filled area.
                        ctx.moveTo(x0, y0);
                        if (step) {
                            ctx.lineTo(x, y0);
                            ctx.closePath();
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(x, y0);
                        }
                        ctx.lineTo(x, y);
                        ctx.closePath();
                        ctx.stroke();
                    ctx.restore();
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                } else {
                    if (step) {
                        ctx.lineTo(x, y0);
                    }
                    ctx.lineTo(x, y);
                }
            }
        }
    },

    renderAggregates: function (aggregates, start, end, surface, ctx, clip, region) {
        var me = this,
            attr = me.attr,
            dataX = attr.dataX,
            dataY = attr.dataY,
            matrix = attr.matrix,
            surfaceMatrix = surface.matrix,
            pixel = surface.devicePixelRatio,
            xx = matrix.getXX(),
            yy = matrix.getYY(),
            dx = matrix.getDX(),
            dy = matrix.getDY(),
            markerCfg = {},
            list = this.list || (this.list = []),
            x, y, i, index,
            minXs = aggregates.minX,
            maxXs = aggregates.maxX,
            minYs = aggregates.minY,
            maxYs = aggregates.maxY,
            idx = aggregates.startIdx;

        list.length = 0;
        for (i = start; i < end; i++) {
            var minX = minXs[i],
                maxX = maxXs[i],
                minY = minYs[i],
                maxY = maxYs[i];

            if (minX < maxX) {
                list.push(minX * xx + dx, minY * yy + dy, idx[i]);
                list.push(maxX * xx + dx, maxY * yy + dy, idx[i]);
            } else if (minX > maxX) {
                list.push(maxX * xx + dx, maxY * yy + dy, idx[i]);
                list.push(minX * xx + dx, minY * yy + dy, idx[i]);
            } else {
                list.push(maxX * xx + dx, maxY * yy + dy, idx[i]);
            }
        }

        if (list.length) {
            for (i = 0; i < list.length; i += 3) {
                x = list[i];
                y = list[i + 1];
                index = list[i + 2];
                if (attr.renderer) {
                    markerCfg = {
                        type: 'marker',
                        x: x,
                        y: y
                    };
                    markerCfg = attr.renderer.call(this, this, markerCfg, {store:this.getStore()}, i/3) || {};
                }
                markerCfg.translationX = surfaceMatrix.x(x, y);
                markerCfg.translationY = surfaceMatrix.y(x, y);
                me.putMarker("markers", markerCfg, index, !attr.renderer);
            }
            me.drawStroke(surface, ctx, list, region[1] - pixel);
            if (!attr.renderer) {
                var lastPointX = dataX[dataX.length - 1] * xx + dx + pixel,
                    lastPointY = dataY[dataY.length - 1] * yy + dy,
                    bottomY = region[1] - pixel,
                    firstPointX = dataX[0] * xx + dx - pixel,
                    firstPointY = dataY[0] * yy + dy;
                ctx.lineTo(lastPointX, lastPointY);
                ctx.lineTo(lastPointX, bottomY);
                ctx.lineTo(firstPointX, bottomY);
                ctx.lineTo(firstPointX, firstPointY);
            }
            ctx.closePath();

            if (attr.transformFillStroke) {
                attr.matrix.toContext(ctx);
            }
            if (attr.preciseStroke) {
                if (attr.fillArea) {
                    ctx.fill();
                }
                if (attr.transformFillStroke) {
                    attr.inverseMatrix.toContext(ctx);
                }
                me.drawStroke(surface, ctx, list, region[1] - pixel);
                if (attr.transformFillStroke) {
                    attr.matrix.toContext(ctx);
                }
                ctx.stroke();
            } else {
                // Prevent the reverse transform to fix floating point err.
                if (attr.fillArea) {
                    ctx.fillStroke(attr, true);
                } else {
                    ctx.stroke(true);
                }
            }
        }
    }
});