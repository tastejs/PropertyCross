/**
 * A Traversable mixin.
 * @private
 */
Ext.define('Ext.mixin.Progressable', {
    extend: 'Ext.mixin.Mixin',
    isProgressable: true,

    mixinConfig: {
        id: 'progressable'
    },

    config: {

        /**
         * @cfg {Number} minProgressInput
         * Minimum input value for this indicator
         */
        minProgressInput: 0,

        /**
         * @cfg {Number} maxProgressInput
         * Maximum input value for this indicator
         */
        maxProgressInput: 1,

        /**
         * @cfg {Number} minProgressOutput
         * Minimum output value for this indicator
         */
        minProgressOutput: 0,

        /**
         * @cfg {Number} maxProgressOutput
         * Maximum output value for this indicator
         */
        maxProgressOutput: 100,

        /**
         * @cfg {Boolean} dynamic
         *
         * When false this indicator will only receive progressStart and progressEnd commands, no progressUpdate commands will be sent.
         *
         */
        dynamic: true,

        /**
         * @cfg {String} state
         *
         * Current state of the progressIndicator. Should be used for switching progress states like download to upload.
         */
        state: null
    },

    // @private
    _progressActive: false,
    _progress: 0,
    _rawProgress: 0,

    onStartProgress: Ext.emptyFn,
    onUpdateProgress: Ext.emptyFn,
    onEndProgress: Ext.emptyFn,

    startProgress: function() {
        if (!this._progressActive) {
            this._progressActive = true;
            this.onStartProgress();
            this.updateProgress(this.getMinProgressInput());
        }
    },

    updateProgress: function(value, state) {
        if(state && state != this.getState()) this.setState(state);
        if(value > this.getMaxProgressInput()) value = this.getMaxProgressInput();
        if(value < this.getMinProgressInput()) value = this.getMinProgressInput();

        var mappedValue = this.mapValues(value, this.getMinProgressInput(), this.getMaxProgressInput(), this.getMinProgressOutput(), this.getMaxProgressOutput());
        this._progress = mappedValue;
        this._rawProgress = value;

        if(this.getDynamic()) {
            this.onUpdateProgress(mappedValue);
        }
    },

    endProgress: function() {
        if (this._progressActive) {
            this._progressActive = false;
            this.updateProgress(this.getMaxProgressInput());
            this.onEndProgress()
        }
    },

    mapValues: function(value, inputMin, inputMax, outputMin, outputMax) {
        return (value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin;
    },

    setProgress: function(value) {
        this.updateProgress(value);
    },

    getProgress: function() {
        return this._progress
    },

    getRawProgress: function() {
        return this._rawProgress;
    }
});
