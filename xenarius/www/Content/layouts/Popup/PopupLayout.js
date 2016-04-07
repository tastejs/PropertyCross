(function($, DX, undefined) {
    var DefaultLayoutController = DX.framework.html.DefaultLayoutController,
        abstract = DefaultLayoutController.abstract;
    DX.framework.html.OverlayLayoutControllerBase = DefaultLayoutController.inherit({
        ctor: function(options) {
            options = options || {};
            this.callBase(options);
            if (!options.childController) {
                this._ensureChildController("SimpleLayoutController", "SimpleLayout");
                this.childController = new DX.framework.html.SimpleLayoutController
            }
            else
                this.childController = options.childController;
            this.contentContainerSelector = options.contentContainerSelector
        },
        _initChildController: function(options) {
            var that = this,
                $targetViewPort = that._$mainLayout.find(this.contentContainerSelector);
            that.childController.init($.extend({}, options, {$viewPort: $targetViewPort}));
            $.each(["viewRendered", "viewShowing", "viewReleased", "viewHidden"], function(_, callbacksPropertyName) {
                that.childController.on(callbacksPropertyName, function(args) {
                    that.fireEvent(callbacksPropertyName, [args])
                })
            })
        },
        _ensureChildController: function(controllerName, layoutName) {
            if (!DX.framework.html[controllerName])
                throw new Error(controllerName + " is not found but it is required by the '" + this.name + "' layout for specified platform and device. Make sure the " + layoutName + ".* files are referenced in your main *.html file or specify other platform and device.");
        },
        _base: function() {
            return DefaultLayoutController.prototype
        },
        _showContainerWidget: abstract,
        _hideContainerWidget: abstract,
        init: function(options) {
            options = options || {};
            this.callBase(options);
            this._initChildController(options)
        },
        activate: function($target) {
            var that = this,
                result;
            that.childController.activate();
            that._base().activate.call(that, $target);
            result = that._showContainerWidget($target);
            return result
        },
        deactivate: function() {
            var that = this,
                result;
            result = that._hideContainerWidget();
            result.done(function() {
                that._base().deactivate.call(that);
                that.childController.deactivate()
            });
            return result
        },
        showView: function(viewInfo, direction) {
            return this.childController.showView(viewInfo, direction)
        }
    });
    DX.framework.html.PopupLayoutController = DX.framework.html.OverlayLayoutControllerBase.inherit({
        ctor: function(options) {
            options = options || {};
            options.name = options.name || "popup";
            options.contentContainerSelector = options.contentContainerSelector || ".child-controller-content";
            this.isOverlay = true;
            this._targetContainer = options.targetContainer;
            this.callBase(options)
        },
        init: function(options) {
            this.callBase(options);
            this._popup = this._$mainLayout.find(".popup-container").dxPopup("instance");
            if (this._targetContainer)
                this._popup.option("container", this._targetContainer)
        },
        _showContainerWidget: function() {
            return this._popup.show()
        },
        _hideContainerWidget: function() {
            return this._popup.hide()
        }
    });
    var layoutSets = DX.framework.html.layoutSets;
    $.each(["navbar", "simple", "slideout", "pivot", "split"], function(index, name) {
        layoutSets[name] = layoutSets[name] || [];
        $.each(layoutSets[name], function(index, layoutInfo) {
            layoutInfo.modal = false
        });
        layoutSets[name].push({
            modal: true,
            controller: new DX.framework.html.PopupLayoutController
        })
    })
})(jQuery, DevExpress);