angular.module('propertycross.controllers', ['ionic'])

.controller('HomeCtrl', function($scope, $state, $ionicLoading, Nestoria) {

    var doSearch = ionic.debounce(function(location) {
        console.log('location: ' + location);
        var loading = $ionicLoading.show({ content: 'Searching...' });
        Nestoria.search(location).then(function(response) {
            loading.hide();
            $state.go('results', { searchTerm: location });
        });
    }, 200);

    $scope.search = function(searchText) {
        doSearch(searchText);
    };

})

.controller('ResultsCtrl', function($scope, $stateParams, Nestoria) {
    var searchResult = Nestoria.lastResponse();
    $scope.properties = searchResult.listings;
    $scope.title = searchResult.listings.length + ' of ' + searchResult.total_results + ' matches';
})

.controller('PropertyCtrl', function($scope, $stateParams) {

})

.controller('FavouritesCtrl', function($scope) {

});
