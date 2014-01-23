module.exports = function(grunt) {
  'use strict';

  var config = {
    pkg: grunt.file.readJSON("package.json"),
    execute: {
      enyo: {
        src: ['src/enyo/tools/deploy.js'],
        options: {
          cwd: 'src'
        }
      }
    }
  };

  grunt.loadNpmTasks("grunt-execute");

  require("../phonegap/common-with-winphone").build(grunt, config, function(config) {
    config.defaultTask.splice(1, 0, "execute");
    config.clean.push("src/build/**");
    config.clean.push("src/deploy/**");
    config.compress.main.files.push(
      { expand: true, src: ["**/*"], cwd: "src/deploy/src", dest: "www" },
      { expand: true, src: ["assets/**/*"], dest: "www" }
    );
  });

};