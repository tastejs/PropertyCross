module.exports = function(grunt) {
  'use strict';

  var config = {
    pkg: grunt.file.readJSON("package.json")
  };

  grunt.loadNpmTasks("grunt-exec");

  require("../phonegap/common-with-winphone").build(grunt, config, function(config) {
    config.compress.main.files.push(
      { expand: true, src: ["**/*"], cwd: "app", dest: "www" }
    );
  });

};