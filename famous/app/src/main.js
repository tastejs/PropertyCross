
define(function(require, exports, module) {
    'use strict';
    var Engine  = require('famous/core/Engine');
    var Timer   = require('famous/utilities/Timer');

    var ApplicationStateViewModel = require('viewmodels/ApplicationState');
    var ApplicationStateView      = require('views/ApplicationState');

    var mainContext = Engine.createContext();

    var model = new ApplicationStateViewModel();

    model.defineState({
        name: 'search',
        model: require('viewmodels/Search'),
        view: require('views/Search')
    }).defineState({
        name: 'listing',
        model: require('viewmodels/Listing'),
        view: require('views/Listing')
    }).defineState({
        name: 'results',
        model: require('viewmodels/Results'),
        view: require('views/Results')
    }).defineState({
        name: 'favourites',
        model: require('viewmodels/Favourites'),
        view: require('views/Favourites')
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
