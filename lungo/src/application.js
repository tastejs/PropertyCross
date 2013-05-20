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

        this.applicationViewModel.applicationState.subscribe(function(state) {
            Lungo.Data.Storage.persistent('applicationState', state);
        });

        var state = Lungo.Data.Storage.persistent('applicationState');

        this.applicationViewModel.initialize({
            state: state
        });

        document.addEventListener('deviceready', function() {
            document.addEventListener('backbutton', function() {
                Lungo.Router.back();
            }, false);
        }, false);


    }
);