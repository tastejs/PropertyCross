(function($, DX, undefined) {
    var HAS_NAVBAR_CLASS = "has-navbar",
        HAS_TOOLBAR_CLASS = "has-toolbar",
        HAS_TOOLBAR_BOTTOM_CLASS = "has-toolbar-bottom",
        TOOLBAR_BOTTOM_ACTIVE_CLASS = "dx-appbar-active",
        SEMI_HIDDEN_CLASS = "semi-hidden",
        TOOLBAR_BOTTOM_SELECTOR = ".layout-toolbar-bottom.win8",
        ACTIVE_PIVOT_ITEM_SELECTOR = ".dx-pivot-item:not(.dx-pivot-item-hidden)",
        LAYOUT_FOOTER_SELECTOR = ".layout-footer",
        ACTIVE_TOOLBAR_SELECTOR = ".dx-active-view .dx-toolbar";
    DX.framework.html.NavBarController = DX.framework.html.DefaultLayoutController.inherit({
        ctor: function(options) {
            options = options || {};
            options.name = options.name || "navbar";
            this.callBase(options)
        },
        _createNavigationWidget: function(navigationCommands) {
            this.callBase(navigationCommands);
            this.$navbar = this._$mainLayout.find(".navbar-container");
            return this.$navbar
        },
        _renderNavigationImpl: function(navigationCommands) {
            this.callBase(navigationCommands);
            if (navigationCommands.length)
                this._$mainLayout.addClass(HAS_NAVBAR_CLASS)
        },
        _showViewImpl: function(viewInfo) {
            var that = this;
            return that.callBase.apply(that, arguments).done(function() {
                    var $toolbar = that._$mainLayout.find(LAYOUT_FOOTER_SELECTOR).find(ACTIVE_TOOLBAR_SELECTOR),
                        isToolbarEmpty = !$toolbar.length || !$toolbar.dxToolbar("instance").option("visible");
                    that._$mainLayout.toggleClass(HAS_TOOLBAR_CLASS, !isToolbarEmpty)
                })
        }
    });
    var layoutSets = DX.framework.html.layoutSets;
    layoutSets["navbar"] = layoutSets["navbar"] || [];
    layoutSets["navbar"].push({
        platform: "ios",
        controller: new DX.framework.html.NavBarController
    });
    layoutSets["navbar"].push({
        platform: "android",
        controller: new DX.framework.html.NavBarController
    });
    layoutSets["navbar"].push({
        platform: "generic",
        controller: new DX.framework.html.NavBarController
    });
    layoutSets["split"] = layoutSets["split"] || [];
    layoutSets["split"].push({
        platform: "win8",
        phone: false,
        root: true,
        pane: "master",
        controller: new DX.framework.html.NavBarController
    })
})(jQuery, DevExpress);