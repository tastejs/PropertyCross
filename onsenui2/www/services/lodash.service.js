(function(app){
    'use strict';
    
    // Register factory
    app.factory('_', LodashFactory);

    LodashFactory.$inject = ['$window'];

    function LodashFactory($window) {  
      return $window._;
    }

})(window.app);