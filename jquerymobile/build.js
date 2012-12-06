// ensure all the model and viewModel code is in sync
var fs = require('fs');
var find = require('../build/find');
var platforms = ['android', 'ios', 'windowsphone'];
find('common', '*.js', function(paths) {
  paths.forEach(function(path) {
    var commonCode = fs.readFileSync(path);
    platforms.forEach(function(platform) {
      var platformPath = path.replace('common', platform);
      var platformCode = fs.readFileSync(platformPath);
      if (commonCode.toString() != platformCode.toString()) {
        throw path + " does not match " + platformPath;
      }
    });
  });
});

// run platform builds
require('./android/build');
require('./ios/build');
require('./windowsphone/build');
