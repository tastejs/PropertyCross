/**
 * @private
 */
Ext.define('Ext.device.media.Cordova', {
    alternateClassName: 'Ext.device.media.PhoneGap',
    extend: 'Ext.device.media.Abstract',

    config: {
        /**
         * A URI containing the audio content. 
         * @type {String}
         */
        src: null,

        /**
         * @private
         */
        media: null
    },

    updateSrc: function(newSrc, oldSrc) {
        this.setMedia(new Media(newSrc));
    },

    play: function() {
        var media = this.getMedia();
        if (media) {
            media.play();
        }
    },

    pause: function() {
        var media = this.getMedia();
        if (media) {
            media.pause();
        }
    },

    stop: function() {
        var media = this.getMedia();
        if (media) {
            media.stop();
        }
    },

    release: function() {
        var media = this.getMedia();
        if (media) {
            media.release();
        }
    },

    seekTo: function(miliseconds) {
        var media = this.getMedia();
        if (media) {
            media.seekTo(miliseconds);
        }
    },

    getDuration: function() {
        var media = this.getMedia();
        if (media) {
            media.getDuration();
        }
    },

    startRecord: function() {
        var media = this.getMedia();

        if (!media) {
            this.setSrc(null);
        }

        media.startRecord();
    },

    stopRecord: function() {
        var media = this.getMedia();
        if (media) {
            media.stopRecord();
        }
    }
});
