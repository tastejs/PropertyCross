(function($, DX, undefined) {
    DX.framework.html.SlideOutController = DX.framework.html.DefaultLayoutController.inherit({
        ctor: function(options) {
            options = options || {};
            options.name = options.name || "slideout";
            this.swipeEnabled = options.swipeEnabled === undefined ? true : options.swipeEnabled;
            this.callBase(options)
        },
        init: function(options) {
            this.callBase(options);
            this._navigationManager = options.navigationManager;
            this._navigationCanceledHandler = $.proxy(this._onNavigatingCanceled, this)
        },
        activate: function() {
            var result = this.callBase.apply(this, arguments);
            this._navigationManager.on("navigationCanceled", this._navigationCanceledHandler);
            return result
        },
        deactivate: function() {
            this._navigationManager.off("navigationCanceled", this._navigationCanceledHandler);
            return this.callBase.apply(this, arguments)
        },
        _onNavigatingCanceled: function(args) {
            if (this.slideOut.option("menuVisible") && args.cancelReason !== "redirect")
                this._toggleNavigation()
        },
        _createNavigationWidget: function() {
            this.$slideOut = $("<div data-bind='dxSlideOut: {  menuItemTemplate: $(\"#slideOutMenuItemTemplate\"), contentTemplate: \" \" }'></div>").dxCommandContainer({id: 'global-navigation'});
            this._applyTemplate(this.$slideOut, this._layoutModel);
            this.callBase();
            this.slideOut = this.$slideOut.dxSlideOut("instance");
            this.slideOut.option("swipeEnabled", this.swipeEnabled);
            this.$slideOut.find(".dx-slideout-item-container").append(this._$mainLayout);
            return this.$slideOut
        },
        _renderNavigationImpl: function(navigationCommands) {
            var container = this.$slideOut.dxCommandContainer("instance");
            this._commandManager.renderCommandsToContainers(navigationCommands, [container])
        },
        element: function() {
            return this.$slideOut
        },
        _showViewImpl: function(viewInfo, direction, previousViewTemplateId) {
            this._fxOffSaved = DX.fx.off;
            if (this.slideOut.option("menuVisible"))
                DX.fx.off = true;
            return this.callBase.apply(this, arguments)
        },
        _getReadyForRenderDeferredItems: function(viewInfo) {
            var result = this.callBase(viewInfo);
            DX.fx.off = this._fxOffSaved;
            if (this.slideOut.option("menuVisible"))
                result = $.when(this._toggleNavigation(), result);
            return result
        },
        _onViewShown: function(viewInfo) {
            this._refreshVisibility()
        },
        _refreshVisibility: function() {
            if (DX.devices.real().platform === "android") {
                this.$slideOut.css("backface-visibility", "hidden");
                this.$slideOut.css("backface-visibility");
                this.$slideOut.css("backface-visibility", "visible")
            }
        },
        _viewHasBackCommands: function(viewInfo) {
            var hasBackCommands = false;
            $.each(viewInfo.commands, function(index, command) {
                if ((command.option("behavior") === "back" || command.option("id") === "back") && command.option("visible")) {
                    hasBackCommands = true;
                    return false
                }
            });
            return hasBackCommands
        },
        _onRenderComplete: function(viewInfo) {
            var that = this;
            if (!that._viewHasBackCommands(viewInfo))
                that._initNavigationButton(viewInfo.renderResult.$markup);
            var $content = viewInfo.renderResult.$markup.find(".layout-content"),
                $appbar = viewInfo.renderResult.$markup.find(".layout-toolbar-bottom"),
                appbar = $appbar.data("dxToolbar");
            if (appbar) {
                that._refreshAppbarVisibility(appbar, $content);
                appbar.on("optionChanged", function(args) {
                    if (args.name === "items")
                        that._refreshAppbarVisibility(appbar, $content)
                })
            }
        },
        _refreshAppbarVisibility: function(appbar, $content) {
            var isAppbarNotEmpty = false;
            $.each(appbar.option("items"), function(index, item) {
                if (item.visible) {
                    isAppbarNotEmpty = true;
                    return false
                }
            });
            $content.toggleClass("has-toolbar-bottom", isAppbarNotEmpty);
            appbar.option("visible", isAppbarNotEmpty)
        },
        _initNavigationButton: function($markup) {
            var that = this,
                $toolbar = $markup.find(".layout-toolbar"),
                toolbar = $toolbar.data("dxToolbar");
            var initNavButton = function() {
                    toolbar.option("items[0].visible", true);
                    $toolbar.find(".nav-button").data("dxButton").option("onClick", $.proxy(that._toggleNavigation, that, $markup))
                };
            initNavButton();
            toolbar.on("contentReady", function(args) {
                initNavButton()
            })
        },
        _toggleNavigation: function($markup) {
            return this.slideOut.toggleMenuVisibility()
        }
    });
    var layoutSets = DX.framework.html.layoutSets;
    layoutSets["slideout"] = layoutSets["slideout"] || [];
    layoutSets["slideout"].push({
        platform: "ios",
        controller: new DX.framework.html.SlideOutController
    });
    layoutSets["slideout"].push({
        platform: "android",
        controller: new DX.framework.html.SlideOutController
    });
    layoutSets["slideout"].push({
        platform: "generic",
        controller: new DX.framework.html.SlideOutController
    });
    layoutSets["slideout"].push({
        platform: "win",
        controller: new DX.framework.html.SlideOutController
    })
})(jQuery, DevExpress);