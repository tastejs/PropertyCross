/**
 * @class Ext.chart.series.Pie
 * @extends Ext.chart.series.Polar
 *
 * Creates a Pie Chart. A Pie Chart is a useful visualization technique to display quantitative information for different
 * categories that also have a meaning as a whole.
 * As with all other series, the Pie Series must be appended in the *series* Chart array configuration. See the Chart
 * documentation for more information. A typical configuration object for the pie series could be:
 *
 *     @example preview
 *     var chart = new Ext.chart.PolarChart({
 *         animate: true,
 *         interactions: ['rotate'],
 *         colors: ['#115fa6', '#94ae0a', '#a61120', '#ff8809', '#ffd13e'],
 *         store: {
 *           fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5'],
 *           data: [
 *               {name: 'metric one',   data1: 10, data2: 12, data3: 14, data4: 8,  data5: 13},
 *               {name: 'metric two',   data1: 7,  data2: 8,  data3: 16, data4: 10, data5: 3},
 *               {name: 'metric three', data1: 5,  data2: 2,  data3: 14, data4: 12, data5: 7},
 *               {name: 'metric four',  data1: 2,  data2: 14, data3: 6,  data4: 1,  data5: 23},
 *               {name: 'metric five',  data1: 27, data2: 38, data3: 36, data4: 13, data5: 33}
 *           ]
 *         },
 *         series: [{
 *             type: 'pie',
 *             label: {
 *                 field: 'name',
 *                 display: 'rotate'
 *             },
 *             xField: 'data3',
 *             donut: 30
 *         }]
 *     });
 *     Ext.Viewport.setLayout('fit');
 *     Ext.Viewport.add(chart);
 *
 * In this configuration we set `pie` as the type for the series, set an object with specific style properties for highlighting options
 * (triggered when hovering elements). We also set true to `showInLegend` so all the pie slices can be represented by a legend item.
 * We set `data1` as the value of the field to determine the angle span for each pie slice. We also set a label configuration object
 * where we set the field name of the store field to be rendered as text for the label. The labels will also be displayed rotated.
 * We set `contrast` to `true` to flip the color of the label if it is to similar to the background color. Finally, we set the font family
 * and size through the `font` parameter.
 *
 */
Ext.define('Ext.chart.series.Pie', {
    extend: 'Ext.chart.series.Polar',
    requires: [
        'Ext.chart.series.sprite.PieSlice'
    ],
    type: 'pie',
    alias: 'series.pie',
    seriesType: 'pieslice',

    config: {
        /**
         * @cfg {String} labelField
         * @deprecated Use {@link Ext.chart.series.Pie#label} instead.
         * The store record field name to be used for the pie slice labels.
         */
        labelField: false,

        /**
         * @cfg {Boolean/Number} donut Whether to set the pie chart as donut chart.
         * Can be set to a particular percentage to set the radius of the donut chart.
         */
        donut: false,

        /**
         * @cfg {String} field
         * @deprecated Use xField directly
         */
        field: null,

        /**
         * @cfg {Number} rotation The starting angle of the pie slices.
         */
        rotation: 0,

        /**
         * @cfg {Number} [totalAngle=2*PI] The total angle of the pie series.
         */
        totalAngle: Math.PI * 2,

        /**
         * @cfg {Array} hidden Determines which pie slices are hidden.
         */
        hidden: [],

        /**
         * @cfg {Number} Allows adjustment of the radius by a spefic perfentage.
         */
        radiusFactor: 100,

        style: {

        }
    },

    directions: ['X'],

    setField: function (f) {
        return this.setXField(f);
    },

    getField: function () {
        return this.getXField();
    },

    applyRadius : function (radius) {
        return radius * this.getRadiusFactor() * 0.01;
    },

    updateLabelData: function () {
        var me = this,
            store = me.getStore(),
            items = store.getData().items,
            sprites = me.getSprites(),
            labelField = me.getLabel().getTemplate().getField(),
            hidden = me.getHidden(),
            i, ln, labels, sprite;
        if (sprites.length > 0 && labelField) {
            labels = [];
            for (i = 0, ln = items.length; i < ln; i++) {
                labels.push(items[i].get(labelField));
            }
            for (i = 0, ln = sprites.length; i < ln; i++) {
                sprite = sprites[i];
                sprite.setAttributes({label: labels[i]});
                sprite.putMarker('labels', {hidden: hidden[i]}, sprite.attr.attributeId);
            }
        }
    },

    coordinateX: function () {
        var me = this,
            store = me.getStore(),
            items = store.getData().items,
            length = items.length,
            field = me.getXField(),
            value, sum = 0,
            hidden = me.getHidden(),
            summation = [], i,
            lastAngle = 0,
            totalAngle = me.getTotalAngle(),
            sprites = me.getSprites();

        if (!sprites) {
            return;
        }

        for (i = 0; i < length; i++) {
            value = Math.abs(Number(items[i].get(field))) || 0;
            if (!hidden[i]) {
                sum += value;
            }
            summation[i] = sum;
            if (i >= hidden.length) {
                hidden[i] = false;
            }
        }

        if (sum !== 0) {
            sum = totalAngle / sum;
        }
        for (i = 0; i < length; i++) {
            sprites[i].setAttributes({
                startAngle: lastAngle,
                endAngle: lastAngle = (sum ? summation[i] * sum : 0),
                globalAlpha: 1
            });
        }
        for (; i < me.sprites.length; i++) {
            sprites[i].setAttributes({
                startAngle: totalAngle,
                endAngle: totalAngle,
                globalAlpha: 0
            });
        }
        me.getChart().refreshLegendStore();
    },

    updateCenter: function (center) {
        this.setStyle({
            translationX: center[0] + this.getOffsetX(),
            translationY: center[1] + this.getOffsetY()
        });
        this.doUpdateStyles();
    },

    updateRadius: function (radius) {
        this.setStyle({
            startRho: radius * this.getDonut() * 0.01, // Percentage
            endRho: radius
        });
        this.doUpdateStyles();
    },

    updateDonut: function (donut) {
        var radius = this.getRadius();
        this.setStyle({
            startRho: radius * donut * 0.01, // Percentage
            endRho: radius
        });
        this.doUpdateStyles();
    },

    updateRotation: function (rotation) {
        this.setStyle({
            rotationRads: rotation
        });
        this.doUpdateStyles();
    },

    updateTotalAngle: function (totalAngle) {
        this.processData();
    },

    getSprites: function () {
        var me = this,
            chart = me.getChart(),
            store = me.getStore();
        if (!chart || !store) {
            return [];
        }
        me.getColors();
        me.getSubStyle();
        var items = store.getData().items,
            length = items.length,
            animation = chart && chart.getAnimate(),
            sprites = me.sprites, sprite,
            spriteIndex = 0, rendererData,
            i, spriteCreated = false,
            label = me.getLabel(),
            labelTpl = label.getTemplate();

        rendererData = {
            store: store,
            field: me.getField(),
            series: me
        };

        for (i = 0; i < length; i++) {
            sprite = sprites[i];
            if (!sprite) {
                sprite = me.createSprite();
                if (me.getHighlightCfg()) {
                    sprite.config.highlightCfg = me.getHighlightCfg();
                    sprite.addModifier('highlight', true);
                }
                if (labelTpl.getField()) {
                    labelTpl.setAttributes({
                        labelOverflowPadding: me.getLabelOverflowPadding()
                    });
                    labelTpl.fx.setCustomDuration({'callout': 200});
                    sprite.bindMarker('labels', label);
                }
                sprite.setAttributes(me.getStyleByIndex(i));
                sprite.rendererData = rendererData;
                sprite.rendererIndex = spriteIndex++;
                spriteCreated = true;
            }
            sprite.fx.setConfig(animation);
        }
        if (spriteCreated) {
            me.doUpdateStyles();
        }
        return me.sprites;
    },

    normalizeAngle: function (angle) {
        var pi2 = Math.PI * 2;
        if (angle >= 0) {
            return angle % pi2;
        }
        return (angle % pi2 + pi2) % pi2;
    },

    betweenAngle: function (x, a, b) {
        var normalize = this.normalizeAngle;
        a = normalize(a);
        b = normalize(b);
        x = normalize(x);
        if (b === 0) {
            b = Math.PI * 2;
        }
        return x >= a && x < b;
    },

    /**
     * Returns the pie slice for a given angle
     * @param {Number} angle The angle to search for the slice
     * @return {Object} An object containing the reocord, sprite, scope etc.
     */
    getItemForAngle: function (angle) {
        var me      = this,
            sprites = me.getSprites();

        angle %= Math.PI * 2;

        while (angle < 0) {
            angle += Math.PI * 2;
        }

        if (sprites) {
            var store  = me.getStore(),
                items  = store.getData().items,
                hidden = me.getHidden(),
                i      = 0,
                ln     = store.getCount();

            for (; i < ln; i++) {
                if(!hidden[i]) {
                    // Fortunately, the id of items equals the index of it in instances list.
                    attr = sprites[i].attr;

                    if (attr.startAngle <= angle &&  attr.endAngle >= angle) {
                        return {
                            series: me,
                            sprite: sprites[i],
                            index: i,
                            record: items[i],
                            field: me.getXField()
                        };
                    }
                }
            }
        }

        return null;
    },

    getItemForPoint: function (x, y) {
        var me = this,
            sprites = me.getSprites();
        if (sprites) {
            var center = me.getCenter(),
                offsetX = me.getOffsetX(),
                offsetY = me.getOffsetY(),
                originalX = x - center[0] + offsetX,
                originalY = y - center[1] + offsetY,
                store = me.getStore(),
                donut = me.getDonut(),
                items = store.getData().items,
                direction = Math.atan2(originalY, originalX) - me.getRotation(),
                donutLimit = Math.sqrt(originalX * originalX + originalY * originalY),
                endRadius = me.getRadius(),
                startRadius = donut / 100 * endRadius,
                hidden = me.getHidden(),
                i, ln, attr;

            for (i = 0, ln = items.length; i < ln; i++) {
                if(!hidden[i]) {
                    // Fortunately, the id of items equals the index of it in instances list.
                    attr = sprites[i].attr;
                    if (startRadius + attr.margin <= donutLimit && donutLimit + attr.margin <= endRadius) {
                        if (this.betweenAngle(direction, attr.startAngle, attr.endAngle)) {
                            return {
                                series: this,
                                sprite: sprites[i],
                                index: i,
                                record: items[i],
                                field: this.getXField()
                            };
                        }
                    }
                }
            }
            return null;
        }
    },

    provideLegendInfo: function (target) {
        var store = this.getStore();
        if (store) {
            var items = store.getData().items,
                labelField = this.getLabel().getTemplate().getField(),
                field = this.getField(),
                hidden = this.getHidden();
            for (var i = 0; i < items.length; i++) {
                target.push({
                    name: labelField ? String(items[i].get(labelField))  : field + ' ' + i,
                    mark: this.getStyleByIndex(i).fillStyle || this.getStyleByIndex(i).strokeStyle || 'black',
                    disabled: hidden[i],
                    series: this.getId(),
                    index: i
                });
            }
        }
    }
});

