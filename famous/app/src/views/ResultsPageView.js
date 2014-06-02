
define(function(require, exports, module) {
    'use strict';
    var RenderNode = require('famous/core/RenderNode');
    var Surface    = require('famous/core/Surface');
    var View       = require('famous/core/View');

    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var ScrollView     = require('famous/views/ScrollView');

    var PropertyView = require('views/PropertyView');

    function ResultsPageView() {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createList.call(this);
    }

    ResultsPageView.prototype = Object.create(View.prototype);
    ResultsPageView.prototype.constructor = ResultsPageView;

    ResultsPageView.DEFAULT_OPTIONS = {
        size: [undefined, 40]
    };

    function _createLayout() {
        var layout = new FlexibleLayout({
            direction: 1,
            ratios: [1]
        });

        this.surfaces = [];

        layout.sequenceFrom(this.surfaces);

        this.add(layout);
    }

    function _createList() {
        var renderNode = new RenderNode();
        var scrollview = new ScrollView();

        var items = [];

        scrollview.sequenceFrom(items);

        for (var i = 0; i < 100; i++) {
            var property = new PropertyView({
                size: [undefined, 80]
            });

            property.pipe(scrollview);

            items.push(property);
        }

        renderNode.add(scrollview);

        this.surfaces.push(renderNode);
    }

    module.exports = ResultsPageView;
});
