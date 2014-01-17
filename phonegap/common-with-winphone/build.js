module.exports = (function() {
  var pgBuild = require("../common/build"),
      grunt = require("grunt"),
      lodash = require("lodash"),
      build = lodash.cloneDeep(pgBuild);
  build.config["phonegap-build"].debug.options.download.winphone = "<%= pkg.name %>-winphone.xap";
  build.config.copy.configXml.cwd = "../phonegap/common-with-winphone";
  build.config.buildPkg = require("./package.json");
  build.config.modulePath = module.filename;
  return build;
})();
