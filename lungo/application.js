require.config({
    paths: {
        ko: 'components/knockout/knockout-2.2.1',
        datasource: 'models/NestoriaDataSource',
        lungo: 'components/lungo/lungo'
    },

    shim: {
        ko: {
            exports: 'ko'
        },

        lungo: {
            exports: 'Lungo'
        }
    },

    baseUrl: '.'
});

define(
    [
        'ko',
        'viewModels/ApplicationViewModel'
    ],

    function(ko, ApplicationViewModel) {
        ko.applyBindings(new ApplicationViewModel());
    }
);