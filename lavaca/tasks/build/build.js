
'use strict';

module.exports = function(grunt) {

  grunt.registerTask('build', 'Configurable build process', function(env, platform) {
    var target = env || 'local';
    var params = target;
    if (platform) {
      params = params + ':' + platform;
    }
    grunt.task.run('buildProject:' + params);
  });

};
