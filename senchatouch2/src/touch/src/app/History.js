/**
 * @author Ed Spencer
 * @private
 *
 * Manages the stack of {@link Ext.app.Action} instances that have been decoded, pushes new urls into the browser's
 * location object and listens for changes in url, firing the {@link #change} event when a change is detected.
 *
 * This is tied to an {@link Ext.app.Application Application} instance. The Application performs all of the
 * interactions with the History object, no additional integration should be required.
 */
Ext.define('Ext.app.History', {
    mixins: ['Ext.mixin.Observable'],

    /**
     * @event change
     * Fires when a change in browser url is detected
     * @param {String} url The new url, after the hash (e.g. http://myapp.com/#someUrl returns 'someUrl')
     */

    config: {
        /**
         * @cfg {Array} actions The stack of {@link Ext.app.Action action} instances that have occurred so far
         */
        actions: [],

        /**
         * @cfg {Boolean} updateUrl `true` to automatically update the browser's url when {@link #add} is called.
         */
        updateUrl: true,

        /**
         * @cfg {String} token The current token as read from the browser's location object.
         */
        token: ''
    },

    constructor: function(config) {
        if (Ext.feature.has.History) {
            window.addEventListener('hashchange', Ext.bind(this.detectStateChange, this));
        }
        else {
            setInterval(Ext.bind(this.detectStateChange, this), 100);
        }

        this.initConfig(config);
        if (config && Ext.isEmpty(config.token)) {
            this.setToken(window.location.hash.substr(1));
        }
    },

    /**
     * Adds an {@link Ext.app.Action Action} to the stack, optionally updating the browser's url and firing the
     * {@link #change} event.
     * @param {Ext.app.Action} action The Action to add to the stack.
     * @param {Boolean} silent Cancels the firing of the {@link #change} event if `true`.
     */
    add: function(action, silent) {
        action = Ext.factory(action, Ext.app.Action);

        this.getActions().push(action);

        var url = action.getUrl();

        if (this.getUpdateUrl()) {
            // history.pushState({}, action.getTitle(), "#" + action.getUrl());
            this.setToken(url);
            window.location.hash = url;
        }

        if (silent !== true) {
            this.fireEvent('change', url);
        }

        this.setToken(url);
    },

    /**
     * Navigate to the previous active action. This changes the page url.
     */
    back: function() {
        var actions = this.getActions(),
            previousAction = actions[actions.length - 2];

        if (previousAction) {
            actions.pop();

            previousAction.getController().getApplication().redirectTo(previousAction.getUrl());
        }
        else {
            actions[actions.length - 1].getController().getApplication().redirectTo('');
        }
    },

    /**
     * @private
     */
    applyToken: function(token) {
        return token[0] == '#' ? token.substr(1) : token;
    },

    /**
     * @private
     */
    detectStateChange: function() {
        var newToken = this.applyToken(window.location.hash),
            oldToken = this.getToken();

        if (newToken != oldToken) {
            this.onStateChange();
            this.setToken(newToken);
        }
    },

    /**
     * @private
     */
    onStateChange: function() {
        this.fireEvent('change', window.location.hash.substr(1));
    }
});
