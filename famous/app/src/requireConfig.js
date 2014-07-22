/*globals require*/
require.config({
    shim: {
        zepto: {
            exports: 'Zepto'
        },
        'zepto.ajax': {
            deps: [
                'zepto.callbacks',
                'zepto.deferred',
                'zepto.event'
            ],
            exports: 'Zepto'
        },
        'zepto.callbacks': [
            'zepto'
        ],
        'zepto.deferred': {
            deps: [
                'zepto'
            ],
            exports: 'Zepto'
        },
        'zepto.event': {
            deps: [
                'zepto.ie'
            ],
            exports: 'Zepto'
        },
        'zepto.ie': [
            'zepto'
        ]
    },
    paths: {
        almond: '../lib/almond/almond',
        famous: '../lib/famous',
        requirejs: '../lib/requirejs/require',
        zepto: '../lib/zeptojs/src/zepto',
        'zepto.ajax': '../lib/zeptojs/src/ajax',
        'zepto.callbacks': '../lib/zeptojs/src/callbacks',
        'zepto.deferred': '../lib/zeptojs/src/deferred',
        'zepto.event': '../lib/zeptojs/src/event',
        'zepto.ie': '../lib/zeptojs/src/ie'
    },
    packages: [

    ]
});
require(['main']);
