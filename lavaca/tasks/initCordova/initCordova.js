'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('initCordova', 'creates cordova projects', function() {
    var options = this.options({});
    var name = options.appName;
    var id = options.id;
    var paths = grunt.config.get('paths');
    var src = paths.cordovaInit.root;
    var done = this.async();
    var doneFunction = function (error, result, code) {
      if (error) {
        grunt.log.error(error);
      }
      grunt.log.write(result.stdout);
      return done();
    };

    var options = {
      cmd: 'cordova',
      args: ['create', src, id, name]
    };

    var cordova = grunt.util.spawn(options, doneFunction);

  });

};
