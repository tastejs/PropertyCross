'use strict';

module.exports = function(grunt) {

  grunt.registerTask('cordovaInit', 'wrapper task for project setup', function() {

    grunt.task.run([
      'shell:mkCordovaDir',
      'initCordova',
      'initPlatforms',
      'copy:cordovaConfig',
      'clean:iosGitIgnore'
    ]);

  });

};