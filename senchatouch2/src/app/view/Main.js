Ext.define('PropertyCross.view.Main', {
    extend: 'Ext.navigation.View',
    xtype: 'mainview',

    requires: [
		'PropertyCross.view.Home',
        'PropertyCross.view.ResultList',
        'PropertyCross.view.ResultDetails',
		'Ext.data.proxy.JsonP'
    ],

    config: {
        autoDestroy: false,

        navigationBar: {},

        items: [
            { xtype: 'home' }
        ]
    },
    initialize: function() {
        this.callParent(arguments);
        var isWindowsPhone = Ext.browser.is.IE;


        var navSettings = { alignment: 'right', listFaves: { iconCls: 'favourite' } };

        navSettings = isWindowsPhone ? { buttonUi: 'round', listFaves: { text: 'favourites' } } : navSettings;

        navSettings.animation = Ext.os.is.Android ? false : {
            type: 'fadeIn',
            duration: 200
        };

        var navItems = [
            {
                xtype: 'button',
                id: 'listFavesButton',
                iconCls: navSettings.listFaves.iconCls,
                text: navSettings.listFaves.text,
                align: navSettings.alignment,
                showAnimation: navSettings.animation,
                ui: navSettings.buttonUi
            },
            {
                xtype: 'button',
                id: 'faveButton',
                align: navSettings.alignment,
                hidden: true,
                showAnimation: navSettings.animation,
                ui: navSettings.buttonUi
            }
        ];

        if(Ext.browser.is.IE) {
            this.add({
                docked: 'bottom',
                xtype: 'toolbar',
                layout: { pack: 'center' },
                items: navItems
            });
        } else {
            this.getNavigationBar().add(navItems);

        }
    }
});
