// Provide cross-platform API for Android and other OS-es
if (!OS_IOS) {

    var NavigationWindow = function(args) {
        this.args = args;
    };

    // Opens root window
    NavigationWindow.prototype.open = function(params) {
        params = params || {};
        params.displayHomeAsUp = false;
        return this.openWindow(this.args.window, params);
    };

    // Closes root window
    NavigationWindow.prototype.close = function(params) {
        return this.closeWindow(this.args.window, params);
    };

    // Adds and opens new window to the stack
    NavigationWindow.prototype.openWindow = function(window, options) {
        var that = this;

        options = options || {};
        options.swipeBack = (typeof options.swipeBack === 'boolean') ? options.swipeBack : that.args.swipeBack;
        options.displayHomeAsUp = (typeof options.displayHomeAsUp === 'boolean') ? options.displayHomeAsUp : that.args.displayHomeAsUp;

        // Android: Animate window in from sides, like iOS
        if (OS_ANDROID && options.animated !== false) {
            options.activityEnterAnimation = Ti.Android.R.anim.slide_in_left;
            options.activityExitAnimation = Ti.Android.R.anim.slide_out_right;
        }

        // Close window by swiping, like iOS
        if (options.swipeBack !== false) {
            window.addEventListener('swipe', function(e) {
                if (e.direction === 'right') {
                    that.closeWindow(window, options);
                }
            });
        }

        // Android: Enable displayHomeAsUp and close window when onHomeIconItemSeleced
        if (OS_ANDROID && options.displayHomeAsUp !== false && !window.navBarHidden) {
            window.addEventListener('open', function() {
                var activity = window.getActivity();
                if (activity) {
                    var actionBar = activity.actionBar;
                    if (actionBar) {
                        actionBar.displayHomeAsUp = true;
                        actionBar.onHomeIconItemSelected = function() {
                            that.closeWindow(window, options);
                        };
                    }
                }
            });
        }

        // Finally open the window, covering the previous
        return window.open(options);
    };

    // Removes and closes a window from the stack
    NavigationWindow.prototype.closeWindow = function(window, options) {
        options = options || {};

        // Android: Animate window out to sides, like iOS
        if (OS_ANDROID && options.animated !== false) {
            options.activityEnterAnimation = Ti.Android.R.anim.slide_in_left;
            options.activityExitAnimation = Ti.Android.R.anim.slide_out_right;
        }

        return window.close(options);
    };
}

exports.createNavigationWindow = function(args) {

    // iOS: Create NavigationWindow
    // Android: Create cross-platform API to stack windows
    var navWin = OS_IOS ? Ti.UI.iOS.createNavigationWindow(args) : new NavigationWindow(args);
    
    // Create a global reference using passed id
    if (args && args.id) {
        Alloy.Globals[args.id] = navWin;
    }

    return navWin;
};