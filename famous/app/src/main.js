
define(function(require, exports, module) {
    'use strict';
    var Engine  = require('famous/core/Engine');
    var Timer   = require('famous/utilities/Timer');

    var ApplicationStateViewModel = require('viewmodels/ApplicationState');
    var ApplicationStateView      = require('views/ApplicationState');

    var mainContext = Engine.createContext();

    var model = new ApplicationStateViewModel();

    model.defineState('search', {
        url:       '/Search',
        view:      require('views/Search'),
        viewmodel: require('viewmodels/Search')
    }).defineState('listing', {
        url:       '/Listing/:guid',
        view:      require('views/Listing'),
        viewmodel: require('viewmodels/Listing')
    }).defineState('results', {
        url:       '/Results/:query',
        view:      require('views/Results'),
        viewmodel: require('viewmodels/Results')
    }).defineState('favourites', {
        url:       '/Favourites',
        view:      require('views/Favourites'),
        viewmodel: require('viewmodels/Favourites')
    });

    var view = new ApplicationStateView();
    view.bindToModel(model);

    mainContext.add(view);

    model.navigateToState('search');

    /*
    view.attachHeader(new HeaderView({
        headerSize: 40,
        backgroundColor: '#ff5722',
        color: 'white'
    }));
    */
});
