require.config({
    paths: {
        ko: 'components/knockout/knockout-2.2.1',
        datasource: 'models/NestoriaDataSource'
    },

    shim: {
        ko: {
            exports: 'ko'
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
        this.applicationViewModel = new ApplicationViewModel();
        this.applicationViewModel.initialize();
    }
);