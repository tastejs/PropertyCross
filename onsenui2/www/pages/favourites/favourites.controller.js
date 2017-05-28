(function(app){
    'use strict';

    // add controller to app
    app.controller('FavouritesPageController', FavouritesPageController);

    // controller dependencies
    FavouritesPageController.$inject = ['FavouritesService', '$timeout', '$window']

    // controller
    function FavouritesPageController(FavouritesService, $timeout, $window) {
        var vm = this;
        
        // properties
        vm.faves = [];

        // methods
        vm.goToPropertyDetails = goToPropertyDetails;

        // startup method
        activate();
        ////////////////////////
        
        /**
         * Startup method. Get favourites from service
         */
        function activate() {
            FavouritesService.getAll()
                .then(function(faves) {
                    // workarount to force $digest cycle
                    $timeout(function() { vm.faves = faves;}, 0)
                });
        }

        /**
         * Navigates to property details page with selected favourite
         * 
         * @param  Object property Selected property
         */
        function goToPropertyDetails(property) {
            // navi is global from onsen-navigator
            $window.navi.pushPage('pages/property-details/property-details.html', {
                data: {
                    selectedProperty: property
                }
            });
        }
    } // function FavouritesPageController
})(window.app);