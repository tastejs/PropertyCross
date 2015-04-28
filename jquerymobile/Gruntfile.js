module.exports = function(grunt) {
  'use strict';

  var config = {
    pkg: grunt.file.readJSON("package.json")
  };

  require("../phonegap/common-with-winphone").build(grunt, config);

};
