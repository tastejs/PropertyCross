
define(function(require, exports, module) {
    'use strict';
    var View = require('famous/core/View');

    function EmptyView() {
        View.apply(this, arguments);
    }

    EmptyView.prototype = Object.create(View.prototype);
    EmptyView.prototype.constructor = EmptyView;

    EmptyView.DEFAULT_OPTIONS = {};

    module.exports = EmptyView;
});
