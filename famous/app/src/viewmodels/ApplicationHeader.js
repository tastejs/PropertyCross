/*globals define*/
define(function(require, exports, module) {
    'use strict';

    var BrowserHistory  = require('models/BrowserHistory');
    var PageViewModel   = require('prototypes/PageViewModel');

    /*
     * @name ApplicationHeader
     * @constructor
     * @description
     */

    function ApplicationHeader(applicationStateModel) {
        PageViewModel.apply(this, arguments);

        this._applicationState.on('state-navigation', _stateNavigation.bind(this));
        this._applicationState.on('update-heading', _updateHeading.bind(this));
    }

    ApplicationHeader.prototype = Object.create(PageViewModel.prototype);
    ApplicationHeader.prototype.constructor = ApplicationHeader;

    ApplicationHeader.prototype.goBack = function() {
        this._applicationState.goBack();
    };

    function _stateNavigation(data) {
        _updateHeading.call(this, data.view);
    }

    function _updateHeading(view) {
        var pageViewModel = view.getModel();

        this._eventOutput.emit('update-ui', {
            title: pageViewModel.getTitle(),
            canGoBack: BrowserHistory.canGoBack()
        });
    }

    module.exports = ApplicationHeader;
});
