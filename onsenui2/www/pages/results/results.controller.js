(function(app){
    'use strict';

    // add controller to app
    app.controller('ResultsPageController', ResultsPageController);

    // controller dependencies
    ResultsPageController.$inject = ['PropertiesService', '$window']

    // controller
    function ResultsPageController(PropertiesService, $window) {
        var vm = this;
        
        // properties
        vm.queryData = {};
        vm.loadMore = {};

        // methods
        vm.getMoreProperties = getMoreProperties;
        vm.goToPropertyDetails = goToPropertyDetails;

        // startup method
        activate();
        ////////////////////////
        
        /**
         * startup method. Get queried results and sets Load More state
         */
        function activate() {
            vm.queryData = PropertiesService.getLastQueryResults();

            vm.loadMore = {
                loading: false,
                label: 'Load more ...',
                canLoad: vm.queryData.page < vm.queryData.pages
            };
        }

        /**
         * Toggle Load More state
         */
        function toggleLoadMore() {
            if (vm.loadMore.loading) {
                vm.loadMore.loading = false;
                vm.loadMore.label = 'Load more ...';
            } else {
                vm.loadMore.loading = true;
                vm.loadMore.label = 'Loading ...';
            }

            vm.loadMore.canLoad = vm.queryData.page < vm.queryData.pages;
        }

        /**
         * Navigates to Property details page with selected property
         * 
         * @param  Object property
         */
        function goToPropertyDetails(property) {
            // navi is global from onsen-navigator
            $window.navi.pushPage('pages/property-details/property-details.html', {
                data: {
                    selectedProperty: property
                }
            });
        }

        /**
         * get more results from last query
         */
        function getMoreProperties() {
            toggleLoadMore();

            PropertiesService.loadMore()
                .then(function(){
                    toggleLoadMore();
                    vm.queryData = PropertiesService.getLastQueryResults();
                }).
                catch(function(error){
                   toggleLoadMore();
                   alert(error.message)
                });
        }
    }
})(window.app);