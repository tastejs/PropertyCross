/**
 * @private
 */
Ext.define('Ext.ux.device.twitter.Cordova', {
    compose: function(config) {
    	windows.plugins.twitter.composeTweet(
			config.success,
			config.failure,
			config.tweet,
			{
				urlAttach: config.url,
				imageAttach: config.image
			}
		);
    },

    getPublicTimeline: function(config) {
    	window.plugins.twitter.getPublicTimeline(
    		config.success,
    		config.failure
    	);
    },

    getMentions: function(config) {
    	window.plugins.twitter.getMentions(
    		config.success,
    		config.failure
    	);
    },
    
    getTwitterUsername: function(config) {
    	window.plugins.twitter.getTwitterUsername(
    		config.success,
    		config.failure
    	);
    },

    getTwitterRequest: function(config) {
    	window.plugins.twitter.getTWRequest(
    		config.url,
    		config.params,
    		config.success,
    		config.failure,
    		config.options
    	);
    }
});
