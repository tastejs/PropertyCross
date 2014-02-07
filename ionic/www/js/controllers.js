angular.module('propertycross.controllers', ['ionic'])

.controller('HomeCtrl', function($scope, $state, $ionicLoading, Properties) {

    var doSearch = ionic.debounce(function(location) {
        var loading = $ionicLoading.show({ content: 'Searching...' });
        Properties.search(location).then(function(response) {
            loading.hide();
            $state.go('results', { searchTerm: location });
        });
    }, 200);

    var doSearchMyLocation = ionic.debounce(function() {
        var loading = $ionicLoading.show({ content: 'Searching...' });
        Properties.searchByCurrentLocation().then(function(response) {
            loading.hide();
            $state.go('results', { searchTerm: 'TODO' });
        });
    }, 200);

    $scope.search = function(searchText) {
        doSearch(searchText);
    };

    $scope.searchMyLocation = function() {
        doSearchMyLocation();
    };

})

.controller('ResultsCtrl', function($scope, $stateParams, Properties) {
    $scope.properties = Properties.current();
    $scope.title = Properties.count() + ' of ' + Properties.total() + ' matches';
})

.controller('PropertyCtrl', function($scope, $stateParams, Properties) {
    $scope.rightButtons = [ { type: 'button-clear',
                              content: '<i class="icon ion-star"></i>',
                              tap: function(event) {
                                  console.log('TODO');
                              } } ];

    $scope.property = Properties.get($stateParams.id);
})

.controller('FavouritesCtrl', function($scope) {

});
