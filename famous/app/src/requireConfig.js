/*globals require*/
require.config({
    paths: {
        almond: '../lib/almond/almond',
        angular: '../lib/angular/angular',
        'angular-animate': '../lib/angular-animate/angular-animate',
        'angular-resource': '../lib/angular-resource/angular-resource',
        'angular-touch': '../lib/angular-touch/angular-touch',
        'angular-ui-router': '../lib/angular-ui-router/release/angular-ui-router',
        famous: '../lib/famous',
        'famous-angular': '../lib/famous-angular/dist/famous-angular',
        requirejs: '../lib/requirejs/require'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        'angular-animate': {
            deps: [
                'angular'
            ]
        },
        'angular-resource': {
            deps: [
                'angular'
            ]
        },
        'angular-touch': {
            deps: [
                'angular'
            ]
        },
        'angular-ui-router': {
            deps: [
                'angular'
            ]
        },
        'famous-angular': {
            deps: [
                'angular'
            ]
        }
    },
    packages: [

    ]
});
require(['main']);
