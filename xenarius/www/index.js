(function () {
    function bindEvents() {
        var devicePromise = $.Deferred(), documentPromise = $.Deferred();
        if (window.cordova) {
            document.addEventListener('deviceready', function () {
                devicePromise.resolve();
            }, false);
        } else {
            devicePromise.resolve();
        }
        $(function () {
            documentPromise.resolve();
        });
        return $.when(devicePromise, documentPromise);
    }

    function hideSplash() {
        if (navigator.splashscreen) {
            navigator.splashscreen.hide();
        }
        $("#xet-load-indicator").hide();
    }

    function start(appConf, appUrl) {
        if (window.StatusBar) {
            StatusBar.overlaysWebView(false);
        }

        var a = document.createElement('a');
        a.href = appUrl;

        var applicationOptions = {
            baseUrl: (a.protocol ? a.protocol + "//" : "") + a.host
        };

        var application = new AppPlayer.Application(appConf, applicationOptions);

        application.started.add(hideSplash);
        application.run();

        window.app.instance = application;
    }

    function attachErrorHandler() {
        function handleError(message, url, line) {
            if (url && (url.indexOf("Scripts/") < 0 && url.indexOf("index.js") < 0)) {
                return;
            }
            try {
                hideSplash();
                var encodedMessage = $('<div/>').text(message).html();
                $(window.document.body).append(
                    "<div style='z-index: 2000; top:100px; left: 0; \
                            position: fixed; display: block;\
                            width: 100%; overflow: auto;'>\
                    <div style='background: red; text-align: left; color: white;\
                            white-space: pre-wrap; \
                            border-radius: 5px;\
                            margin: 0 10px; padding: 10px;\
                            -webkit-user-select: text;\
                            -moz-user-select: text;\
                            -ms-user-select: text;\
                            -o-user-select: text;\
                            user-select: text;\
                            word-break: normal; white-space: pre-wrap'>" +
                            "Error: '" + encodedMessage + "', line " + line + ", file '" + url + "'." +
                        "</div>\
          </div>");
            } catch (e) { }
        }

        window.onerror = handleError;

        var console = window.console;
        if (console) {
            function intercept(method) {
                var original = console[method];
                console[method] = function (message, url, line) {
                    handleError(message, url, line);
                    original.call(console, Array.prototype.slice.apply(arguments).join(' '));
                }
            }

            intercept('error');
        }
    }

    attachErrorHandler();

    function initialize(appUrl) {
        //TODO remove use application._loadFile instead
        var promises = $("script[type='text/html']")
            .toArray()
            .map(function (script) {
                if (script["src"]) {
                    var deffered = $.Deferred();
                    $.get(script["src"], function (tmpl) {
                        script["text"] = tmpl;
                        if (tmpl.indexOf('type="text/html"') !== -1) {
                            $(document.body).append(tmpl);
                        }
                        deffered.resolve();
                    })
                    return deffered.promise();
                }
            });

        var eventsPromise = bindEvents();
        promises.push(eventsPromise);
        if (AppPlayer.getQueryVariable("app")) {
            appUrl = AppPlayer.getQueryVariable("app");
        }
        var handleJsonLoaded = function (appConf) {
            $.when.apply($, promises)
                .then(function () {
                    start(appConf, appUrl);
                }, function (error) {
                    handleError(error);
                    debugger;
                });
        };

        $.getJSON(appUrl)
            .then(
                handleJsonLoaded,
                function () {
                    appUrl = "/app-conf.xapp";
                    $.getJSON(appUrl)
                        .then(
                            handleJsonLoaded,
                            function (error) {
                                appUrl = "app-conf.json";
                                $.getJSON(appUrl)
                                    .then(
                                        handleJsonLoaded,
                                        function (error) {
                                            handleError(error);
                                            debugger;
                                        });
                            });
                });
    }

    window.app = {
        initialize: initialize
    };
})();