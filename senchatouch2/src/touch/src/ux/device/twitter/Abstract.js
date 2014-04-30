/**
 * @private
 */
Ext.define('Ext.ux.device.twitter.Abstract', {
	/**
	 * Pops up a Twitter compose sheet view with your specified tweet.
	 * 
	 * @param {Object} config An object which contains the following config options:
	 *
	 * @param {String} config.tweet The default tweet text to add to the compose window.
	 * 
	 * @param {String} config.url An optional URL to attatch to the Tweet.
	 * 
	 * @param {String} config.image An optional image URL to attatch to the Tweet.
	 * 
	 * @param {Function} config.success The callback when the Tweet is successfully posted.
	 * 
	 * @param {Function} config.failure The callback when the Tweet is unsuccessfully posted.
	 */
    compose: Ext.emptyFn,

    /**
     * Gets Tweets from Twitter Timeline
	 * 
	 * @param {Object} config An object which contains the following config options:
	 * 
	 * @param {Function} config.success callback
	 * @param {Object[]} config.success.response Tweet objects, see [Twitter Timeline Doc]
	 * 
	 * @param {Function} config.failure callback
     * @param {String} config.failure.error reason for failure
	 *
	 * [Twitter Timeline Doc]: https://dev.twitter.com/docs/api/1/get/statuses/public_timeline
     */
    getPublicTimeline: Ext.emptyFn,

    /**
     * Gets Tweets from Twitter Mentions
	 * 
	 * @param {Object} config An object which contains the following config options:
	 * 
	 * @param {Function} config.success callback
	 * @param {Object[]} config.success.response Tweet objects, see [Twitter Mentions Doc]
	 * 
	 * @param {Function} config.failure callback
     * @param {String} config.failure.error reason for failure
	 *
	 * [Twitter Timeline Doc]: https://dev.twitter.com/docs/api/1/get/statuses/public_timeline
     */
    getMentions: Ext.emptyFn,
    
    /**
     * Gets a specific Twitter user info
	 * 
	 * @param {Object} config An object which contains the following config options:
	 * 
	 * @param {Function} config.success callback
	 * @param {Object[]} config.success.response The JSON response form twitter
	 * 
	 * @param {Function} config.failure callback
     * @param {String} config.failure.error reason for failure
     */
    getTwitterUsername: Ext.emptyFn,

    /**
     * Gets a specific Twitter user info
	 * 
	 * @param {Object} config An object which contains the following config options:
	 *
	 * @param {String} config.url of [Twitter API Endpoint]
	 *
	 * @param {Object} config.params key-value map, matching [Twitter API Endpoint]
	 *
	 * @param {Object} config.options (optional) other options for the HTTP request
 	 * @param {String} config.options.requestMethod HTTP Request type, ex: "POST"
	 * 
	 * @param {Function} config.success callback
	 * @param {Object[]} config.success.response objects returned from Twitter API (Tweets, Users,...)
	 * 
	 * @param {Function} config.failure callback
     * @param {String} config.failure.error reason for failure
     *
     * [Twitter API Endpoint]: https://dev.twitter.com/docs/api
     */
    getTwitterRequest: Ext.emptyFn
});
