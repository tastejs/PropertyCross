
define(function(require, exports, module) {
    'use strict';
    var Surface = require('famous/core/Surface');
    var View    = require('famous/core/View');

    function FooterView() {
        View.apply(this, arguments);

        var surface = new Surface({
            properties: {
                backgroundColor: 'Grey'
            }
        });

        this.add(surface);
    }

    FooterView.prototype = Object.create(View.prototype);
    FooterView.prototype.constructor = FooterView;

    FooterView.DEFAULT_OPTIONS = {};

    module.exports = FooterView;
});
