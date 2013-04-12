Ext.define('PropertyFinder.view.Main', {
    extend: 'Ext.navigation.View',
    xtype: 'mainview',

    requires: [
		'PropertyFinder.view.Home',
        'PropertyFinder.view.ResultList',
        'PropertyFinder.view.ResultDetails',
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
					iconCls: 'star',
					iconMask: true,
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
