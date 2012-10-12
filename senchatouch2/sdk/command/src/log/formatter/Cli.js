Ext.define('Command.log.formatter.Cli', {
    extend: 'Ext.log.formatter.Default',

    styles: {
        'bold'      : [1,  22],
        'italic'    : [3,  23],
        'underline' : [4,  24],
        'inverse'   : [7,  27],
        //grayscale
        'white'     : [37, 39],
        'grey'      : [90, 39],
        'black'     : [30, 39],
        //colors
        'blue'      : [34, 39],
        'cyan'      : [36, 39],
        'green'     : [32, 39],
        'magenta'   : [35, 39],
        'red'       : [31, 39],
        'yellow'    : [33, 39]
    },

    priorityStyle: {
        verbose: ['grey', 'bold'],
        info:  ['green', 'bold'],
        deprecate: ['yellow', 'bold'],
        warn: ['magenta', 'bold'],
        error: ['red', 'bold']
    },

    format: function(event) {
        var priority = event.priorityName,
            priorityStyles = this.priorityStyle[priority];

        return require('util').format('%s %s',
                    this.style('['+priority.toUpperCase()+']', priorityStyles),
//                    this.style('['+event.callerDisplayName+']', ['grey']),
                    event.message);
    },

    style: function(text, styles) {
        var style, i, ln, data;

        styles = Ext.Array.from(styles);

        for (i = 0,ln = styles.length; i < ln; i++) {
            style = styles[i];
            data = this.styles[style];
            text = '\033['+data[0]+'m' + text + '\033['+data[1]+'m';
        }

        return text;
    }
});
