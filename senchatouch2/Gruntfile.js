module.exports = function(grunt) {
  'use strict';

  var config = {
    pkg: grunt.file.readJSON("package.json"),
    exec: {
      sencha: {
        cmd: "sencha app build --environment package",
        cwd: "src"
      }
    }
  };

  grunt.loadNpmTasks("grunt-exec");

  require("../phonegap/common-with-winphone").build(grunt, config, function(config) {
    config.defaultTask.splice(1, 0, "exec");
    config.clean.push("src/build/**")
    config.compress.main.files.push(
      { expand: true, src: ["**/*"], cwd: "src/build/package/PropertyCross", dest: "www" }
    );
  });

};