/**
 * @private
 */
Ext.define('Ext.device.media.Abstract', {
    mixins: ['Ext.mixin.Observable'],

    config: {
        src: null
    },

    play: Ext.emptyFn,
    pause: Ext.emptyFn,
    stop: Ext.emptyFn,
    release: Ext.emptyFn,
    seekTo: Ext.emptyFn,

    getCurrentPosition: Ext.emptyFn,
    getDuration: Ext.emptyFn,

    startRecord: Ext.emptyFn,
    stopRecord: Ext.emptyFn
});
