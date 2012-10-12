/**
 * @class Ext.data.Types
 * <p>This is s static class containing the system-supplied data types which may be given to a {@link Ext.data.Field Field}.<p/>
 * <p>The properties in this class are used as type indicators in the {@link Ext.data.Field Field} class, so to
 * test whether a Field is of a certain type, compare the {@link Ext.data.Field#type type} property against properties
 * of this class.</p>
 * <p>Developers may add their own application-specific data types to this class. Definition names must be UPPERCASE.
 * each type definition must contain three properties:</p>
 * <div class="mdetail-params"><ul>
 * <li><code>convert</code> : <i>Function</i><div class="sub-desc">A function to convert raw data values from a data block into the data
 * to be stored in the Field. The function is passed the collowing parameters:
 * <div class="mdetail-params"><ul>
 * <li><b>v</b> : Mixed<div class="sub-desc">The data value as read by the Reader, if undefined will use
 * the configured <tt>{@link Ext.data.Field#defaultValue defaultValue}</tt>.</div></li>
 * <li><b>rec</b> : Mixed<div class="sub-desc">The data object containing the row as read by the Reader.
 * Depending on the Reader type, this could be an Array ({@link Ext.data.reader.Array ArrayReader}), an object
 * ({@link Ext.data.reader.Json JsonReader}), or an XML element.</div></li>
 * </ul></div></div></li>
 * <li><code>sortType</code> : <i>Function</i> <div class="sub-desc">A function to convert the stored data into comparable form, as defined by {@link Ext.data.SortTypes}.</div></li>
 * <li><code>type</code> : <i>String</i> <div class="sub-desc">A textual data type name.</div></li>
 * </ul></div>
 * <p>For example, to create a VELatLong field (See the Microsoft Bing Mapping API) containing the latitude/longitude value of a datapoint on a map from a JsonReader data block
 * which contained the properties <code>lat</code> and <code>long</code>, you would define a new data type like this:</p>
 *<pre><code>
// Add a new Field data type which stores a VELatLong object in the Record.
Ext.data.Types.VELATLONG = {
    convert: function(v, data) {
        return new VELatLong(data.lat, data.long);
    },
    sortType: function(v) {
        return v.Latitude;  // When sorting, order by latitude
    },
    type: 'VELatLong'
};
</code></pre>
 * <p>Then, when declaring a Model, use <pre><code>
var types = Ext.data.Types; // allow shorthand type access
Ext.define('Unit', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'unitName', mapping: 'UnitName' },
            { name: 'curSpeed', mapping: 'CurSpeed', type: types.INT },
            { name: 'latitude', mapping: 'lat', type: types.FLOAT },
            { name: 'position', type: types.VELATLONG }
        ]
    }
});
</code></pre>
 * @singleton
 */
Ext.define('Ext.data.Types', {
    singleton: true,
    requires: ['Ext.data.SortTypes'],

    /**
     * @property {RegExp} stripRe
     * A regular expression for stripping non-numeric characters from a numeric value. Defaults to <tt>/[\$,%]/g</tt>.
     * This should be overridden for localization.
     */
    stripRe: /[\$,%]/g,
    dashesRe: /-/g,
    iso8601TestRe: /\d\dT\d\d/,
    iso8601SplitRe: /[- :T\.Z\+]/

}, function() {
    var Types = this,
        sortTypes = Ext.data.SortTypes;

    Ext.apply(Types, {
        /**
         * @property {Object} AUTO
         * This data type means that no conversion is applied to the raw data before it is placed into a Record.
         */
        AUTO: {
            convert: function(value) {
                return value;
            },
            sortType: sortTypes.none,
            type: 'auto'
        },

        /**
         * @property {Object} STRING
         * This data type means that the raw data is converted into a String before it is placed into a Record.
         */
        STRING: {
            convert: function(value) {
                // 'this' is the actual field that calls this convert method
                return (value === undefined || value === null)
                    ? (this.getAllowNull() ? null : '')
                    : String(value);
            },
            sortType: sortTypes.asUCString,
            type: 'string'
        },

        /**
         * @property {Object} INT
         * This data type means that the raw data is converted into an integer before it is placed into a Record.
         * <p>The synonym <code>INTEGER</code> is equivalent.</p>
         */
        INT: {
            convert: function(value) {
                return (value !== undefined && value !== null && value !== '')
                    ? ((typeof value === 'number')
                        ? parseInt(value, 10)
                        : parseInt(String(value).replace(Types.stripRe, ''), 10)
                    )
                    : (this.getAllowNull() ? null : 0);
            },
            sortType: sortTypes.none,
            type: 'int'
        },

        /**
         * @property {Object} FLOAT
         * This data type means that the raw data is converted into a number before it is placed into a Record.
         * <p>The synonym <code>NUMBER</code> is equivalent.</p>
         */
        FLOAT: {
            convert: function(value) {
                return (value !== undefined && value !== null && value !== '')
                    ? ((typeof value === 'number')
                        ? value
                        : parseFloat(String(value).replace(Types.stripRe, ''), 10)
                    )
                    : (this.getAllowNull() ? null : 0);
            },
            sortType: sortTypes.none,
            type: 'float'
        },

        /**
         * @property {Object} BOOL
         * <p>This data type means that the raw data is converted into a boolean before it is placed into
         * a Record. The string "true" and the number 1 are converted to boolean <code>true</code>.</p>
         * <p>The synonym <code>BOOLEAN</code> is equivalent.</p>
         */
        BOOL: {
            convert: function(value) {
                if ((value === undefined || value === null || value === '') && this.getAllowNull()) {
                    return null;
                }
                return value !== 'false' && !!value;
            },
            sortType: sortTypes.none,
            type: 'bool'
        },

        /**
         * @property {Object} DATE
         * This data type means that the raw data is converted into a Date before it is placed into a Record.
         * The date format is specified in the constructor of the {@link Ext.data.Field} to which this type is
         * being applied.
         */
        DATE: {
            convert: function(value) {
                var dateFormat = this.getDateFormat(),
                    parsed;

                if (!value) {
                    return null;
                }
                if (Ext.isDate(value)) {
                    return value;
                }
                if (dateFormat) {
                    if (dateFormat == 'timestamp') {
                        return new Date(value*1000);
                    }
                    if (dateFormat == 'time') {
                        return new Date(parseInt(value, 10));
                    }
                    return Ext.Date.parse(value, dateFormat);
                }

                parsed = new Date(Date.parse(value));
                if (isNaN(parsed)) {
                    // Dates with ISO 8601 format are not well supported by mobile devices, this can work around the issue.
                    if (Types.iso8601TestRe.test(value)) {
                        parsed = value.split(Types.iso8601SplitRe);
                        parsed = new Date(parsed[0], parsed[1]-1, parsed[2], parsed[3], parsed[4], parsed[5]);
                    }
                    if (isNaN(parsed)) {
                        // Dates with the format "2012-01-20" fail, but "2012/01/20" work in some browsers. We'll try and
                        // get around that.
                        parsed = new Date(Date.parse(value.replace(this.dashesRe, "/")));
                        //<debug>
                        if (isNaN(parsed)) {
                            Ext.Logger.warn("Cannot parse the passed value (" + value + ") into a valid date");
                        }
                        //</debug>
                    }
                }

                return isNaN(parsed) ? null : parsed;
            },
            sortType: sortTypes.asDate,
            type: 'date'
        }
    });

    Ext.apply(Types, {
        /**
         * @property {Object} BOOLEAN
         * <p>This data type means that the raw data is converted into a boolean before it is placed into
         * a Record. The string "true" and the number 1 are converted to boolean <code>true</code>.</p>
         * <p>The synonym <code>BOOL</code> is equivalent.</p>
         */
        BOOLEAN: this.BOOL,

        /**
         * @property {Object} INTEGER
         * This data type means that the raw data is converted into an integer before it is placed into a Record.
         * <p>The synonym <code>INT</code> is equivalent.</p>
         */
        INTEGER: this.INT,

        /**
         * @property {Object} NUMBER
         * This data type means that the raw data is converted into a number before it is placed into a Record.
         * <p>The synonym <code>FLOAT</code> is equivalent.</p>
         */
        NUMBER: this.FLOAT
    });
});
