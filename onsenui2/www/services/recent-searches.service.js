/**
 * Service for storing and retrieving recent searches
 */
(function(app){
    'use strict';

    // add service to app
    app.factory('RecentSearchesService', RecentSearchesService);

    // dependencies of service
    RecentSearchesService.$inject = ['$log', '$q', '_', 'localforage', '$timeout']

    // service
    function RecentSearchesService($log, $q, _, localforage) {
        // local copy of storage
        var searches = null;

        // public
        var service = {
            get: getRecentSearches,
            store: storeSearch
        };

        return service;

        //////////////////////////////
    
        /**
         * retrieve stored recent searches and cache them in service local variable
         * 
         * @return Promise
         */
        function init() {
            return localforage.getItem('recentSearches')
                .then(initComplete)
                .catch(initFailed);

            function initComplete(value) {
                searches = value;
                return searches;
            }

            function initFailed(error) {
                $log.error(error);
            }
        }

        /**
         * Get recent searches
         * 
         * @return Promise
         */
        function getRecentSearches() {
            if (searches !== null) {
                return $q.resolve(searches);
            } else {
                return init();
            }
        }

        /**
         * Store recent search
         * 
         * @param  Object searchInfo Search to be stored
         */
        function storeSearch(searchInfo) {
            var search = {
                term: searchInfo.term,
                results: searchInfo.results,
                date: new Date().toISOString()
            }

            // no searches stored
            if (searches === null) {
                searches = [search];
            }
            else {
                // try to find term
                var index = _.findIndex(searches, ['term', search.term]);

                // update date or insert
                if (index > -1) {
                    searches[index] = search;
                }
                else {
                    searches.push(search);
                }

                // order
                searches = _.reverse(_.sortBy(searches, ['date']));

                // only 6 elements
                searches = _.slice(searches, 0, 6);
            }

            // persist storage
            localforage.setItem('recentSearches', searches);
        }
    }
})(window.app);