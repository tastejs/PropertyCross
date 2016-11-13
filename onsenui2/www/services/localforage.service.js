(function(app){
    'use strict';
    
    // Register factory
    app.factory('localforage', LocalForageFactory);

    LocalForageFactory.$inject = ['$window'];

    function LocalForageFactory($window) {  
      return $window.localforage;
    }

})(window.app);