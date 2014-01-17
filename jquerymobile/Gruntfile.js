module.exports = function(grunt) {
  'use strict';

  var config, renamer;

  renamer = function(dest, name) {
    var out,
        slash = name.indexOf("/"),
        platform = name.substring(0, slash),
        tail = name.substring(slash + 1),
        end = tail.indexOf("/");
    if (end === -1) {
      end = tail.lastIndexOf(".")
    }
    if (tail.indexOf(platform) !== -1) {
      out = "build/" + tail;
    } else {
      out = "build/" + tail.substring(0, end) + "-" + platform + tail.substring(end);
    }
    return out;
  };

  config = {
    pkg: grunt.file.readJSON("package.json"),
    copy: {
      merges: {
        expand: true,
        src: ["**/*"],
        cwd: "merges",
        dest: "build",
        rename: renamer,
        filter: "isFile"
      }
    }
  };

  require("../phonegap/common-with-winphone").build(grunt, config);

};
