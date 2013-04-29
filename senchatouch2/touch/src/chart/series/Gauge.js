/**
 * @class Ext.chart.series.Gauge
 * @extends Ext.chart.series.Series
 * 
 * Creates a Gauge Chart.
 *
 *     @example preview
 *     var chart = new Ext.chart.SpaceFillingChart({
 *         series: [{
 *             type: 'gauge',
 *             minimum: 100,
 *             maximum: 800,
 *             value: 400,
 *             donut: 30,
 *             colors: ["#115fa6", "lightgrey"]
 *         }]
 *     });
 *     Ext.Viewport.setLayout('fit');
 *     Ext.Viewport.add(chart);
 */
Ext.define('Ext.chart.series.Gauge', {
    alias: 'series.gauge',
    extend: 'Ext.chart.series.Series',
    type: "gauge",
    seriesType: 'pieslice',

    requires: [
        'Ext.draw.sprite.Sector'
    ],

    config: {
        /**
         * @cfg {String} angleField
         * @deprecated Use `field` directly
         * The store record field name to be used for the gauge angles.
         * The values bound to this field name must be positive real numbers.
         */
        angleField: null,

        /**
         * @cfg {String} field
         * The store record field name to be used for the gauge value.
         * The values bound to this field name must be positive real numbers.
         */
        field: null,

        /**
         * @cfg {Boolean} needle
         * If true, display the gauge as a needle, otherwise as a sector.
         */
        needle: false,

        /**
         * @cfg {Number} needleLengthRatio
         * @deprecated Use `needleLength` directly
         * Ratio of the length of needle compared to the radius of the entire disk.
         */
         needleLengthRatio: undefined,

        /**
         * @cfg {Number} needleLength
         * Percentage of the length of needle compared to the radius of the entire disk.
         */
        needleLength: 90,

        /**
         * @cfg {Number} needleWidth
         * Width of the needle in pixels.
         */
        needleWidth: 4,

        /**
         * @cfg {Number} donut
         * Percentage of the radius of the donut hole compared to the entire disk.
         */
        donut: 30,

        /**
         * @cfg {Boolean} showInLegend
         * Whether to add the gauge chart elements as legend items.
         */
        showInLegend: false,

        /**
         * @cfg {Number} value
         * Directly sets the displayed value of the gauge.
         * It is ignored if {@link #field} is provided.
         */
        value: null,

        /**
         * @cfg {Array} colors (required)
         * An array of color values which is used for the needle and the `sectors`.
         */
        colors: null,

        /**
         * @cfg {Array} sectors
         * Allows to paint sectors of different colors in the background of the gauge,
         * with optional labels.
         *
         * It can be an array of numbers (each between `minimum` and `maximum`) that
         * define the highest value of each sector. For N sectors, only (N-1) values are
         * needed because it is assumed that the first sector starts at `minimum` and the
         * last sector ends at `maximum`. Example: a water temperature gauge that is blue 
         * below 20C, red above 80C, gray in-between, and with an orange needle...
         *
         *      minimum: 0,
         *      maximum: 100,
         *      sectors: [20, 80],
         *      colors: ['orange', 'blue', 'lightgray', 'red']
         *
         * It can be also an array of objects, each with the following properties:
         * 
         * @cfg {Number} sectors.start The starting value of the sector. If omitted, it
         * uses the previous sector's `end` value or the chart's `minimum`.
         * @cfg {Number} sectors.end The ending value of the sector. If omitted, it uses
         * the `maximum` defined for the chart.
         * @cfg {String} sectors.label The label for this sector. Labels are styled using
         * the series' {@link Ext.chart.series.Series#label label} config.
         * @cfg {String} sectors.color The color of the sector. If omitted, it uses one
         * of the `colors` defined for the series or for the chart.
         * @cfg {Object} sectors.style An additional style object for the sector (for
         * instance to set the opacity or to draw a line of a different color around the
         * sector).
         *
         *      minimum: 0,
         *      maximum: 100,
         *      sectors: [{
         *              end: 20,
         *              label: 'Cold',
         *              color: 'aqua'
         *          },
         *          {
         *              end: 80,
         *              label: 'Temp.',
         *              color: 'lightgray',
         *              style: { strokeStyle:'black', strokeOpacity:1, lineWidth:1 }
         *          },
         *          {
         *              label: 'Hot',
         *              color: 'tomato'
         *          }]
         */
        sectors: null,

        /**
         * @cfg {Number} minimum
         * The minimum value of the gauge.
         */
        minimum: 0,

        /**
         * @cfg {Number} maximum
         * The maximum value of the gauge.
         */
        maximum: 100,

        rotation: 0,

        totalAngle: Math.PI / 2,

        region: [0, 0, 1, 1],

        center: [0.5, 0.75],

        radius: 0.5,

        /**
         * @cfg {Boolean} wholeDisk Indicates whether to show the whole disk or only the marked part.
         */
        wholeDisk: false
    },

    updateNeedle: function(needle) {
        var me = this,
            sprites = me.getSprites(),
            angle = me.valueToAngle(me.getValue());

        if (sprites && sprites.length) {
            sprites[0].setAttributes({
                startAngle: (needle ? angle : 0),
                endAngle: angle,
                strokeOpacity: (needle ? 1 : 0),
                lineWidth: (needle ? me.getNeedleWidth() : 0)

            });
            me.doUpdateStyles();
        }
    },

    updateColors: function (colors, oldColors) {
        var me = this,
            sectors = me.getSectors(),
            sectorCount = sectors && sectors.length,
            sprites = me.getSprites(),
            spriteCount = sprites && sprites.length,
            newColors = Ext.Array.clone(colors),
            colorCount = colors && colors.length,
            needle = me.getNeedle(),
            i;

        if (!colorCount || !colors[0]) {
            return;
        }

        // Make sure the 'sectors' colors are not overridden.
        for (i = 0; i < sectorCount; i++) {
            newColors[i+1] = sectors[i].color || newColors[i+1] || colors[i%colorCount];
        }

        sprites[0].setAttributes({stroke:newColors[0]});
        this.setSubStyle({color:newColors});
        this.doUpdateStyles();
    },
    
    updateAngleField: function (angleField) {
        this.setField(angleField);
    },
    
    updateNeedleLengthRatio: function (needleLengthRatio) {
        this.setNeedleLength(needleLengthRatio * 100);
    },

    updateRegion: function (region) {
        var wholeDisk = this.getWholeDisk(),
            halfTotalAngle = wholeDisk ? Math.PI : this.getTotalAngle() / 2,
            donut = this.getDonut() / 100,
            width, height, radius;
        if (halfTotalAngle <= Math.PI / 2) {
            width = 2 * Math.sin(halfTotalAngle);
            height = 1 - donut * Math.cos(halfTotalAngle);
        } else {
            width = 2;
            height = 1 - Math.cos(halfTotalAngle);
        }

        radius = Math.min(region[2] / width, region[3] / height);
        this.setRadius(radius);
        this.setCenter([region[2] / 2, radius + (region[3] - height * radius) / 2]);
    },

    updateCenter: function (center) {
        this.setStyle({
            centerX: center[0],
            centerY: center[1],
            rotationCenterX: center[0],
            rotationCenterY: center[1]
        });
        this.doUpdateStyles();
    },

    updateRotation: function (rotation) {
        this.setStyle({
            rotationRads: rotation - (this.getTotalAngle() + Math.PI) / 2
        });
        this.doUpdateStyles();
    },

    doUpdateShape: function (radius, donut) {
        var endRhoArray,
            sectors = this.getSectors(),
            sectorCount = (sectors && sectors.length) || 0;
            needle = this.getNeedle(),
            needleLength = this.getNeedleLength() / 100;

        // Initialize an array that contains the endRho for each sprite.
        // The first sprite is for the needle, the others for the gauge background sectors. 
        // Note: SubStyle arrays are handled in series.getOverriddenStyleByIndex().
        endRhoArray = [radius * needleLength, radius];
        while (sectorCount --) {
            endRhoArray.push(radius);
        }

        this.setSubStyle({
            endRho: endRhoArray,
            startRho: radius / 100 * donut
        });
        this.doUpdateStyles();
    },

    updateRadius: function (radius) {
        var donut = this.getDonut();
        this.doUpdateShape(radius, donut);
    },

    updateDonut: function (donut) {
        var radius = this.getRadius();
        this.doUpdateShape(radius, donut);
    },

    valueToAngle: function(value) {
        value = this.applyValue(value);
        return this.getTotalAngle() * (value - this.getMinimum()) / (this.getMaximum() - this.getMinimum());
    },

    applyValue: function (value) {
        return Math.min(this.getMaximum(), Math.max(value, this.getMinimum()));
    },

    updateValue: function (value) {
        var me = this,
            needle = me.getNeedle(),
            angle = me.valueToAngle(value),
            sprites = me.getSprites();

        sprites[0].rendererData.value = value;
        sprites[0].setAttributes({
            startAngle: (needle ? angle : 0),
            endAngle: angle
        });
        me.doUpdateStyles();
    },

    processData: function () {
        var store = this.getStore();
        if (!store) {
            return;
        }
        var field = this.getField();
        if (!field) {
            return;
        }
        if (!store.getData().items.length) {
            return;
        }
        this.setValue(store.getData().items[0].get(field));
    },

    getDefaultSpriteConfig: function () {
        return {
            type: this.seriesType,
            renderer: this.getRenderer(),
            fx: {
                customDuration: {
                    translationX: 0,
                    translationY: 0,
                    rotationCenterX: 0,
                    rotationCenterY: 0,
                    centerX: 0,
                    centerY: 0,
                    startRho: 0,
                    endRho: 0,
                    baseRotation: 0
                }
            }
        };
    },

    normalizeSectors: function(sectors) {
        // Make sure all the sectors in the array have a legit start and end.
        // Note: the array is modified in-place.
        var me = this,
            sectorCount = (sectors && sectors.length) || 0,
            i, value, start, end;
    
        if (sectorCount) {
            for (i = 0; i < sectorCount; i++) {
                value = sectors[i];
                if (typeof value == "number") {
                    sectors[i] = {
                        start: (i > 0 ? sectors[i-1].end : me.getMinimum()),
                        end: Math.min(value, me.getMaximum())
                    };
                    if (i == (sectorCount - 1) && sectors[i].end < me.getMaximum()) {
                        sectors[i+1] = {
                            start: sectors[i].end,
                            end: me.getMaximum()
                        };
                    }
                } else {
                    if (typeof value.start == "number") {
                        start = Math.max(value.start, me.getMinimum());
                    } else {
                        start = (i > 0 ? sectors[i-1].end : me.getMinimum());
                    }
                    if (typeof value.end == "number") {
                        end = Math.min(value.end, me.getMaximum());
                    } else {
                        end = me.getMaximum();
                    }
                    sectors[i].start = start;
                    sectors[i].end = end;
                }
            }
        } else {
            sectors = [{
                start: me.getMinimum(),
                end: me.getMaximum()
            }];
        }
        return sectors;
    },

    getSprites: function () {
        // The store must be initialized, or the value must be set
        if(!this.getStore() && !Ext.isNumber(this.getValue())) {
            return null;
        }

        // Return cached sprites
        var me = this,
            chart = me.getChart(),
            animate = chart.getAnimate(),
            sprites = me.sprites,
            spriteIndex = 0,
            sprite, sectors, attr, rendererData;

        if (sprites && sprites.length) {
            sprites[0].fx.setConfig(animate);
            return sprites;
        }

        rendererData = {
            store: me.getStore(),
            field: me.getField(),
            value: me.getValue(),
            series: me
        };

        // Create needle sprite
        sprite = me.createSprite();
        sprite.setAttributes({
            zIndex: 10
        }, true);
        sprite.rendererData = rendererData;
        sprite.rendererIndex = spriteIndex++;

        // Create background sprite(s)
        me.setLabelField(true);             // Enable labels
        sectors = me.normalizeSectors(me.getSectors());
        for (i = 0; i < sectors.length; i++) {
            attr = {
                startAngle: me.valueToAngle(sectors[i].start),
                endAngle: me.valueToAngle(sectors[i].end),
                label: sectors[i].label,
                fillStyle: sectors[i].color,
                strokeOpacity: 0,
                rotateLabels: false,
                doCallout: false,           // Show labels inside sectors.
                labelOverflowPadding: -1    // Allow labels to overlap.
            };
            Ext.apply(attr, sectors[i].style);
            sprite = me.createSprite();
            sprite.rendererData = rendererData;
            sprite.rendererIndex = spriteIndex++;
            sprite.setAttributes(attr, true);
        }

        // Make sure we have some default colors
        var colors = me.getColors() || (chart && chart.config.colors);
        if (!colors) {
            me.setColors(['blue','lightgray']);
        }

        me.doUpdateStyles();
        return sprites;
    }
});

