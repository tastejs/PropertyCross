window.PropertyFinder = window.PropertyFinder || {};

$(function() {
    // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
    // DevExpress.devices.current({ platform: "generic" });
    // To customize the Generic theme, use the DevExtreme Theme Builder (http://js.devexpress.com/ThemeBuilder)
    // For details on how to use themes and the Theme Builder, refer to the http://js.devexpress.com/Documentation/Howto/Themes article

    $(document).on("deviceready", function () {
        navigator.splashscreen.hide();
        if(window.devextremeaddon) {
            window.devextremeaddon.setup();
        }
        $(document).on("backbutton", function () {
            DevExpress.processHardwareBackButton();
        });
    });

    function onNavigatingBack(e) {
        if (e.isHardwareButton && !PropertyFinder.app.canBack()) {
            e.cancel = true;
            exitApp();
        }
    }

    function exitApp() {
        switch (DevExpress.devices.real().platform) {
            case "android":
                navigator.app.exitApp();
                break;
            case "win8":
                window.external.Notify("DevExpress.ExitApp");
                break;
        }
    }


    PropertyFinder.app = new DevExpress.framework.html.HtmlApplication({
        namespace: PropertyFinder,
        layoutSet: DevExpress.framework.html.layoutSets[PropertyFinder.config.layoutSet],
        navigation: PropertyFinder.config.navigation,
        commandMapping: PropertyFinder.config.commandMapping
    });
    PropertyFinder.app.router.register(":view/:id", { view: "home", id: undefined });
    PropertyFinder.app.on("navigatingBack", onNavigatingBack);
    PropertyFinder.app.navigate();
});
