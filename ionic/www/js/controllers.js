angular.module('propertycross.controllers', ['ionic'])

.controller('HomeCtrl', function($scope, $state, $ionicLoading, Nestoria) {

    var doSearch = ionic.debounce(function(location) {
        console.log('location: ' + location);
        var loading = $ionicLoading.show({ content: 'Searching...' });
        Nestoria.search(location).then(function() {
            loading.hide();
            $state.go('results', { searchTerm: location });
        });
    }, 300);

    $scope.search = function(searchText) {
        doSearch(searchText);
    };

})

.controller('ResultsCtrl', function($scope, $stateParams) {
    $scope.properties = [];
})

.controller('PropertyCtrl', function($scope, $stateParams) {

})

.controller('FavouritesCtrl', function($scope) {

});
