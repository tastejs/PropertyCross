(function($, DX, undefined) {
    DX.framework.html.SimpleLayoutController = DX.framework.html.DefaultLayoutController.inherit({ctor: function(options) {
            options = options || {};
            options.name = options.name || "simple";
            this.callBase(options)
        }});
    var HAS_TOOLBAR_BOTTOM_CLASS = "has-toolbar-bottom",
        LAYOUT_TOOLBAR_BOTTOM_SELECTOR = ".layout-toolbar-bottom";
    DX.framework.html.Win8SimpleLayoutController = DX.framework.html.SimpleLayoutController.inherit({
        ctor: function() {
            this.callBase(this, arguments);
            this._toolbarOptionChangedHandler = $.proxy(this._onToolbarOptionChanged, this)
        },
        _onToolbarOptionChanged: function(args) {
            if (args.name === "items") {
                this._refreshAppbarVisibility(appbar);
                this._refreshHasToolbarClass()
            }
        },
        _getAppbar: function($markup) {
            var $appbar = $markup.find(LAYOUT_TOOLBAR_BOTTOM_SELECTOR);
            if ($appbar.length === 1)
                appbar = $appbar.dxToolbar("instance");
            return appbar
        },
        _getCurrentAppbar: function() {
            return this._getAppbar(this._getViewFrame().find(".dx-active-view "))
        },
        _onRenderComplete: function(viewInfo) {
            var appbar = this._getAppbar(viewInfo.renderResult.$markup);
            if (appbar) {
                this._refreshAppbarVisibility(appbar);
                appbar.on("optionChanged", this._toolbarOptionChangedHandler)
            }
        },
        disposeView: function(viewInfo) {
            var appbar = this._getAppbar(viewInfo.renderResult.$markup);
            if (appbar)
                appbar.off("optionChanged", this._toolbarOptionChangedHandler);
            this.callBase.apply(this, arguments)
        },
        _changeView: function(viewInfo) {
            var that = this,
                result = this.callBase.apply(this, arguments);
            result.done(function() {
                that._refreshHasToolbarClass()
            });
            return result
        },
        _refreshAppbarVisibility: function(appbar) {
            var isAppbarNotEmpty = false;
            $.each(appbar.option("items"), function(index, item) {
                if (item.visible) {
                    isAppbarNotEmpty = true;
                    return false
                }
            });
            appbar.option("visible", isAppbarNotEmpty)
        },
        _refreshHasToolbarClass: function() {
            var hasToolbar = false,
                appbar = this._getCurrentAppbar(),
                hasToolbar = appbar ? appbar.option("visible") : false;
            this._getViewFrame().toggleClass(HAS_TOOLBAR_BOTTOM_CLASS, hasToolbar)
        }
    });
    var layoutSets = DX.framework.html.layoutSets;
    layoutSets["navbar"] = layoutSets["navbar"] || [];
    layoutSets["navbar"].push({
        platform: "win8",
        root: false,
        phone: true,
        controller: new DX.framework.html.Win8SimpleLayoutController
    });
    layoutSets["navbar"].push({
        platform: "android",
        root: false,
        controller: new DX.framework.html.SimpleLayoutController
    });
    layoutSets["simple"] = layoutSets["simple"] || [];
    layoutSets["simple"].push({controller: new DX.framework.html.SimpleLayoutController});
    layoutSets["simple"].push({
        platform: "win8",
        phone: true,
        controller: new DX.framework.html.Win8SimpleLayoutController
    })
})(jQuery, DevExpress);