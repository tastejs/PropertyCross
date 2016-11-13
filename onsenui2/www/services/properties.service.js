/**
 * Service for accesing Property API
 */
(function(app){
    'use strict';

    // add service to app
    app.factory('PropertiesService', PropertiesService);

    // dependencies of service
    PropertiesService.$inject = ['$log', '$http', '$window', '$q', 'PROPERTY_API']

    // service
    function PropertiesService($log, $http, $window, $q, PROPERTY_API) {
        var lastQueryResults  = {};
        var searchTerm        = '';
        var searchCoordinates = null;

        // public
        var service = {
            searchByTerm: searchByTerm,
            searchByPosition: searchByPosition,
            loadMore: loadMore,
            getLastQueryResults: getLastQueryResults
        };

        return service;
        //////////////////////////////
        
        /**
         * Compose url for term based searches
         * 
         * @param  string term Term to search
         * @param  int page Page number
         * @return string URL
         */
        function composeTermUrl(term, page) {
            return PROPERTY_API.baseUrl + '&page=' + page + '&place_name=' + term;
        }

        /**
         * Compose url for location based searches
         * 
         * @param  Object coordinates Geolocation object
         * @param  int page Page number
         * @return string URL
         */
        function composePositionUrl(coordinates, page) {
            return PROPERTY_API.baseUrl + '&page=' + page + 
                '&centre_point=' + coordinates.lat + ',' + coordinates.lng;
        }

        /**
         * Perform a search of properties by term
         * 
         * @param  string term
         * @return Promise
         */
        function searchByTerm(term) {
            searchCoordinates = null;
            searchTerm        = term;

            return $http.get(composeTermUrl(term, 1), {timeout: 5000})
                .then(searchByTermComplete)
                .catch(searchByTermFailed);

            function searchByTermComplete(response) {
                return processResponse(response.data);
            }

            function searchByTermFailed(error) {
                return processFailedResponse(error, PROPERTY_API.error.messages.GENERIC_ERROR);
            }
        }

        /**
         * Perform search by Position
         * 
         * @return Promise
         */
        function searchByPosition() {
            searchCoordinates = null;
            searchTerm        = '';

            return $q(function(resolve, reject){

                // try to get current position
                $window.navigator.geolocation
                    .getCurrentPosition(positionSuccess, positionError, { enableHighAccuracy: true, timeout: 5000 });

                function positionSuccess(position) {
                    searchCoordinates = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    $http.get(composePositionUrl(searchCoordinates, 1), {timeout: 5000})
                        .then(searchByPositionComplete)
                        .catch(positionError);

                    function searchByPositionComplete(response) {
                        var info = processResponse(response.data);
                        resolve(info);
                    }
                }

                function positionError(error) {
                    var msg = '';

                    if (error.code === error.PERMISSION_DENIED) {
                        msg = PROPERTY_API.error.messages.LOCATION_DISABLED;
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        msg = PROPERTY_API.error.messages.LOCATION_UNAVAILABLE;
                    }  
                    else {
                        msg = PROPERTY_API.error.messages.GENERIC_ERROR
                    }

                    var err = processFailedResponse(error, msg);
                    reject(err);
                }
            });
        }

        /**
         * Process successfull response from API
         * 
         * @param  Object data API response
         * @return Object Procesed results
         */
        function processResponse(data) {

            switch (data.response.application_response_code) {
                // OK codes
                case '100':
                case '101':
                case '110':
                    // Some properties found
                    if (data.response.listings.length) {
                        lastQueryResults = {
                            status: PROPERTY_API.status.SUCCESS,
                            message: '',
                            searchTerm: searchTerm,
                            searchCoordinates: searchCoordinates,
                            page: data.response.page,
                            pages: data.response.total_pages + 1,
                            showing: data.response.listings.length,
                            results: data.response.total_results,
                            properties: data.response.listings
                        };
                    }
                    // No properties found
                    else {
                        lastQueryResults = {
                            status: PROPERTY_API.status.ERROR, 
                            message: 'There were no properties found for the given location.',
                            searchTerm: searchTerm,
                            searchCoordinates: searchCoordinates
                        };
                    }

                    break;
                // Ambiguous codes
                case '200':
                case '202':
                    lastQueryResults = {
                        status: PROPERTY_API.status.AMBIGUOUS, 
                        message: '',
                        searchCoordinates: searchCoordinates,
                        searchTerm: searchTerm,
                        locations: data.response.locations
                    };
                    break;
                // everything else is considered as error
                default:
                    lastQueryResults = processFailedResponse(null, PROPERTY_API.error.messages.GENERIC_ERROR);
            } // switch

            return lastQueryResults;
        }

        /**
         * Process erroneous responses from API
         * 
         * @param  string error Browser description of error
         * @param  string msg Message shown to user
         * @return Object
         */
        function processFailedResponse(error, msg) {
            $log.error(error);

            lastQueryResults = {
                status: PROPERTY_API.status.ERROR, // error
                message: msg,
                searchCoordinates: searchCoordinates,
                searchTerm: searchTerm
            };

            return lastQueryResults;
        }

        /**
         * Use last query parameter to get more results by asking for next page.
         * 
         * @return Promise
         */
        function loadMore() {

            // Term based search
            if (lastQueryResults.searchCoordinates === null) {
                return $http.get(composeTermUrl(lastQueryResults.searchTerm, lastQueryResults.page +1))
                    .then(loadMoreComplete)
                    .catch(loadMoreFailed);    
            }
            // Location based search
            else {
                return $http.get(composePositionUrl(lastQueryResults.searchCoordinates, lastQueryResults.page +1))
                    .then(loadMoreComplete)
                    .catch(loadMoreFailed);
            }
            
            function loadMoreComplete(response) {
                lastQueryResults.page++;
                lastQueryResults.properties = lastQueryResults.properties.concat(response.data.response.listings);
                lastQueryResults.showing    = lastQueryResults.properties.length;

                return response.data;
            }

            function loadMoreFailed(error) {
                return processFailedResponse(error, PROPERTY_API.error.messages.GENERIC_ERROR);
            }
        }

        /**
         * Return last results obtained
         * 
         * @return Object
         */
        function getLastQueryResults() {
            return lastQueryResults;
        }
    }
})(window.app);