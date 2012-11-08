var fs = require('fs');
var find = require('./find');
var path = require('path');

find('.', "*/stats-config.json", function (statsConfigFiles) {
  var stats = statsConfigFiles.map(function(statsConfigFile) {
    var statsRoot = path.dirname(statsConfigFile);
    var statsConfig = JSON.parse(fs.readFileSync(statsConfigFile).toString());
    Object.keys(statsConfig).forEach(function(key) {
      countChars(statsRoot, statsConfig[key], function(count) {
        console.log([statsRoot, key, count].join(','));
      })
    });
  });
});

function countChars(root, filter, callback) {
  if (!filter) {
    return callback(Number.NaN);
  }
  find(root, filter, function (files) {
    var count = files.map(function(file) {
      return fs.readFileSync(file).toString().match(/\n/g).length;
    }).reduce(function (sum, chars) {
          return sum + chars;
        }, 0);
    callback(count);
  })
}
