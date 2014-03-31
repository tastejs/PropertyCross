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

        navigationBar: {

            items: [
                {
                    xtype: 'button',
                    id: 'listFavesButton',
                    text: 'Faves',
                    align: 'right',
                    showAnimation: Ext.os.is.Android ? false : {
                        type: 'fadeIn',
                        duration: 200
                    }
                },
                {
                    xtype: 'button',
                    id: 'faveButton',
                    align: 'right',
                    hidden: true,
                    // Icon's don't work on WP8 app
                    text: Ext.browser.is.IE ? 'Favourite' : undefined,
                    iconCls: Ext.browser.is.IE ? undefined : 'star',
                    iconMask: Ext.browser.is.IE ? undefined : true,
                    showAnimation: Ext.os.is.Android ? false : {
                        type: 'fadeIn',
                        duration: 200
                    }
                }
            ]
        },

        items: [
            { xtype: 'home' }
        ]
    }
});
