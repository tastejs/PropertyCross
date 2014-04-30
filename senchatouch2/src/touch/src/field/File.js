/**
 * @aside guide forms
 *
 * Creates an HTML file input field on the page. This is usually used to upload files to remote server. File fields are usually
 * created inside a form like this:
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'fieldset',
 *                 title: 'My Uploader',
 *                 items: [
 *                     {
 *                         xtype: 'filefield',
 *                         label: "MyPhoto:",
 *                         name: 'photo',
 *                         accept: 'image'
 *                     }
 *                 ]
 *             }
 *         ]
 *     });
 */

Ext.define('Ext.field.File', {
    extend: 'Ext.field.Field',
    xtype : 'filefield',
    requires: ["Ext.field.FileInput"],

    config : {
        component: {
            xtype : 'fileinput',
            fastFocus: false
        }
    },

    proxyConfig: {
        name: null,
        value: null,
        files:null,

        /**
         * @cfg {Boolean} multiple Allow selection of multiple files
         *
         * @accessor
         */
        multiple: false,

        /**
         * @cfg {String} accept File input accept attribute documented here (http://www.w3schools.com/tags/att_input_accept.asp)
         * Also can be simple strings -- e.g. audio, video, image
         *
         * @accessor
         */
        accept: null,
        /**
         * @cfg {String} capture File input capture attribute. Accepts values such as "camera", "camcorder", "microphone"
         *
         * @accessor
         */
        capture: null
    },

    // @private
    isFile: true,

    // @private
    initialize: function() {
        var me = this;

        me.callParent();

        me.getComponent().on({
            scope: this,
            change      : 'onChange'
        });
    },

    onChange: function(me, value, startValue) {
        me.fireEvent('change', this, value, startValue);
    }
});
