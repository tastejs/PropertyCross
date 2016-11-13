(function(app){
    'use strict';

    // add controller to app
    app.controller('PropertyDetailsPageController', PropertyDetailsPageController);

    // controller dependencies
    PropertyDetailsPageController.$inject = ['PropertiesService', 'FavouritesService', '$timeout', '$window']

    // controller
    function PropertyDetailsPageController(PropertiesService, FavouritesService, $timeout, $window) {
        var vm = this;
        
        // properties
        vm.property = {};

        // methods
        vm.toggleFav = toggleFav;

        // startup method
        activate();
        ////////////////////////
        
        /**
         * Startup method. Get property from 
         */
        function activate() {
            // navi is global from onsen-navigator
            vm.property = prepareProperty($window.navi.topPage.data.selectedProperty);
        }

        /**
         * Transforms property title and check for favourite state
         * 
         * @param  Object property
         * @return Object Prepared property
         */
        function prepareProperty(property) {
            property.title = formatTitle(property.title);

            FavouritesService.isFav(property)
                .then(function(isFav) {
                    // workarount to force $digest cycle
                    $timeout(function() {vm.property.isFav = isFav;}, 0)
                });

            return property;
        }

        /**
         * Take only first and second title parts
         * 
         * @param  string title
         * @return string Formatted title
         */
        function formatTitle(title) {
            var splitTitle = title.split(',');

            if (splitTitle.length > 1) {
                title = splitTitle[0] + ', ' + splitTitle[1];
            } else {
                title = splitTitle[0];
            }

            return title;
        }

        /**
         * Toggles fav state
         */
        function toggleFav() {
            if (vm.property.isFav) {
                FavouritesService.remove(vm.property);
            } else {
                FavouritesService.store(vm.property);
            }

            vm.property.isFav = !vm.property.isFav;
        }
    }
})(window.app);