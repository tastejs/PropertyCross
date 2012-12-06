//<debug>
Ext.Loader.setPath({
    'Ext': 'sdk/src'
});
//</debug>

Ext.Loader.setConfig({disableCaching: false});

Ext.application({
    name: 'PropertyFinder',

    phoneStartupScreen: 'resources/loading/SplashScreenImage.png',
    tabletStartupScreen: 'resources/loading/SplashScreenImage.png',

    glossOnIcon: false,
    icon: 'resources/icons/ApplicationIcon.png',

    requires: ['Ext.data.Store', 'Ext.dataview.List'],
    models: ['Results', 'Search'],
    stores: ['Results', 'Favourites', 'Searches'],
    views: ['Main'],
    controllers: ['Application'],

    launch: function() {
        Ext.fly('appLoadingIndicator').destroy();
    
        Ext.Viewport.add({
            xclass: 'PropertyFinder.view.Main'
        });
    }
});
