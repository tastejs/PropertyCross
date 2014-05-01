'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('initPlatforms', 'adds platforms', function() {
    var options = this.options({});
    var platforms = options.platforms;
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

    var argsArray = new Array('platform', 'add');
    for (var i = 0, l = platforms.length; i < l; i++) {
      argsArray.push(platforms[i]);
    }

    var options = {
      cmd: 'cordova',
      args: argsArray,
      opts: {
        cwd: src
      }
    };

    var cordova = grunt.util.spawn(options, doneFunction);
  });

};
