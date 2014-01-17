module.exports = function(grunt) {
  'use strict';

  var config = {
    pkg: grunt.file.readJSON("package.json"),
    exec: {
      mvn: {
        cmd: "mvn package"
      }
    }
  };

  grunt.loadNpmTasks("grunt-exec");

  require("../phonegap/common").build(grunt, config, function(config) {
    config.compress.main.files.push(
      { expand: true, src: ["**/*", "!WEB-INF/**/*", "!META-INF/**/*"], cwd: "target/mgwt-demo-1.0-SNAPSHOT", dest: "www" }
    );
    config.defaultTask.splice(1, 0, "exec");
  });

};
