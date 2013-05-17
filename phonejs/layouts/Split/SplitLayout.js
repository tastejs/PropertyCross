(function($, DX, undefined) {

    var APPBAR_TOUCH_AREA_HEIGHT = 50,
        APPBAR_TOUCH_THRESHOLD = 50,
        EVENTS_NAMESPACE = ".dxSplitLayout",
        KEYCODE_WIN = 91,
        KEYCODE_Z = 90;

    DX.framework.html.SplitLayoutController = DX.framework.html.DefaultLayoutController.inherit({

        init: function(options) {
            this.callBase(options);
            this._navigationManager.navigating.add($.proxy(this._onNavigating, this));
            this._viewEngine = options.app.viewEngine;
            this._eventHelper = new SplitLayoutEventHelper(this);
            this._commandHelper = new SplitLayoutCommandHelper(this);
        },

        _onNavigating: function(args) {
            var targets = DX.framework.NavigationManager.NAVIGATION_TARGETS;

            if(args.options.target === targets.back || !args.options.target)
                args.options.target = targets.blank;
        },

        _showInLeftPanel: function(viewInfo) {
            return !this.$viewPort.find(".left-content").children().length || viewInfo.model.targetFrame === "navigation";
        },

        _showViewImpl: function(viewInfo, direction) {
            this._viewEngine.renderCompleteView(viewInfo);//TODO remove workaround

            var $leftSideContent = this.$viewPort.find(".left-content").children(),
                $markup = viewInfo.renderResult.$markup,
                $toolbarFooter = $markup.find(".footer-toolbar"),
                $toolbarHeader = $markup.find(".header-toolbar");

            if(this._showInLeftPanel(viewInfo)) {
                if(!$leftSideContent.length) {
                    this._saveLinkToBackPage(viewInfo);
                }
                this._commandHelper.saveCommandsFromToolbar($toolbarFooter);
            }
            else {
                this._commandHelper.appendSavedCommands($toolbarFooter);
            }

            this.callBase.apply(this, arguments);

            this.$viewPort.append($markup);
            this._commandHelper.appendCommandBack($toolbarHeader);
            $markup.show();
            this._eventHelper.setAppbarBehavior(viewInfo.model.mode !== "edit");

            return $.Deferred().resolve().promise();
        },

        //B233476
        _changeView: function(viewInfo) {
            var $leftSide = this.$viewPort.find(".left-content"),
                $markup = viewInfo.renderResult.$markup,
                $content = $markup.find(".content");

            if(this._showInLeftPanel(viewInfo)) {
                $content.appendTo($markup.find(".left-content"));
            }
            else {
                $markup.find(".left-content").append($leftSide.children());
            }

            this.callBase.apply(this, arguments);
        },

        _saveLinkToBackPage: function() {
            var self = this;

            if(this._navigationManager.canBack()) {
                var previousUri = this._navigationManager.getPreviousItem().uri;

                this._commandHelper.saveActionToBackPage(function() {
                    self._navigationManager.navigate(previousUri, {
                        target: "back"
                    });
                });
            }
        },

        _appBarHasCommands: function() {
            var footerToolbar = this.$viewPort.find(".footer-toolbar").data("dxToolbar");

            return footerToolbar ? footerToolbar.option("items").length : false;
        }

    });

    var SplitLayoutCommandHelper = DX.Class.inherit({

        ctor: function(splitLayout) {
            this.root = splitLayout;

            this._savedCommands = [];
            this._commandOnpreviousPage = new DX.framework.dxCommand({
                id: "back",
                title: "back",
                location: "previousPage",
                icon: "arrowleft",
                type: "back",
                behavior: "back"
            });
            this._allCommands = [];
        },

        saveActionToBackPage: function(action) {
            this._commandOnpreviousPage.option("action", action);
        },

        saveCommandsFromToolbar: function($toolbar) {
            this._savedCommands = $toolbar.data("dxToolbar").option("items");
        },

        appendSavedCommands: function($toolbar) {
            var toolbar = $toolbar.data("dxToolbar"),
                items = toolbar.option("items");

            toolbar.option("items", $.merge(items, this._savedCommands));
        },

        appendCommandBack: function($toolbar) {
            var toolbarAdapter = DX.framework.html.commandToDXWidgetAdapters.dxToolbar;
            if(this._commandOnpreviousPage.option("action"))
                toolbarAdapter.addCommand($toolbar, this._commandOnpreviousPage, { showIcon: true, showText: false, align: "left" });
        }

    });

    var SplitLayoutEventHelper = DX.Class.inherit({

        ctor: function(splitLayout) {
            this.root = splitLayout;

            this.root.$viewPort.on("MSPointerUp" + EVENTS_NAMESPACE, $.proxy(this._handlePointerUp, this));
            this.root.$viewPort.on("MSPointerDown" + EVENTS_NAMESPACE, $.proxy(this._handlePointerDown, this));
            $(document).on("keydown" + EVENTS_NAMESPACE, $.proxy(this._handleKeyDown, this));
            $(document).on("keyup" + EVENTS_NAMESPACE, $.proxy(this._handleKeyUp, this));

            this._startTouchPoint = false;
            this._winKeyPressed = false;
            this._moveEvent = false;
        },

        _handlePointerDown: function(e) {
            var originalEvent = e.originalEvent;

            if(this._isTouch(originalEvent) && this._startedInAppBarArea(originalEvent)) {
                this._startTouchPoint = {
                    x: originalEvent.clientX,
                    y: originalEvent.clientY
                };
                this.root.$viewPort.on("MSPointerMove" + EVENTS_NAMESPACE, $.proxy(this._handlePointerMove, this));
            }
        },

        _handlePointerMove: function(e) {
            var originalEvent = e.originalEvent;

            if(this._tresholdExceeded(originalEvent)) {
                this._moveEvent = true;
                this.root.$viewPort.off("MSPointerMove" + EVENTS_NAMESPACE);
                if(this._isVericalDirection(originalEvent.clientX, originalEvent.clientY))
                    this._toggleAppBarState(true);
            }
        },

        _handlePointerUp: function(e) {
            this.root.$viewPort.off("MSPointerMove" + EVENTS_NAMESPACE);

            var $appBar = this.root.$viewPort.find(".dx-app-bar");

            if(e.originalEvent.button === 2) {
                this._toggleAppBarState();
            } else if(!this._moveEvent && $appBar[0] && !$appBar[0].contains(e.target)) {
                this._toggleAppBarState(false);
            }

            this._moveEvent = false;
        },

        _handleKeyDown: function(e) {
            if(e.keyCode === KEYCODE_WIN) {
                this._winKeyPressed = true;
            }
        },

        _handleKeyUp: function(e) {
            if(this._winKeyPressed && (e.keyCode === KEYCODE_Z)) {
                this._toggleAppBarState();
            } else if(e.keyCode === KEYCODE_WIN) {
                this._winKeyPressed = false;
            }
        },

        setAppbarBehavior: function(state) {
            $(".split-layout").toggleClass("have-static-appbar", !state);
            this._toggleAppBarState(!state);
            this._appbarBehavior = state;
        },

        _toggleAppBarState: function(state) {
            if(!this.root._appBarHasCommands() || !this._appbarBehavior)
                return;

            this.root.$viewPort.find(".dx-app-bar").toggleClass("dx-app-bar-visible", state);
        },

        _isVericalDirection: function(x, y) {
            return Math.abs(y - this._startTouchPoint.y) > Math.abs(x - this._startTouchPoint.x);
        },

        _isTouch: function(event) {
            return event.pointerType === event.MSPOINTER_TYPE_TOUCH ||
                event.pointerType === event.MSPOINTER_TYPE_PEN;
        },

        _startedInAppBarArea: function(event) {
            return (this.root.$viewPort.height() - APPBAR_TOUCH_AREA_HEIGHT) < event.clientY;
        },

        _tresholdExceeded: function(originalEvent) {
            return originalEvent.clientY < (this._startTouchPoint.y - APPBAR_TOUCH_THRESHOLD);
        }
    });

    DX.framework.html.layoutControllers.split = new DX.framework.html.SplitLayoutController();

})(jQuery, DevExpress);