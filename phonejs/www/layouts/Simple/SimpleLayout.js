(function($, DX, undefined) {

    var INITED = "__inited";

    DX.framework.html.Win8SimpleLayoutController = DX.framework.html.DefaultLayoutController.inherit({

        _onRenderComplete: function(viewInfo) {
            var $toolbarBottom = viewInfo.renderResult.$markup.find(".layout-toolbar-bottom"),
                toolbarBottom = $toolbarBottom.data("dxToolbar");

            if(!$toolbarBottom.data(INITED)) {
                $toolbarBottom.data(INITED, true);
                $toolbarBottom.click(function() {
                    if($toolbarBottom.get(0) === event.srcElement) {
                        $(this).toggleClass("semi-hidden");
                    }
                });
            }

            if(toolbarBottom && toolbarBottom.option("items").length) {
                viewInfo.renderResult.$markup.find(".layout-frame").addClass("has-toolbar-bottom");
            }

            window.setTimeout(function() {
                $toolbarBottom.addClass("with-transition");
            });
        }
    });

    DX.framework.html.layoutControllers.win8simple = new DX.framework.html.Win8SimpleLayoutController();

})(jQuery, DevExpress);