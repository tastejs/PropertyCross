(function($, DX, undefined) {
    var Class = DevExpress.require("/class"),
        errors = DevExpress.require("/framework/framework.errors"),
        ko = window.ko;
    var APPBAR_TOUCH_AREA_HEIGHT = 50,
        APPBAR_TOUCH_THRESHOLD = 50,
        EVENTS_NAMESPACE = ".dxSplitLayout",
        KEYCODE_WIN = 91,
        KEYCODE_Z = 90,
        POINTER_DOWN_EVENT_NAME,
        POINTER_UP_EVENT_NAME,
        POINTER_MOVE_EVENT_NAME;
    if (window.PointerEvent) {
        POINTER_DOWN_EVENT_NAME = "pointerdown";
        POINTER_UP_EVENT_NAME = "pointerup";
        POINTER_MOVE_EVENT_NAME = "pointermove"
    }
    else if (window.MSPointerEvent) {
        POINTER_DOWN_EVENT_NAME = "MSPointerDown";
        POINTER_UP_EVENT_NAME = "MSPointerUp";
        POINTER_MOVE_EVENT_NAME = "MSPointerMove"
    }
    else {
        POINTER_DOWN_EVENT_NAME = "mousedown";
        POINTER_UP_EVENT_NAME = "mouseup";
        POINTER_MOVE_EVENT_NAME = "mousemove"
    }
    var SplitLayoutEventHelper = Class.inherit({
            ctor: function(splitLayout) {
                this.root = splitLayout
            },
            init: function() {
                this.root._$viewPort.on(POINTER_UP_EVENT_NAME + EVENTS_NAMESPACE, $.proxy(this._pointerUpHandler, this));
                this.root._$viewPort.on(POINTER_DOWN_EVENT_NAME + EVENTS_NAMESPACE, $.proxy(this._pointerDownHandler, this));
                $(document).on("keydown" + EVENTS_NAMESPACE, $.proxy(this._keyDownHandler, this));
                $(document).on("keyup" + EVENTS_NAMESPACE, $.proxy(this._keyUpHandler, this));
                this._startTouchPoint = false;
                this._winKeyPressed = false;
                this._moveEvent = false;
                this._appbarBehavior = true
            },
            _pointerDownHandler: function(e) {
                var originalEvent = e.originalEvent;
                if (this._isTouch(originalEvent) && this._startedInAppBarArea(originalEvent)) {
                    this._startTouchPoint = {
                        x: originalEvent.clientX,
                        y: originalEvent.clientY
                    };
                    this.root._$viewPort.on(POINTER_MOVE_EVENT_NAME + EVENTS_NAMESPACE, $.proxy(this._pointerMoveHandler, this))
                }
            },
            _pointerMoveHandler: function(e) {
                var originalEvent = e.originalEvent;
                if (this._tresholdExceeded(originalEvent)) {
                    this._moveEvent = true;
                    this.root._$viewPort.off(POINTER_MOVE_EVENT_NAME + EVENTS_NAMESPACE);
                    if (this._isVericalDirection(originalEvent.clientX, originalEvent.clientY))
                        this._toggleAppBarState(true)
                }
            },
            _pointerUpHandler: function(e) {
                this.root._$viewPort.off(POINTER_MOVE_EVENT_NAME + EVENTS_NAMESPACE);
                var $appBar = this.root._$viewPort.find(".dx-app-bar");
                if (e.originalEvent.button === 2)
                    this._toggleAppBarState();
                else if (!this._moveEvent && $appBar[0] && !$appBar[0].contains(e.target))
                    this._toggleAppBarState(false);
                this._moveEvent = false
            },
            _keyDownHandler: function(e) {
                if (e.keyCode === KEYCODE_WIN)
                    this._winKeyPressed = true
            },
            _keyUpHandler: function(e) {
                if (this._winKeyPressed && e.keyCode === KEYCODE_Z)
                    this._toggleAppBarState();
                else if (e.keyCode === KEYCODE_WIN)
                    this._winKeyPressed = false
            },
            _toggleAppBarState: function(state) {
                if (!this.root._appBarHasCommands())
                    return;
                this.root._$viewPort.find(".dx-app-bar").toggleClass("dx-app-bar-visible", !this._appbarBehavior || state)
            },
            _isVericalDirection: function(x, y) {
                return Math.abs(y - this._startTouchPoint.y) > Math.abs(x - this._startTouchPoint.x)
            },
            _isTouch: function(event) {
                return event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === event.MSPOINTER_TYPE_PEN
            },
            _startedInAppBarArea: function(event) {
                return this.root._$viewPort.height() - APPBAR_TOUCH_AREA_HEIGHT < event.clientY
            },
            _tresholdExceeded: function(originalEvent) {
                return originalEvent.clientY < this._startTouchPoint.y - APPBAR_TOUCH_THRESHOLD
            }
        });
    DX.framework.html.MultipaneLayoutController = DX.framework.html.DefaultLayoutController.inherit({
        ctor: function(options) {
            options = options || {};
            options.name = options.name || "split";
            this._detailPaneName = options.detailPaneName || "detail";
            this._masterPaneName = options.masterPaneName || "master";
            options.defaultPaneName = this._detailPaneName;
            this.callBase(options);
            this._panesConfig = options.panesConfig;
            this._activeViews = {};
            this._stateStorageKey = "dxSplitLayoutState"
        },
        init: function(options) {
            options = options || {};
            this.callBase(options);
            this._router = options.app && options.app.router;
            this._onNavigatingHandler = $.proxy(this._onNavigating, this);
            this._onNavigatedHandler = $.proxy(this._onNavigated, this);
            this._navigationManager = options.navigationManager;
            this._ensurePanesConfig();
            this._initChildControllers(options)
        },
        activate: function() {
            var tasks = [];
            this.callBase();
            this._navigationManager.on("navigating", this._onNavigatingHandler);
            this._navigationManager.on("navigated", this._onNavigatedHandler);
            this._navigationManager.on("navigatingBack", this._onNavigatingBackHandler);
            $.each(this._panesConfig, function(_, paneConfig) {
                tasks.push(paneConfig.controller.activate())
            });
            return $.when.apply($, tasks)
        },
        deactivate: function() {
            var that = this,
                tasks = [];
            $.each(this._panesConfig, function(_, paneConfig) {
                tasks.push(paneConfig.controller.deactivate())
            });
            this._navigationManager.off("navigating", this._onNavigatingHandler);
            this._navigationManager.off("navigated", this._onNavigatedHandler);
            this.callBase();
            return $.when.apply($, tasks).done(function() {
                    that._activeViews = {}
                })
        },
        showView: function(viewInfo, direction) {
            var that = this,
                paneConfig = that._getPaneConfig(viewInfo);
            return paneConfig.controller.showView(viewInfo, direction).done(function() {
                    that._activeViews[that._getViewPaneName(viewInfo.viewTemplateInfo)] = viewInfo
                })
        },
        activeViewInfo: function() {
            return this._activeViews[this._masterPaneName]
        },
        _updateLayoutTitle: function(viewInfo, defaultTitle) {
            if (this._getViewPaneName(viewInfo.viewTemplateInfo) === this._masterPaneName) {
                var title;
                if (viewInfo.model !== undefined)
                    title = ko.utils.unwrapObservable(viewInfo.model.title);
                else
                    title = (viewInfo.viewTemplateInfo || {}).title;
                this._layoutModel.title(title || defaultTitle || "")
            }
        },
        _ensurePanesConfig: function() {
            if (!this._panesConfig)
                this._panesConfig = this._createPanesConfig()
        },
        _createPanesConfig: function() {
            return {}
        },
        _initChildControllers: function(options) {
            var that = this;
            $.each(that._panesConfig, function(_, paneConfig) {
                var controller = paneConfig.controller;
                controller.init($.extend({}, options, {$viewPort: that._$mainLayout.find(paneConfig.selector)}));
                $.each(["viewRendered", "viewShowing", "viewReleased", "viewHidden"], function(_, callbacksPropertyName) {
                    controller.on(callbacksPropertyName, function(args) {
                        that.fireEvent(callbacksPropertyName, [args])
                    })
                })
            })
        },
        _onNavigating: function(args) {
            var options = args.options,
                $sourceElement = this._getEventSourceElement(args.options.jQueryEvent);
            var routeValues = this._router.parse(args.uri),
                viewTemplateInfo = this._viewEngine.getViewTemplateInfo(routeValues.view).option(),
                pane = this._getViewPaneName(viewTemplateInfo);
            if (pane === this._detailPaneName) {
                options.stack = this._detailPaneName + "_pane";
                options.root = options.root === undefined ? $sourceElement.is(this._panesConfig[this._masterPaneName].selector + " *") : options.root;
                options.keepPositionInStack = false
            }
            else
                options.stack = options.stack || this._masterPaneCurrentStackKey;
            args.options.pane = pane
        },
        _onNavigated: function(args) {
            if (args.options.pane === this._masterPaneName)
                this._masterPaneCurrentStackKey = this._navigationManager.currentStackKey
        },
        _getEventSourceElement: function(jQueryEvent) {
            return jQueryEvent ? $(jQueryEvent.target) : $()
        },
        _getPaneConfig: function(viewInfo) {
            return this._panesConfig[this._getViewPaneName(viewInfo.viewTemplateInfo)]
        },
        _getViewPaneName: function(viewTemplateInfo) {
            return viewTemplateInfo.pane || this._detailPaneName
        },
        _raiseEvent: function(callback) {
            callback.fire()
        },
        _ensureChildController: function(controllerName, layoutName) {
            if (!DX.framework.html[controllerName])
                throw new Error(controllerName + " is not found but it is required by the '" + this.name + "' layout for specified platform and device. Make sure the " + layoutName + ".* files are referenced in your main *.html file or specify other platform and device.");
        },
        saveState: function(storage) {
            var state = {};
            $.each(this._activeViews, function(pane, viewInfo) {
                state[pane] = {
                    uri: viewInfo.uri,
                    stack: viewInfo.navigateOptions.stack
                }
            });
            var json = JSON.stringify(state);
            storage.setItem(this._stateStorageKey, json)
        },
        restoreState: function(storage) {
            var json = storage.getItem(this._stateStorageKey);
            if (json)
                try {
                    var that = this,
                        state = JSON.parse(json);
                    $.each(state, function(pane, navigateOptions) {
                        that._navigationManager.navigate(navigateOptions.uri, {
                            stack: navigateOptions.stack,
                            target: 'current'
                        })
                    })
                }
                catch(e) {
                    this.removeState(storage);
                    throw errors.Error("E3007");
                }
        },
        removeState: function(storage) {
            storage.removeItem(this._stateStorageKey)
        }
    });
    DX.framework.html.IOSSplitLayoutController = DX.framework.html.MultipaneLayoutController.inherit({_createPanesConfig: function() {
            this._ensureChildController("SimpleLayoutController", "SimpleLayout");
            return {
                    master: {
                        controller: new DX.framework.html.SimpleLayoutController,
                        selector: ".master-pane"
                    },
                    detail: {
                        controller: new DX.framework.html.SimpleLayoutController,
                        selector: ".detail-pane"
                    }
                }
        }});
    DX.framework.html.ToolbarController = Class.inherit({
        ctor: function($toolbar, commandManager) {
            this._commandManager = commandManager;
            this._$toolbar = $toolbar;
            this._toolbar = $toolbar.dxToolbar("instance");
            this._commandContainer = $toolbar.dxCommandContainer("instance")
        },
        showViews: function(viewInfos) {
            var that = this,
                commands = this._mergeCommands(viewInfos),
                toolbarItems = that._toolbar.option("items");
            var newItems = $.map(toolbarItems, function(item) {
                    return item.command ? undefined : item
                });
            that._toolbar.option("items", newItems);
            DX.fx.off = true;
            that._commandManager.renderCommandsToContainers(commands, [that._commandContainer]);
            DX.fx.off = false
        },
        _mergeCommands: function(viewInfos) {
            var result = [],
                idHash = {};
            $.each(viewInfos, function(_, viewInfo) {
                if (viewInfo.commands)
                    $.each(viewInfo.commands, function(_, command) {
                        var id = command.option("id");
                        if (!(id in idHash)) {
                            idHash[id] = true;
                            result.push(command)
                        }
                    })
            });
            return result
        }
    });
    DX.framework.html.AndroidSplitLayoutController = DX.framework.html.MultipaneLayoutController.inherit({
        ctor: function(options) {
            options = options || {};
            options.layoutModel = options.layoutModel || this._createLayoutModel();
            this.callBase(options)
        },
        init: function(options) {
            this.callBase(options);
            this.toolbarController = new DX.framework.html.ToolbarController(this._$mainLayout.find(".header-toolbar"), this._commandManager)
        },
        _createLayoutModel: function() {
            return {title: ko.observable("")}
        },
        showView: function(viewInfo, direction) {
            var that = this;
            that._updateLayoutTitle(viewInfo);
            return that.callBase(viewInfo, direction).done(function() {
                    that.toolbarController.showViews(that._activeViews)
                })
        },
        _createPanesConfig: function() {
            this._ensureChildController("EmptyLayoutController", "EmptyLayout");
            return {
                    master: {
                        controller: new DX.framework.html.EmptyLayoutController,
                        selector: ".master-pane"
                    },
                    detail: {
                        controller: new DX.framework.html.EmptyLayoutController,
                        selector: ".detail-pane"
                    }
                }
        }
    });
    DX.framework.html.WinSplitLayoutController = DX.framework.html.MultipaneLayoutController.inherit({
        ctor: function(options) {
            options = options || {};
            this._eventHelper = new SplitLayoutEventHelper(this);
            options.layoutModel = options.layoutModel || this._createLayoutModel();
            this.callBase(options)
        },
        init: function(options) {
            this.callBase(options);
            this._eventHelper.init();
            this.headerToolbarController = new DX.framework.html.ToolbarController(this._$mainLayout.find(".header-toolbar"), this._commandManager)
        },
        showView: function(viewInfo, direction) {
            var that = this;
            that._updateLayoutTitle(viewInfo);
            return that.callBase(viewInfo, direction).done(function() {
                    that.headerToolbarController.showViews(that._activeViews)
                })
        },
        _createLayoutModel: function() {
            return {title: ko.observable("")}
        },
        _createPanesConfig: function() {
            this._ensureChildController("EmptyLayoutController", "EmptyLayout");
            return {
                    master: {
                        controller: new DX.framework.html.EmptyLayoutController,
                        selector: ".left-content"
                    },
                    detail: {
                        controller: new DX.framework.html.EmptyLayoutController,
                        selector: ".right-content"
                    }
                }
        },
        _appBarHasCommands: function() {
            var footerToolbar = this._$viewPort.find(".footer-toolbar").data("dxToolbar");
            return footerToolbar ? footerToolbar.option("items").length : false
        }
    });
    DX.framework.html.Win8SplitLayoutController = DX.framework.html.WinSplitLayoutController.inherit({
        init: function(options) {
            this.callBase(options);
            this.footerToolbarController = new DX.framework.html.ToolbarController(this._$mainLayout.find(".footer-toolbar"), this._commandManager)
        },
        showView: function(viewInfo, direction) {
            var that = this;
            return that.callBase(viewInfo, direction).done(function() {
                    that.footerToolbarController.showViews(that._activeViews)
                })
        }
    });
    var layoutSets = DX.framework.html.layoutSets;
    layoutSets["split"] = layoutSets["split"] || [];
    layoutSets["split"].push({
        platform: "ios",
        tablet: true,
        controller: new DX.framework.html.IOSSplitLayoutController
    });
    layoutSets["split"].push({
        platform: "android",
        tablet: true,
        controller: new DX.framework.html.AndroidSplitLayoutController
    });
    layoutSets["split"].push({
        platform: "generic",
        tablet: true,
        controller: new DX.framework.html.IOSSplitLayoutController
    });
    layoutSets["split"].push({
        platform: "win",
        phone: false,
        controller: new DX.framework.html.WinSplitLayoutController
    });
    layoutSets["split"].push({
        platform: "win",
        version: [8],
        phone: false,
        controller: new DX.framework.html.Win8SplitLayoutController
    })
})(jQuery, DevExpress);