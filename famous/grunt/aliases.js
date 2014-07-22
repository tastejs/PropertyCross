var metrics = require('famous-metrics');

module.exports = function (grunt) {
  'use strict';
  grunt.registerTask('serve', function (target) {

    if (!metrics.getTinfoil()) {
      metrics.track('grunt serve', {});
    }

    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'processhtml:dev',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'lint',
    'processhtml:dist',
    'useminPrepare',
    'requirejs',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('lint', [
    'jscs',
    'eslint'
  ]);

  grunt.registerTask('test', [
    'lint'
  ]);

  grunt.registerTask('default', [
    'clean:phonegap',
    'copy',
    'compress',
    'phonegap-build'
  ]);
};
