/*globals require*/
require.config({
    shim: {
        'zepto': {
            exports: 'Zepto'
        },
        'zepto.ajax': {
            deps: ['zepto.callbacks', 'zepto.deferred', 'zepto.event'],
            exports: 'Zepto'
        },
        'zepto.callbacks': ['zepto'],
        'zepto.deferred': ['zepto'],
        'zepto.event': ['zepto']
    },
    paths: {
        almond: '../lib/almond/almond',
        famous: '../lib/famous',
        requirejs: '../lib/requirejs/require',
        'zepto': '../lib/zeptojs/src/zepto',
        'zepto.ajax': '../lib/zeptojs/src/ajax',
        'zepto.callbacks': '../lib/zeptojs/src/callbacks',
        'zepto.deferred': '../lib/zeptojs/src/deferred',
        'zepto.event': '../lib/zeptojs/src/event'
    },
    packages: [

    ]
});
require(['main']);
