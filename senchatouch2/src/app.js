/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

Ext.application({
    name: 'PropertyCross',

    requires: [
        'Ext.MessageBox'
    ],

    views: [
        'Main'
    ],

    controllers: [
        'Application'
    ],
	
	stores: ['Favourites', 'Results', 'Searches'],

    icon: {
        '57': 'assets/icons/icon-57.png',
        '72': 'assets/icons/icon-72.png',
        '114': 'assets/icons/icon-57-2x.png',
        '144': 'assets/icons/icon-72-2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'assets/splashscreens/320x460.jpg',
        '768x1004': 'assets/splashscreens/768x1004.png'
    },

    launch: function() {
        if (navigator.splashscreen) {
          navigator.splashscreen.hide();
        }
        // Destroy the #appLoadingIndicator element
        //Ext.fly('appLoadingIndicator').destroy();

        // Initialize the main view
        Ext.Viewport.add(Ext.create('PropertyCross.view.Main'));
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
