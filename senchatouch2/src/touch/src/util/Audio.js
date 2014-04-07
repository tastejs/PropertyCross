/**
 * @private
 */
Ext.define('Ext.util.Audio', {
    singleton: true,
    ctx: null,

    beep: function(callback) {
        this.oscillate(200, 1, callback);
    },

    oscillate: function(duration, type, callback) {
        if (!this.ctx) {
            this.ctx = new (window.audioContext || window.webkitAudioContext);
        }

        if (!this.ctx) {
            console.log("BEEP");
            return;
        }

        type = (type % 5) || 0;

        try {
            var osc = this.ctx.createOscillator();
            osc.type = type;
            osc.connect(this.ctx.destination);
            osc.noteOn(0);

            setTimeout(function() {
                osc.noteOff(0);
                if(callback) callback();
            }, duration);
        } catch (e) {
            throw new Error("[Ext.util.Audio.oscillate] Error with Oscillator playback");
        }

    }

})
;



