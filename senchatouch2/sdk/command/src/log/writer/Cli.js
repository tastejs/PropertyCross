Ext.define('Command.log.writer.Cli', {
    extend: 'Ext.log.writer.Writer',

    doWrite: function(event) {
        console.log(event.message);
    }
});
