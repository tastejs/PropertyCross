/**
 * {@link Ext.ProgressIndicator} provides a progress indicator for file uploads.
 */
Ext.define('Ext.ProgressIndicator', {
    extend: 'Ext.Container',

    mixins: ['Ext.mixin.Progressable'],

    xtype: 'progressindicator',

    config: {
        baseCls: Ext.baseCSSPrefix + 'progressindicator',
        hidden: true,
        modal: true,
        centered: true,

        /**
         * @cfg {String/Ext.XTemplate/Object} loadingText
         * This template is used when progress is dynamic (many updates will be received). Template will be passed
         * and object with properties percent and state.
         *
         * If a String or XTemplate is given that text will be used for all states of loading. One can optionally pass in an object
         * with the properties 'upload' and/or 'download' with custom state templates.
         *
         *
         * @accessor
         */
        loadingText: {
            any: 'Loading: {percent}%',
            upload: 'Uploading: {percent}%',
            download: 'Downloading: {percent}%'
        },

        /**
         * @cfg {String/Object} fallbackText
         * This String is used when progress is not dynamic (only start and end events will be received).
         *
         * If a String is given that text will be used for all states of loading. One can optionally pass in an object
         * with the properties 'upload' and/or 'download' with custom state strings.
         *
         * @accessor
         */
        fallbackText: {
            any: 'Loading',
            upload: 'Uploading',
            download: 'Downloading'
        },

        /**
         * @cfg {Object} monitoredStates
         * Object with the properties of 'upload' and 'download'. To disable progress monitoring of any state simply set
         * it to false. For example:
         *
         *  monitoredStates: {
         *      upload:false
         *  }
         *
         *  @accessor
         */
        monitoredStates: {
            upload: true,
            download: true
        },

        showAnimation: !Ext.browser.is.AndroidStock ? {
            type: 'slideIn',
            direction: "left",
            duration: 250,
            easing: 'ease-out'
        } : null,

        hideAnimation: !Ext.browser.is.AndroidStock ? {
            type: 'slideOut',
            direction: "left",
            duration: 250,
            easing: 'ease-in'
        } : null,

        // @private
        minProgressOutput: 0,
        // @private
        maxProgressOutput: 1,
        //@private
        state: null
    },

    constructor: function() {
        this.emptyTpl = new Ext.XTemplate("");
        this.callParent(arguments);
    },

    getElementConfig: function() {
        return {
            reference: 'element',
            classList: ['x-container', 'x-unsized'],
            children: [
                {
                    reference: 'innerElement',
                    className: Ext.baseCSSPrefix + 'progressindicator-inner',
                    children: [
                        {
                            reference: 'progressBarText',
                            className: Ext.baseCSSPrefix + 'progressindicator-text'
                        },
                        {
                            reference: 'progressBar',
                            className: Ext.baseCSSPrefix + 'progressindicator-bar',
                            children: [
                                {
                                    reference: 'progressBarFill',
                                    className: Ext.baseCSSPrefix + 'progressindicator-bar-fill'
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    },

    onStartProgress: function() {
        if (!this.getParent()) {
            Ext.Viewport.add(this);
        }
        this.show();
    },

    onEndProgress: function() {
        this.hide();
    },

    onUpdateProgress: function() {
        this.updateBar();
    },

    getLoadingText: function() {
        var state = this.getState();
        if (this._loadingText[state]) {
            return this._loadingText[state];
        }

        if (this._loadingText["any"]) {
            return this._loadingText["any"];
        }

        return this.emptyTpl;
    },

    applyLoadingText: function(loadingText) {
        var tpl = {}, property, value;
        if (Ext.isString(loadingText)) {
            tpl = {
                any: new Ext.XTemplate(loadingText)
            }
        } else if (loadingText instanceof Ext.XTemplate) {
            tpl = {
                any: loadingText
            }
        } else {
            for (property in loadingText) {
                value = loadingText[property];
                tpl[property] = new Ext.XTemplate(value);
            }
        }
        if (!tpl.any) {
            tpl.any = this.emptyTpl;
        }
        return tpl;
    },

    getFallbackText: function() {
        var state = this.getState();
        if (this._fallbackText[state]) {
            return this._fallbackText[state];
        }

        if(this._fallbackText["any"]) {
            return this._fallbackText["any"];
        }

        return "";
    },

    applyFallbackText: function(fallbackText) {
        var obj = {}, property, value;
        if (Ext.isString(fallbackText)) {
            obj = {
                any: fallbackText
            }
        } else {
            for (property in fallbackText) {
                value = fallbackText[property];
                obj[property] = value;
            }
        }
        if (!obj.any) {
            obj.any = this.emptyTpl;
        }
        return obj;
    },

    updateDynamic: function(value) {
        if (!value) {
            this.progressBarText.setHtml(this.getFallbackText());
            this.progressBar.setWidth("100%");
        } else {
            this.updateBar();
        }
        return value;
    },

    updateBar: function() {
        var state = this.getState();
        if(this.getMonitoredStates()[state] !== true) {
            this.progressBarText.setHtml(this.getFallbackText());
            this.progressBar.setWidth("100%");
            return;
        }

        var percent = this.getProgress() * 100;
        if (!Ext.isNumber(percent)) percent = 0;
        this.progressBar.setWidth(percent + "%");

        var loadingText = this.getLoadingText();
        if (loadingText) {
            this.progressBarText.setHtml(this.getLoadingText().apply({state:state, percent: Math.ceil(percent) || 0}));
        } else {
            this.progressBarText.setHtml('');
        }
    }
})
;
