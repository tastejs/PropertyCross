(function(app){
    'use strict';

    // add controller to app
    app.controller('HomePageController', HomePageController);

    // controller dependencies
    HomePageController.$inject = ['PROPERTY_API',  'PropertiesService', 'RecentSearchesService', '$window', '$timeout']

    // controller
    function HomePageController(PROPERTY_API, PropertiesService, RecentSearchesService, $window, $timeout) {
        var vm = this;
        
        // properties
        vm.searchTerm     = '';
        vm.loading        = false;
        vm.recentSearches = [];
        vm.state          = 1;
        vm.errorMessage   = '';
        vm.locations      = [];

        // methods
        vm.searchByTerm     = searchByTerm;
        vm.searchByPosition = searchByPosition;
        vm.doSearchWith     = doSearchWith;
        vm.goToFaves        = goToFaves;

        // startup method
        activate();
        ////////////////////////
        
        /**
         * Startup method
         */
        function activate() {
            // listener for getting recent searches every time home page is shown
            $window.document
                .addEventListener('show', function(event){
                    if (event.srcElement.id === 'home-page') {
                        getRecentSearches();
                    } 
                });
        }

        /**
         * Get recent searches form storage
         */
        function getRecentSearches() {
            RecentSearchesService.get()
                .then(function(data) {
                    // workarount to force $digest cycle
                    $timeout(function() {vm.recentSearches = data;}, 0)
                });
        }

        /**
         * Toggle Loading modal visibility
         */
        function toggleModal() {
            $window.document
                .getElementById('home-modal')
                .toggle();
        }
                
        /**
         * Performs a search by term
         */
        function searchByTerm() {
            toggleModal();
            
            // do search
            PropertiesService.searchByTerm(vm.searchTerm)
                .then(function(data) {
                    processResponse(data);
                })
                .catch(function(){
                    showErrorState({message: 'Other error'});
                });
        }

        /**
         * Process Successfull data response from service
         * 
         * @param  Object data Returned service response
         */
        function processResponse(data) {
            if (data.status === PROPERTY_API.status.SUCCESS) {
                showResultsPage(data);
            }
            else if (data.status === PROPERTY_API.status.AMBIGUOUS) {
                showLocationsState(data);
            }
            else { // error
                showErrorState(data);
            }
        }

        /**
         * Performs a search by current position
         */
        function searchByPosition() {
            vm.searchTerm = '';

            toggleModal();

            PropertiesService.searchByPosition()
                .then(function(data){
                    processResponse(data);
                })
                .catch(function(error){
                    showErrorState(error);
                });
        }

        /**
         * Navigates to results page
         * 
         * @param  Object data 
         */
        function showResultsPage(data) {
            vm.state        = 1;
            vm.locations    = [];
            vm.errorMessage = '';

            // if search was by term, stores it in recent searches
            if (vm.searchTerm !== '') {
                RecentSearchesService.store({
                    term: vm.searchTerm,
                    results: data.results 
                });
            }

            $window.navi
                .pushPage('pages/results/results.html')
                .then(function(){
                    toggleModal();
                });
        }

        /**
         * Shows user a list to select a location
         * 
         * @param  Object data 
         */
        function showLocationsState(data) {
            vm.state     = 2; // ambiguous
            vm.locations = data.locations;

            toggleModal();
        }

        /**
         * Shows user a message for an error situation
         * 
         * @param  Object data
         */
        function showErrorState(data) {
            vm.state        = 0; // error
            vm.errorMessage = data.message;

            toggleModal();
        }

        /**
         * Perform a term based search with de selected location (from location state)
         * 
         * @param  Object location
         */
        function doSearchWith(location) {
            vm.state        = 1;
            vm.locations    = [];
            vm.errorMessage = '';
            vm.searchTerm   = location;

            searchByTerm();
        }

        /**
         * Navigates to favourites pages
         */
        function goToFaves() {
            $window.navi.pushPage('pages/favourites/favourites.html');
        }
    } // function HomePageController
})(window.app);