var loadTasks = require("load-grunt-tasks"),
    grunt = require("grunt"),
    _ = require("lodash"),
    pkg = require("./package.json"),
    path = require("path");
module.exports = {
  config: {
    "phonegap-build": {
      debug: {
        options: {
          archive: "app.zip",
          appId: "<%= pkg.appId %>",
          user: {
            email: "propertycrossbuilds+<%= pkg.abbr %>@gmail.com",
            password: "<%= grunt.option('pgb.password') %>"
          },
          download: {
            ios: "<%= pkg.name %>-ios.ipa",
            android: "<%= pkg.name %>-android.apk"
          }
        }
      }
    },
    copy: {
      configXml: {
        expand: true,
        src: ["config.xml"],
        cwd: "../phonegap/common",
        dest: "build",
        options: {

        }
      }
    },
    compress: {
      main: {
        options: {
          archive: "app.zip",
          mode: "zip"
        },
        files: [
          { expand: true, src: ["**/*"], cwd: "build", dest: "www" },
          { src: ["www/**/*"] }
        ]
      }
    },
    clean: ["build", "app.zip", "*.apk", "*.ipa", "*.xap"],
    defaultTask: ["clean", "copy", "compress", "phonegap-build"],
    buildPkg: pkg,
    modulePath: module.filename
  },
  build: function(grunt, config, mutateConfig) {
    var cwd = process.cwd();

    _.merge(config, this.config);

    config.copy.configXml.options.process = function(content) {
      var impl = grunt.config.get("pkg.implName");
      grunt.log.oklns("Setting implementation name to "+impl);
      return content.replace(/\[IMPL\]/g, impl).replace(/\[ID\]/g, grunt.config.get("pkg.abbr"));
    }

    if (mutateConfig) {
      mutateConfig(config);
    }

    grunt.log.debug("Config: "+JSON.stringify(config));

    grunt.initConfig(config);
    process.chdir(path.dirname(config.modulePath));
    loadTasks(grunt, {config: config.buildPkg});
    process.chdir(cwd);
    grunt.registerTask("default", config.defaultTask);
  }
};
