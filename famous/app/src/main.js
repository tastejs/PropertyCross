
define(function(require, exports, module) {
    'use strict';
    var Engine  = require('famous/core/Engine');
    var Timer   = require('famous/utilities/Timer');

    var ApplicationStateViewModel = require('viewmodels/ApplicationState');
    var ApplicationStateView      = require('views/ApplicationState');

    var UserNotifierViewModel = require('viewmodels/UserNotifier');
    var UserNotifierView      = require('views/UserNotifier');

    var mainContext = Engine.createContext();

    var notifier = new UserNotifierViewModel();
    var notifierView = new UserNotifierView();
    notifierView.bindToModel(notifier);

    var model = new ApplicationStateViewModel(notifier);

    model.defineState('search', {
        url:       '/Search',
        view:      require('views/Search'),
        viewmodel: require('viewmodels/Search')
    }).defineState('listing', {
        url:       '/Listing/:guid',
        view:      require('views/ListingDetails'),
        viewmodel: require('viewmodels/ListingDetails')
    }).defineState('results', {
        url:       '/Results/:query',
        view:      require('views/Results'),
        viewmodel: require('viewmodels/Results')
    }).defineState('favourites', {
        url:       '/Favourites',
        view:      require('views/Favourites'),
        viewmodel: require('viewmodels/Favourites')
    });

    var appView = new ApplicationStateView();
    appView.bindToModel(model);

    mainContext.add(appView);
    mainContext.add(notifierView);


    model.navigateToState('search');
});
