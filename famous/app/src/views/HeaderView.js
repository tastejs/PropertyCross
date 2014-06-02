
define(function(require, exports, module) {
    'use strict';
    var Surface = require('famous/core/Surface');
    var View    = require('famous/core/View');

    function HeaderView() {
        View.apply(this, arguments);

        var surface = new Surface({
            content: 'PropertyCross',
            properties: {
                backgroundColor: 'black',
                color: 'white',
                fontSize: '20px',
                lineHeight: this.options.headerSize + 'px',
                textAlign: 'center'
            }
        });

        this.add(surface);
    }

    HeaderView.prototype = Object.create(View.prototype);
    HeaderView.prototype.constructor = HeaderView;

    HeaderView.DEFAULT_OPTIONS = {
        headerSize: 50
    };

    module.exports = HeaderView;
});
