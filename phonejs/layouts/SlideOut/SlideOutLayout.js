﻿(function($, DX, undefined) {

    var translator = DX.translator,
        fx = DX.fx,
        VIEW_OFFSET = 40,
        NAVIGATION_MAX_WIDTH = 300,
        NAVIGATION_TOGGLE_DURATION = 400;

    DX.framework.html.SlideOutController = DX.framework.html.DefaultLayoutController.inherit({

        init: function(options) {
            this.callBase(options);
            this._navigatingHandler = $.proxy(this._onNavigating, this);
        },

        activate: function() {
            this._navigationManager.navigating.add(this._navigatingHandler);
        },

        deactivate: function() {
            this._navigationManager.navigating.remove(this._navigatingHandler);
        },

        _onNavigating: function(args) {
            var self = this;
            if(this._isNavigationVisible) {
                args.cancel = true;
                this._toggleNavigation(this.$viewPort.children()).done(function() {
                    self._disableTransitions = true;
                    self._navigationManager.navigate(args.uri, args.options);
                });
            }
        },

        _isPlaceholderEmpty: function(viewInfo) {
            var $markup = viewInfo.renderResult.$markup;
            var toolbar = $markup.find(".layout-toolbar").data("dxToolbar");
            var items = toolbar.option("items");
            var backCommands = $.grep(items, function(item) {
                //TODO behavior is deprecated
                return item.behavior === "back" || item.id === "back";
            });
            return !backCommands.length;
        },

        _showViewImpl: function(viewInfo, direction) {
            var self = this;
            self._initNavigation(viewInfo.renderResult.$markup);
            var promise = self.callBase(viewInfo, direction);
            promise.done(function() {
                self._disableTransitions = false;
            });
            return promise;
        },

        _onRenderComplete: function(viewInfo) {
            var self = this;

            if(self._isPlaceholderEmpty(viewInfo)) {
                self._initNavigationButton(viewInfo.renderResult.$markup);
            }

            var $toolbarBottom = viewInfo.renderResult.$markup.find(".layout-toolbar-bottom, .view-toolbar-bottom"),
                toolbarBottom = $toolbarBottom.data("dxToolbar");

            if(toolbarBottom && toolbarBottom.option("items").length) {
                viewInfo.renderResult.$markup.find(".layout-content").addClass("has-toolbar-bottom");
            }

            this.callBase(viewInfo);
        },

        _initNavigationButton: function($markup) {
            var self = this,
                toolbar = $markup.find(".layout-toolbar").data("dxToolbar");

            toolbar.option("itemRenderedAction", function(e) {
                var data = e.itemData,
                    $element = e.itemElement;

                if(data.template === "nav-button") {
                    $element.show();
                    $element.find(".nav-button")
                        .data("dxButton")
                        .option("clickAction", $.proxy(self._toggleNavigation, self, $markup));
                }
            });
        },

        _initNavigation: function($markup) {
            this._isNavigationVisible = false; 
            this._initSwipeable($markup);
            this._getNavigation($markup).width(this._getNavigationWidth());
            this._initToolbar($markup);
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
        },

        _initSwipeable: function($markup) {
            var self = this;
            var $layoutFrame = this._getLayoutFrame($markup);

            if(!$layoutFrame.data("dxSwipeable")) {
                var navigationWidth = self._getNavigationWidth();

                $layoutFrame.dxSwipeable({
                    elastic: false,
                    startAction: function(e) {
                        e.maxLeftOffset = self._isNavigationVisible ? 1 : 0;
                        e.maxRightOffset = self._isNavigationVisible ? 0 : 1;

                    },
                    updateAction: function(e) {
                        translator.move($layoutFrame, { left: (e.offset + self._isNavigationVisible) * navigationWidth });
                    },
                    endAction: function(e) {
                        fx.animate($layoutFrame, {
                            type: "slide",
                            to: { left: (e.targetOffset + self._isNavigationVisible) * navigationWidth },
                            complete: function() {
                                self._isNavigationVisible = e.targetOffset > 0;
                            }
                        });
                    }
                });
            }
        },

        _getNavigation: function($markup) {
            return $markup.find(".navigation-list");
        },

        _getLayoutFrame: function($markup) {
            return $markup.find(".layout-frame");
        },

        _getNavigationWidth: function() {
            var width = this.$viewPort.width() - VIEW_OFFSET;
            return width > NAVIGATION_MAX_WIDTH
                ? NAVIGATION_MAX_WIDTH
                : width;
        },

        _toggleNavigation: function($markup) {
            var $layoutFrame = this._getLayoutFrame($markup);

            var promise = DX.fx.animate($layoutFrame, {
                type: "slide",
                to: { left: this._isNavigationVisible ? 0 : this._getNavigationWidth() },
                duration: NAVIGATION_TOGGLE_DURATION
            });
            this._isNavigationVisible = !this._isNavigationVisible;

            return promise;
        }

    });

    DX.framework.html.layoutControllers.slideout = new DX.framework.html.SlideOutController();

})(jQuery, DevExpress);