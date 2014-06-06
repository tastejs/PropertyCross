
define([
    'angular',
    'services',
    'controllers',
    'angular-animate',
    'angular-resource',
    'angular-touch',
    'angular-ui-router',
    'famous-angular'
], function(angular) {
    'use strict';

    return angular.module('propertycross', [
        'propertycross.services',
        'propertycross.controllers',
        'ngAnimate',
        'ngResource',
        'ngTouch',
        'ui.router',
        'famous.angular'
    ]);
});
