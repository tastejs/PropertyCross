
define(function(require, exports, module) {
    'use strict';
    var Engine  = require('famous/core/Engine');
    var AppView = require('views/AppView');
    var Timer   = require('famous/utilities/Timer');

    var mainContext = Engine.createContext();

    var appView = new AppView({
        initialPage: 'favourites'
    });

    mainContext.add(appView);
    
    //_demoPages(1);

    function _demoPages(duration) {
        var index = 0;
        var pages = [
            'favourites',
            'listing',
            'results',
            'search'
        ];
        Timer.setInterval(function() {
            index = (index + 1) % pages.length;
            appView.navigateTo(pages[index]);
        }, duration * 1000);
    }
});
