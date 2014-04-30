/**
 * @private
 */
Ext.define('Ext.device.browser.Abstract', {
    /**
     * Used to open a new browser window.
     *
     * When used with Cordova, a new InAppBrowser window opens. With Cordova, you also have the ability
     * to listen when the window starts loading, is finished loading, fails to load, and when it is closed.
     * You can also use the {@link #close} method to close the window, if opened.
     * 
     * @param {Object} options
     * The options to use when opening a new browser window.
     *
     * @param {String} options.url
     * The URL to open.
     *
     * @param {Object} options.listeners
     * The listeners you want to add onto the window. Available events are:
     *
     * - `loadstart` - when the window starts loading the URL
     * - `loadstop` - when the window is finished loading the URL
     * - `loaderror` - when the window encounters an error loading the URL
     * - `close` - when the window is closed
     *
     * @param {Boolean} options.showToolbar
     * True to show the toolbar in the browser window.
     *
     * @param {String} options.options
     * A string of options which are used when using Cordova. For a full list of options, visit the 
     * [PhoneGap documention](http://docs.phonegap.com/en/2.6.0/cordova_inappbrowser_inappbrowser.md.html#window.open).
     */
    open: Ext.emptyFn,

    /**
     * Used to close the browser, if one is opened.
     */
    close: Ext.emptyFn
});
