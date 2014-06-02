
define(function(require, exports, module) {
    'use strict';
    var Transform = require('famous/core/Transform');
    var View      = require('famous/core/View');

    var HeaderFooter = require('famous/views/HeaderFooterLayout');
    var Lightbox     = require('famous/views/Lightbox');

    var FavouritesPageView = require('views/FavouritesPageView');
    var FooterView         = require('views/FooterView');
    var HeaderView         = require('views/HeaderView');
    var ListingPageView    = require('views/ListingPageView');
    var ResultsPageView    = require('views/ResultsPageView');
    var SearchPageView     = require('views/SearchPageView');

    function AppView() {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createLightbox.call(this);
        _createPages.call(this);

        _createHeader.call(this);
        //_createFooter.call(this);

        if (this.options.initialPage) {
            var initialPage = this.pages[this.options.initialPage];
            this.lightbox.show(initialPage, { duration : 0 });
        }

    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        headerSize: 40,
        //footerSize: 40,
        initialPage: 'search',
        lightboxOpts: {
            inOpacity: 0.1,
            outOpacity: 0.1,
            inOrigin: [1, 0],
            outOrigin: [-1, 0],
            showOrigin: [0, 0],
            inTransform: Transform.translate(0, 0, 10),
            outTransform: Transform.translate(0, 0, -10),
            inTransition: { duration: 500, curve: 'easeOut' },
            outTransition: { duration: 500, curve: 'easeOut' },
            overlap: true
        }
    };

    AppView.prototype.navigateTo = function(pageName) {
        this.lightbox.show(this.pages[pageName]);
    };

    function _createLayout() {
        this.layout = new HeaderFooter({
            headerSize: this.options.headerSize,
            footerSize: this.options.footerSize
        });

        this.add(this.layout);
    }

    function _createHeader() {
        var view = new HeaderView({
            headerSize: this.options.headerSize
        });

        this.layout.header.add(view);
    }

    function _createFooter() {
        var view = new FooterView({
            footerSize: this.options.footerSize
        });

        this.layout.footer.add(view);
    }

    function _createLightbox() {
        this.lightbox = new Lightbox(this.options.lightboxOpts);

        this.layout.content.add(this.lightbox);
    }

    function _createPages() {
        this.pages = {
            favourites : new FavouritesPageView(),
            listing    : new ListingPageView(),
            results    : new ResultsPageView(),
            search     : new SearchPageView()
        };
    }

    module.exports = AppView;
});
