(function($, DX, undefined) {

    var INITED = "__inited";

    DX.framework.html.Win8SimpleLayoutController = DX.framework.html.DefaultLayoutController.inherit({

        _showViewImpl: function(viewInfo, direction) {
            var $layoutFooter = viewInfo.renderResult.$markup.find(".layout-toolbar-bottom");
            if(!$layoutFooter.data(INITED)) {
                $layoutFooter.data(INITED, true);
                $layoutFooter.click(function() {
                    if($layoutFooter.get(0) === event.srcElement) {
                        $(this).toggleClass("semi-hidden");
                    }
                });
            }
            return this.callBase.apply(this, arguments);
        }
    });

    DX.framework.html.layoutControllers.win8simple = new DX.framework.html.Win8SimpleLayoutController();

})(jQuery, DevExpress);