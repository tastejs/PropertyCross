/**
 * Service for storing, retrieve and delete favourites properties
 */
(function(app){
    'use strict';

    // add service to app
    app.factory('FavouritesService', FavouritesService);

    // dependencies of service
    FavouritesService.$inject = ['$log', '$q', '_', 'localforage', '$window']

    // service
    function FavouritesService($log, $q, _, localforage, $window) {

        // local copy of favourites
        var favourites = null;

        // public interface
        var service = {
            getAll: getFavourites,
            store: storeFav,
            remove: removeFav,
            isFav: isFav
        };

        return service;

        //////////////////////////////
 
        /**
         * retrieve stored favourites and cache them in service local variable
         * 
         * @return Promise
         */
        function init() {
            return localforage.getItem('favouriteProperties')
                .then(initComplete)
                .catch(initFailed);

            function initComplete(value) {
                favourites = value;
                return favourites;
            }

            function initFailed(error) {
                $log.error(error);
            }
        }

        /**
         * Get favourites from local variable or storage
         * 
         * @return Promise
         */
        function getFavourites() {
            if (favourites !== null) {
                return $q.resolve(favourites);
            } else {
                return init();
            }
        }

        /**
         * Generates key from property
         * 
         * @param Object property
         * @return String Generated key
         */
        function getPropertyKey(property) {
            return $window.btoa(property.lister_url);
        }

        /**
         * Check if a property is favourite
         * 
         * @param Object property
         * @return Promise
         */
        function isFav(property) {
            return getFavourites().then(isFavComplete)
                .catch(isFavFailed);

            function isFavComplete(favourites) {
                return _.findIndex(favourites, ['key', getPropertyKey(property)]) > -1;                
            }

            function isFavFailed(error) {
                $log.error(error);
                return false;
            }
        }

        /**
         * Stores a property in favourites list
         * 
         * @param  Object property
         */
        function storeFav(property) {

            property.key = getPropertyKey(property);

            if (favourites === null || _.isEmpty(favourites)) {
                favourites = [property];
            }
            else {
                // try to find term
                var index = _.findIndex(favourites, ['key', property.key]);

                // update date or insert
                if (index > -1) {
                    favourites[index] = property;
                }
                else {
                    favourites.push(property);
                }
            }
            
            // update storage
            localforage.setItem('favouriteProperties', favourites);
        }

        /**
         * Remove a property from favourites storage
         * 
         * @param  Object property
         */
        function removeFav(property) {

            // try to find property
            var index = _.findIndex(favourites, ['key', getPropertyKey(property)]);

            // delete element from favourites
            if (index > -1) {
                _.pull(favourites, favourites[index]);
            }
            
            // update storage
            localforage.setItem('favouriteProperties', favourites);
        }
    }
})(window.app);