
define(function(require, exports, module) {
    'use strict';
    var View               = require('famous/core/View');
    var Surface            = require('famous/core/Surface');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');

    var PropertySearchView = require('views/PropertySearchView');

    function AppView() {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createContent.call(this);
        _createHeader.call(this);
        _createFooter.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        headerSize: 50,
        footerSize: 50
    };

    function _createLayout() {
        this.layout = new HeaderFooterLayout({
            headerSize: this.options.headerSize,
            footerSize: this.options.footerSize
        });

        this.add(this.layout);
    }

    function _createHeader() {
        var surface = new Surface({
            content: 'PropertyCross',
            properties: {
                backgroundColor: 'black',
                color: 'white',
                fontSize: '20px',
                lineHeight: this.options.headerSize + 'px',
                textAlign: 'center'
            }
        });

        this.layout.header.add(surface);
    }

    function _createFooter() {
        var surface = new Surface({
            properties: {
                backgroundColor: 'Grey'
            }
        });

        this.layout.footer.add(surface);
    }

    function _createContent() {
        var propertySearchView = new PropertySearchView({
            size: [200, 200]
        });

        this.layout.content.add(propertySearchView);
    }

    module.exports = AppView;
});
