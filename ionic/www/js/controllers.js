angular.module('propertycross.controllers', ['ionic'])

.controller('HomeCtrl', function($scope, Nestoria) {

    var doSearch = ionic.debounce(function(location) {
        Nestoria.search(location).then(function(response) {
            console.log("woot");
        });
    }, 300);

    $scope.searchText = "";

    $scope.search = function() {
        doSearch("edinburgh");
    };

})

.controller('ResultsCtrl', function($scope, $stateParams) {
    $scope.properties = [];
})

.controller('PropertyCtrl', function($scope, $stateParams) {

})

.controller('FavouritesCtrl', function($scope) {

});
