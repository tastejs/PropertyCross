
define(function(require, exports, module) {
    'use strict';
    var Surface        = require('famous/core/Surface');
    var View           = require('famous/core/View');
    var FlexibleLayout = require('famous/views/FlexibleLayout');

    function RecentSearchView() {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createHeading.call(this);
        _createRecentSearchList.call(this);
    }

    RecentSearchView.prototype = Object.create(View.prototype);
    RecentSearchView.prototype.constructor = RecentSearchView;

    RecentSearchView.DEFAULT_OPTIONS = {};

    function _createLayout() {
        var layout = new FlexibleLayout({
            direction: 1,
            ratios: [true, 1]
        });

        this.surfaces = [];

        layout.sequenceFrom(this.surfaces);

        this.add(layout);
    }

    function _createHeading() {
        var heading = new Surface({
            size: [undefined, 20],
            content: 'Recent Searches',
            properties: {
                fontSize: '16px',
                lineHeight: '20px'
            }
        });

        this.surfaces.push(heading);
    }

    function _createRecentSearchList() {
        var heading = new Surface({
            content: 'Result List',
            properties: {
                backgroundColor: 'LightGrey',
                lineHeight: '200px',
                textAlign: 'center'
            }
        });

        this.surfaces.push(heading);
    }

    module.exports = RecentSearchView;
});
