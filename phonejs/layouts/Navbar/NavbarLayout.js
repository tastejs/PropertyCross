(function($, DX, undefined) {

    DX.framework.html.NavBarController = DX.framework.html.DefaultLayoutController.inherit({

        _onRenderComplete: function(viewInfo) {

            var CLASS_NAME = "has-toolbar";

            var $layoutFooter = viewInfo.renderResult.$markup.find(".layout-footer"),
                $toolbar = $layoutFooter.find(".dx-toolbar");

            if($toolbar.length) {
                var isToolbarNotEmpty = !!$toolbar.data("dxToolbar").option("items").length,
                    $layoutContent = viewInfo.renderResult.$markup.find(".layout-content");

                $layoutFooter.toggleClass(CLASS_NAME, isToolbarNotEmpty);
                $layoutContent.toggleClass(CLASS_NAME, isToolbarNotEmpty);
            }

            this._initToolbar(viewInfo.renderResult.$markup);

            var $navBar = viewInfo.renderResult.$markup.find("#navBar"),
                navBar = $navBar.data("dxNavBar"),
                $content = viewInfo.renderResult.$markup.find(".layout-content");

            if(!navBar)
                return;

            var isNavBarVisible = $.grep(navBar.option("items"), function (navItem) {
                return $.isFunction(navItem.visible) ? navItem.visible() : navItem.visible;
            }).length;

            if(isNavBarVisible) {
                $content.addClass("has-navbar");
                $navBar.show();
            }
            else {
                $content.removeClass("has-navbar");
                $navBar.hide();
            }

            this.callBase.apply(this, arguments);
        },

        _initToolbar: function($markup) {
            var $layoutFooter = $markup.find(".layout-toolbar-bottom.win8");
            if(!$layoutFooter.data("__inited")) {
                $layoutFooter.data("__inited", true);
                $layoutFooter.click(function() {
                    if($layoutFooter.get(0) === event.srcElement) {
                        $(this).toggleClass("semi-hidden");
                    }
                });
            }
        }

    });

    DX.framework.html.layoutControllers.navbar = new DX.framework.html.NavBarController();

})(jQuery, DevExpress);