// Watches files for changes and runs tasks based on the changed files
module.exports = function (grunt) {
  'use strict';
  grunt.event.on('watch', function (action, filepath) {
    grunt.config('jscs.src', [filepath]);
    grunt.config('eslint.target', filepath);
  });
  return {
    options: {
      livereload: grunt.option('livereload') || true
    },
    gruntfile: {
      files: ['Gruntfile.js', 'grunt/**/**'],
      options: {
        reload: true
      }
    },
    js: {
      files: ['<%= config.app %>/src/**/**.js'],
      tasks: ['lint'],
      options: {
        spawn: false,
        interrupt: true
      }
    },
    css: {
      files: ['<%= config.app %>/styles/{,*/}*.css']
    },
    html: {
      files: ['<%= config.app %>/{,*/}*.html'],
      tasks: ['processhtml:dev']
    },
    content: {
      files: [
        '<%= config.app %>/content/**/**'
      ]
    }
  };
};
