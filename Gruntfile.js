module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    hub: {
      all: {
        src: ["*/Gruntfile.js"]
      }
    }
  });

  grunt.registerTask("install", "Perform npm install on all subdirectories", function() {
    var i, directory, install,
        modules = grunt.file.expand("*/package.json"), 
        done = this.async();
    install = function(modules) {
      var module;
      if (modules.length) {
        module = modules[0];
        grunt.log.writeln("Running npm install in "+module);
        grunt.util.spawn({
          cmd: "npm",
          args: ["install"],
          opts: {
            cwd: module.substring(0, module.lastIndexOf("/"))
          }
        }, function() {
          install(modules.slice(1));
        });
      } else {
        done();
      }
    }
    install(modules);
  });
  
  grunt.loadNpmTasks("grunt-hub");
  grunt.registerTask("default", ["hub"]);
};
