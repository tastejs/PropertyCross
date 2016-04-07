(function ($, DX, undefined) {

    ko.bindingHandlers["preventTabSelection"] = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var preventBubbling = function (e) { e.stopPropagation(); };
            $(element).on("mousedown", preventBubbling);
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).off("mousedown", preventBubbling);
            });
        }
    };

    DX.framework.html.DesignerController = DX.framework.html.NavBarController.inherit({
        ctor: function (options) {
            DevExpress.animationPresets.clear();
            this._global = ko.observable();
            this._functions = ko.observable();
            this.menuVisible = ko.observable(false);
            this.lastNavigatedConfigs = {};
            this.currentNavigationConfig = {};
            this.currentProjectUrl = this.getUrlParameter("json");
            options = options || {};
            options.layoutModel = options.layoutModel || this._createLayoutModel();
            options.name = "designer";
            this.callBase(options);
        },
        init: function (options) {
            var that = this,
                navbar,
                originalNavbarRender;
            this.callBase(options);
            this._app = options.app;

            navbar = this.$navbar.dxNavBar("instance");

            navbar.option("onContentReady", $.proxy(that._initVirtualToolbar, that));
            $(".xet-designer-main-slideoutview").dxSlideOutView("instance").option("width", "");

            options.app.on("viewRendered", function (e) {
                e.viewInfo.renderResult.$markup.find("iframe").each(function (index, frame) {
                    $(frame).load(function (e) {
                        $(frame.contentWindow).on("click", $.proxy(that._frameClickHandler, that));
                    });
                });
            });
            options.app.on("viewDisposing", function (e) {
                if (e.viewInfo.renderResult) {
                    e.viewInfo.renderResult.$markup.find("iframe").each(function (index, frame) {
                        $(frame.contentWindow).off("click", $.proxy(that._frameClickHandler, that));
                    });
                }
            });
            options.app.on("navigating", function (e) {
                var navigationOptions = that._app.router.parse.call(that._app.router, e.uri),
                    tabToHighlight = undefined;
                that.currentNavigationConfig = navigationOptions;
                $.each(navbar.option("items"), function (index, item) {
                    if (navigationOptions.view === item.baseView) {
                        that.lastNavigatedConfigs[item.baseView] = navigationOptions;
                        tabToHighlight = item;
                        return false;
                    }
                });
                navbar.option("selectedItem", tabToHighlight);
                that._synchronizeListViewSelection();
            });
            options.app.on("viewShown", function (e) {
                that._updateDoc();
            });

            originalNavbarRender = $.proxy(navbar._render, navbar);
            navbar._render = function () {
                originalNavbarRender();
                that._initDropDownLists.call(that);
            }
        },
        _frameClickHandler: function () {
            this.dropDowns.forEach(function (dropDown) {
                dropDown.popup.hide();
            });
        },
        getUrlParameter: function (name) {
            var parameter = RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
            return parameter && decodeURIComponent(parameter[1].replace(/\+/g, " "));
        },
        toggleMenu: function (e) {
            this.menuVisible(!this.menuVisible());
            e.jQueryEvent.stopPropagation();
        },
        _listViewSourceRemoving: function (dropDown, key) {
            var lastConfig = this.lastNavigatedConfigs[dropDown.baseView];
            if (lastConfig && lastConfig.parameters[dropDown.baseViewKey] === key) {
                this.lastNavigatedConfigs[dropDown.baseView] = undefined;
            }
        },
        _initDropDownLists: function () {
            var that = this;
            this.dropDowns = [];
            this.$navbar.find(".drop-down-icon").each(function () {
                var data = ko.dataFor(this),
                    viewTemplate = that._app.getViewTemplate.call(that._app, data.listView).clone(),
                    popupElement = $(this).next(),
                    popupContentElement = popupElement.find(".dx-popup-content"),
                    popup = popupElement.dxPopover("instance"),
                    viewInfo = that._app._acquireViewInfo({ key: data.listView, uri: data.listView }, { direction: "none", target: "blank" }),
                    viewModel = that._app._callViewCodeBehind.call(that._app, viewInfo),
                    dropDown = {
                        baseView: data.baseView,
                        baseViewKey: data.baseViewKey,
                        listView: data.listView,
                        listViewSource: undefined,
                        popup: popup
                    },
                    listViewSourceRemovingHandler = function (key) {
                        that._listViewSourceRemoving(dropDown, key);
                    };

                popupContentElement.addClass("drop-down-menu-content");

                popup.option("height", "100%");
                popup.option("onShowing", function (e) {
                    viewModel.viewShowing({});
                    viewModel.viewShown();
                    var wasOnceHovered = false;
                    var loadingInterval = setInterval(function () {
                        var topHoverElement = $(":hover").last();
                        if (!$(topHoverElement).hasClass("dx-overlay-wrapper")) {
                            var isPopupHover = $(popupContentElement).find(topHoverElement).length !== 0;
                            if (isPopupHover) {
                                wasOnceHovered = true;
                            }
                            if (!isPopupHover && wasOnceHovered) {
                                popup.hide();
                                clearInterval(loadingInterval);
                            }
                        }
                    }, 1000);
                });
                popup.option("onHiding", viewModel.viewHidden);
                popup.option("animation", {
                    show: { type: "pop", from: { opacity: 1, scale: 0 }, to: { scale: 1 } },
                    hide: { type: "pop", from: { scale: 1 }, to: { scale: 0 } }
                });

                that.dropDowns.push(dropDown);

                popupContentElement[0].appendChild(viewTemplate[0]);
                viewModel.onViewRendered = function () {
                    dropDown.listViewSource = viewModel[data.listViewSource];
                    dropDown.listViewSource.store()
                        .off("removing", listViewSourceRemovingHandler)
                        .on("removing", listViewSourceRemovingHandler);
                    dropDown.list = popupContentElement.find(".dx-list").dxList("instance");
                    dropDown.list.option("onContentReady", $.proxy(that._synchronizeListViewSelection, that));
                    dropDown.list.option("onSelectionChanged", $.proxy(that._disableListViewUnselection, that));
                };
                ko.applyBindings(viewModel, popupContentElement[0]);
            });
        },
        _disableListViewUnselection: function (e) {
            if (!e.addedItems.length && e.removedItems.length) {
                this._synchronizeListViewSelection()
            }
        },
        _synchronizeListViewSelection: function () {
            var that = this;
            this.dropDowns.forEach(function (dropDown) {
                var currentSelection,
                    targetView,
                    targetItem,
                    keyProperty;
                if (dropDown.list && dropDown.list.option("items").length) {
                    if (that.currentNavigationConfig.view === dropDown.baseView) {
                        targetView = that.currentNavigationConfig.parameters[dropDown.baseViewKey];
                        keyProperty = dropDown.list.option("dataSource").key();
                        targetItem = dropDown.list.option("items").filter(function (item) {
                            return item[keyProperty] === targetView;
                        })[0];
                        currentSelection = dropDown.list.option("selectedItems")[0];
                        if (!dropDown.list.option("selectedItems").length || targetItem !== currentSelection) {
                            dropDown.list.option("selectedItems", [targetItem]);
                        }
                    } else if (dropDown.list.option("selectedItems").length) {
                        dropDown.list.option("selectedItems", []);
                    }
                }
            });
        },
        _clearNavigationWidget: function () {
            var basicItems = [
                { location: "before", template: "button", onExecute: $.proxy(this.toggleMenu, this), button: { icon: "menu" } },
                { location: "before", template: "logo", onExecute: $.proxy(this.navigateToRoot, this) }
            ];
            basicItems.forEach(function (item) {
                item.command = new DevExpress.framework.dxCommand(item);
            });
            this.callBase();
            this._$navigationWidget.dxNavBar("instance").option("items", basicItems);
        },
        _initVirtualToolbar: function () {
            this._$mainLayout.find(".navbar-container .virtual-toolbar-content")
                .off("click", this._fadeOutFadeIn)
                .on("click", this._fadeOutFadeIn);
            this.$navbar.find(".virtual-toolbar-content").closest(".dx-tab").addClass("virtual-toolbar");
        },
        _fadeOutFadeIn: function () {
            var fadeOut = DevExpress.fx.animate(this, { type: "fadeOut", duration: 600 }),
                fadeIn = DevExpress.fx.animate(this, { type: "fadeIn", duration: 600 });
            this.animating = this.animating || $.Deferred().resolve();
            this.animating = $.when(this.animating).then(fadeOut).then(fadeIn);
        },
        _renderCommandsToGlobalToolbar: function ($element, commands, commandManager) {
            var toolbar, toolbarItems, newItems;
            if ($element.length > 0 && commands) {
                toolbar = $element.data().dxToolbar ? $element.dxToolbar("instance") : $element.dxNavBar("instance"),
                toolbarItems = toolbar.option("items"),
                newItems = $.map(toolbarItems, function (item) {
                    return item.command ? undefined : item;
                });
                toolbar.option("items", newItems);
                commandManager.renderCommandsToContainers(commands, [$element.dxCommandContainer("instance")]);
            }
        },
        _showViewImpl: function (viewInfo, direction) {
            this._renderCommandsToGlobalToolbar(this._$mainLayout.find(".header-toolbar"), viewInfo.commands, this._commandManager);
            this._renderCommandsToGlobalToolbar(this._$mainLayout.find(".menu-toolbar"), viewInfo.commands, this._commandManager);
            return this.callBase(viewInfo, direction);
        },
        _updateLayoutTitle: function (viewInfo, defaultTitle) {
            if (!this._global() && viewInfo.model && viewInfo.model._global) {
                this._global(viewInfo.model._global);
            }
            if (!this._functions() && viewInfo.model && viewInfo.model._functions) {
                this._functions(viewInfo.model._functions);
            }
        },
        navigateToRoot: function (e) {
            e.jQueryEvent.stopPropagation();
            this._app.navigate("/");
            this.$navbar.dxNavBar("instance").option("selectedItem", undefined);
        },
        _createLayoutModel: function () {
            var that = this,
                viewModel = {
                    menuVisible: that.menuVisible,
                    currentProjectUrl: that.currentProjectUrl,
                    title: ko.computed(function () {
                        var _global = that._global();
                        return _global && _global.title || "Xenarius Designer";
                    }),
                    jsonUrl: ko.computed(function () {
                        var _global = that._global();
                        return _global && _global.json;
                    }),
                    navigateToView: function(viewId) {
                        that._app.navigate(viewId);
                    },
                    navigateToBaseView: function (e) {
                        if (that.lastNavigatedConfigs[e.model.baseView]) {
                            that._app.navigate(that.lastNavigatedConfigs[e.model.baseView]);
                        } else {
                            viewModel.navigateToListView(e);
                        }
                    },
                    navigateToListView: function (e) {
                        var $element = $(e.element);
                        that._fadeOutFadeIn.call($element.hasClass("drop-down-icon") ? $element : $element.find(".tab-caption"));
                        $.each(that.dropDowns, function (index, mapping) {
                            if (mapping.listView === e.model.listView) {
                                mapping.popup.show();
                                return false;
                            }
                        });
                    },
                    navigationDataSource: ko.computed(function () {
                        var _global = that._global();
                        return _global && _global.navigationDataSource || {};
                    }),
                    openDesigner: function (e) {
                        var url = "/?json=" + e.itemData.JsonUrl;
                        window.open(url, "_self");
                    },
                    importOData: function (e) {
                        var functions = that._functions();
                        functions.navigateToView("ODataImport", {});
                    },
                    createProject: function (e) {
                        var global = that._global();
                        AppPlayer.showActionPopover(
                            e.element,
                            [
                                {
                                    text: "Demo Project",
                                    onClick: function () {
                                        global.createProject({ template: "standard" })
                                            .done(function (project) {
                                                var url = "/?json=" + project.JsonUrl;
                                                window.open(url, "_self");
                                            });
                                    }
                                },
                                {
                                    text: "Empty Project",
                                    onClick: function () {
                                        global.createProject({ template: "empty" })
                                            .done(function (project) {
                                                var url = "/?json=" + project.JsonUrl;
                                                window.open(url, "_self");
                                            });
                                    }
                                }
                                //{
                                //    text: 'Generate from OData Service',
                                //    onClick: function () {
                                //        that.generateODataAppDialogVisible(true);
                                //    }
                                //}
                            ], true);
                    },
                    importProject: function () {
                        var global = that._global();

                        allowedExts = [".xapp"], // [".xapp", ".json"]
                        allowedExtsString = allowedExts.join(",");

                        var $fileInput = $("<input type=\"file\" accept=\"" + allowedExtsString + "\" />");
                        $fileInput.change(function () {
                            var file = this.files[0];
                            if (allowedExts.some(function (ext) { return AppPlayer.endsWith(file.name, ext); })) {
                                var reader = new FileReader();
                                reader.onloadend = function () {
                                    AppDesigner.utils.importAndOpen(global, reader.result);
                                };
                                reader.onerror = function (error) {
                                    DevExpress.ui.dialog.alert("There was an error when opening the file selected.", "Unknown Error");
                                };
                                reader.readAsText(file);
                            } else {
                                DevExpress.ui.dialog.alert("Invalid file extension.", "Project Import");
                            }
                        });
                        $fileInput.click();
                    },
                    exportProject: function (project, e) {
                        e.stopPropagation();
                        var url = "/" + project.JsonUrl + "/Export";
                        window.open(url, "_self");
                    },
                    deleteProject: function (project, e) {
                        e.stopPropagation();
                        var global = that._global(),
                            functions = that._functions();
                        DX.ui.dialog.confirm("Are you sure you want to delete current project?", "Delete Project")
                            .then(function (dialogResult) {
                                if (dialogResult) {
                                    global.deleteProject({ jsonUrl: project.JsonUrl })
                                        .then(function (success) {
                                            if (success) {
                                                functions.navigateToView("projectsLoading", {}, false);
                                            } else {
                                                DX.ui.dialog.alert("There was an error processing your request. Please try again, or contact our support team.", "Unknown Error");
                                            }
                                        });
                                }
                            });
                    },
                    generateAppFromODataServiceViewModel: function () {
                        var functions = that._functions();
                        return functions.createAppFromODataViewModel(functions);
                    },
                    doc: that._doc,
                    supportCenterState: that._supportCenterState,
                    toggleSupportCenter: function () {
                        if (that._supportCenterState() !== "opened") {
                            that._supportCenterState("opened");
                        } else {
                            that._supportCenterState("closed");
                        }
                    }
                };

            return viewModel;
        },
        _doc: ko.observable(),
        _supportCenterState: ko.observable("closed"),
        _updateDoc: function () {
            var that = this,
                doc = that._doc,
                hash = location.hash,
                link = null,
                title = null;
            if (AppPlayer.startsWith(hash, "#functionEditor")) {
                link = "/docs/functions.html";
                title = "Functions";
            } else if (AppPlayer.startsWith(hash, "#dataStoreConfig")) {
                link = "/docs/connect-to-data.html";
                title = "How to Connect to Data";
            } else if (AppPlayer.startsWith(hash, "#view")) {
                link = "/docs/creating-application-views.html";
                title = "How to Create an Application View";
            } else if (AppPlayer.startsWith(hash, "#applicationEditor")) {
                link = "/docs/configure-navigation-and-device-specific-layout.html";
                title = "How to Configure Navigation and Device-Specific App Layout";
            } else if (AppPlayer.startsWith(hash, "#start")) {
                var scShown = localStorage.getItem("support-center-shown");
                if (!scShown) {
                    that._supportCenterState("opened");
                    localStorage.setItem("support-center-shown", true);
                }
            }
            if (link) {
                doc({
                    link: "https://xenarius.net" + link,
                    title: title
                });
            } else {
                doc(null);
            }
        },
        setViewLoadingState: function (viewInfo, direction) {
            this._updateLayoutTitle(viewInfo, this.DEFAULT_LOADING_TITLE);
            return this.callBase(viewInfo, direction);
        },
        showView: function (viewInfo, direction) {
            var that = this;
            that._updateLayoutTitle(viewInfo);
            return that.callBase(viewInfo, direction).done(function () {
                if (that.toolbarController) {
                    that.toolbarController.showViews(that._activeViews);
                }
            })
        }
    });
    DX.framework.html.DesignerController.navigationDisabled = ko.observable(false);
    DX.framework.html.DesignerController.disableNavigation = function () { DX.framework.html.DesignerController.navigationDisabled(true); };
    DX.framework.html.DesignerController.enableNavigation = function () { DX.framework.html.DesignerController.navigationDisabled(false); };
})(jQuery, DevExpress);