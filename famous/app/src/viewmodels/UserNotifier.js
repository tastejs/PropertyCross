/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var PageViewModel = require('prototypes/PageViewModel');

    /*
     * @name UserNotifier
     * @constructor
     * @description
     */

    function UserNotifier(applicationStateModel) {
        PageViewModel.apply(this, arguments);
    }

    UserNotifier.prototype = Object.create(PageViewModel.prototype);
    UserNotifier.prototype.constructor = UserNotifier;

    UserNotifier.prototype.displayUserNotification = function(title, details) {
        this._eventOutput.emit('display-user-notification', {
            title: title,
            details: details
        });
    };

    module.exports = UserNotifier;
});
