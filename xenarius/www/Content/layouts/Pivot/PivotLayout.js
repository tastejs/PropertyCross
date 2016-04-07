(function($, DX, undefined) {
    var HAS_TOOLBAR_BOTTOM_CLASS = "has-toolbar-bottom",
        TOOLBAR_BOTTOM_SELECTOR = ".layout-toolbar-bottom",
        ACTIVE_PIVOT_ITEM_SELECTOR = ".dx-pivot-item:not(.dx-pivot-item-hidden)";
    DX.framework.html.PivotLayoutController = DX.framework.html.DefaultLayoutController.inherit({
        ctor: function(options) {
            options = options || {};
            options.name = options.name || "pivot";
            this._viewsInLayout = {};
            this.callBase(options)
        },
        init: function(options) {
            this.callBase(options)
        },
        _createNavigationWidget: function() {
            var that = this;
            this.$root = $("<div/>").addClass("pivot-layout");
            this.$pivot = $("<div/>").appendTo(this.$root).dxPivot({itemTemplate: function(itemData, itemIndex, itemElement) {
                    var emptyLayout = that._createEmptyLayout();
                    that._showElements(emptyLayout);
                    emptyLayout.find(".layout-footer").remove();
                    emptyLayout.appendTo(itemElement)
                }}).dxCommandContainer({id: 'global-navigation'});
            this.$pivot.dxPivot("instance").on("optionChanged", function(args) {
                if (args.name === "items")
                    that._clearPivotViewsRenderCache()
            });
            var $tmpLayoutForFooter = that._createEmptyLayout();
            this._showElements($tmpLayoutForFooter);
            this.$footer = $tmpLayoutForFooter.find(".layout-footer").insertAfter(this.$pivot);
            return this.$pivot
        },
        _clearPivotViewsRenderCache: function() {
            var that = this;
            $.each(this._viewsInLayout, function(key, viewInfo) {
                that._clearRenderResult(viewInfo)
            })
        },
        _renderNavigationImpl: function(navigationCommands) {
            var container = this.$pivot.dxCommandContainer("instance");
            this._commandManager.renderCommandsToContainers(navigationCommands, [container])
        },
        element: function() {
            return this.$root
        },
        _getViewFrame: function(viewInfo) {
            var $result = this.$pivot.find(ACTIVE_PIVOT_ITEM_SELECTOR);
            $result = $result.add(this.$footer);
            return $result
        },
        _showViewImpl: function(viewInfo, direction, previousViewTemplateId) {
            this._showViewElements(viewInfo.renderResult.$markup);
            this._changeView(viewInfo, previousViewTemplateId);
            this._changeAppbar();
            this._viewsInLayout[viewInfo.key] = viewInfo;
            return $.Deferred().resolve().promise()
        },
        _changeAppbar: function() {
            var $appbar = this.$footer.find(".dx-active-view " + TOOLBAR_BOTTOM_SELECTOR),
                appbar = $appbar.data("dxToolbar");
            if (appbar)
                this._refreshAppbarVisibility(appbar, this.$root)
        },
        _refreshAppbarVisibility: function(appbar, $container) {
            var isAppbarNotEmpty = false;
            $.each(appbar.option("items"), function(index, item) {
                if (item.visible) {
                    isAppbarNotEmpty = true;
                    return false
                }
            });
            $container.toggleClass(HAS_TOOLBAR_BOTTOM_CLASS, isAppbarNotEmpty);
            appbar.option("visible", isAppbarNotEmpty)
        },
        _hideView: function(viewInfo) {
            this.callBase.apply(this, arguments);
            this._changeAppbar()
        }
    });
    var layoutSets = DX.framework.html.layoutSets;
    layoutSets["navbar"] = layoutSets["navbar"] || [];
    layoutSets["navbar"].push({
        platform: "win",
        version: [8],
        phone: true,
        root: true,
        controller: new DX.framework.html.PivotLayoutController
    })
})(jQuery, DevExpress);