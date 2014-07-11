
define(function(require, exports, module) {
    "use strict";

    var View             = require("famous/core/View");

    function VisibilityLayout() {
        View.apply(this, arguments);

        _create.call(this);
    }

    VisibilityLayout.prototype = Object.create(View.prototype);
    VisibilityLayout.prototype.constructor = VisibilityLayout;

    VisibilityLayout.DEFAULT_OPTIONS = {
        visible: true
    };

    VisibilityLayout.prototype.hide = function(){
        this.visible = false;
    };

    VisibilityLayout.prototype.show = function(){
        this.visible = true;
    };

    VisibilityLayout.prototype.render = function(){
        return this.visible ? this._node.render() : undefined;
    }

    function _create(){
        this.visible = this.options.visible;
    }

    module.exports = VisibilityLayout;
});
