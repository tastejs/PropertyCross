'use strict';

module.exports = function(grunt) {

  grunt.registerTask('cordovaBuild', 'builds Cordova Projects', function(platform) {

    var paths = grunt.config.get('paths');
    var build = paths.cordovaInit.root;
    var platforms = grunt.config.get('initPlatforms').init.options.platforms;
    var androidPath = paths.build.android;
    var isBuildingAndroid = platform === 'android' || (!platform && platforms.indexOf('android') !== -1);
    var hasAndroidLocalProperties = grunt.file.exists(paths.build.androidLocalProperties);

    var done = this.async();

    var doneFunction = function (error, result, code) {
      if (error) {
        grunt.log.error(error);
      }
      grunt.log.write(result.stdout);
      return done();
    };

    var args = [];
    args.push('build');
    if (platform) {
      args.push(platform);
    }


    var options = {
      cmd: 'cordova',
      args: args,
      opts: {
        cwd: build
      }
    };

    function run() {
      grunt.util.spawn(options, doneFunction);
    }

    var updateAndroidOpts;
    if (isBuildingAndroid && !hasAndroidLocalProperties) {
      updateAndroidOpts = {
        cmd: 'android',
        args: ['update', 'project', '--path', androidPath]
      };
      grunt.util.spawn(updateAndroidOpts, function(error) {
        if (error) {
          grunt.log.error(error);
        }
        run();
      });
    } else {
      run();
    }

  });

};
