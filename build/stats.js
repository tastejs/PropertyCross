var fs = require('fs');
var find = require('./find');
var path = require('path');
var async = require('async');
var yaml = require('yamljs');

find('.', "*/stats-config.json", function (statsConfigFiles) {
  var stats = statsConfigFiles.map(function(statsConfigFile) {
    var statsRoot = path.dirname(statsConfigFile);
    var statsConfig = JSON.parse(fs.readFileSync(statsConfigFile).toString());
    var stats = {};
    async.forEach(Object.keys(statsConfig), function(key, callback) {
      countChars(statsRoot, statsConfig[key], function(error, count) {
        if (!error && count > 0) {
          stats[key] = count;
        }
        callback(error);
      });
    }, function() {
      console.log("---");
      console.log(statsRoot);
      console.log("---");
      console.log(yaml.stringify({
        pie: createPie(stats)
      }));
    });
  });
});

function countChars(root, filter, callback) {
  if (!filter) {
    return callback(Number.NaN);
  }
  find(root, filter, function (files) {
    var count = files.map(function(file) {
      var lines = fs.readFileSync(file).toString().match(/\n/g).length
//      console.log(file, lines);
      return lines;
    }).reduce(function (sum, chars) {
          return sum + chars;
        }, 0);
    callback(null, count);
  })
}

function createPie(stats) {
  var X = 150, Y = 150, R = 145;
  var sum = Object.keys(stats)
      .map(function(k) { return stats[k]; })
      .reduce(function (sum, v) { return sum + v; }, 0);
  var offset = -Math.PI/2;
  var svgPaths = {};
  Object.keys(stats).sort(function(a, b) {
    // there should never be duplicate values
    if (a === 'common') {
      return 1;
    } else if (b === 'common') {
      return -1;
    } else {
      return  a > b ? 1 : -1;
    }
  }).forEach(function(platform) {
    svgPaths[platform] = {
      segment: segment(X, Y, R, offset, offset+=stats[platform]/sum*2*Math.PI)
    };
    if (Object.keys(stats).length > 1) {
      svgPaths[platform].line = line(X, Y, R, offset);
    }
  });
  return svgPaths;
}

function segment(x, y, r, a1, a2) {
  var flag = (a2 - a1) > Math.PI;
  if ((a2 - a1) % (2 * Math.PI) < 0.0001) {
    a2 -= Math.PI * 0.0001;
  }
  return [
    "M" + [x, y].join(','),
    "l" + [(r * Math.cos(a1)).toFixed(2), (r * Math.sin(a1)).toFixed(2)].join(','),
    "A" + [r, r, 0, +flag, 1, (x + r * Math.cos(a2)).toFixed(2), (y + r * Math.sin(a2)).toFixed(2)].join(','),
    "z"
  ].join('');
}

function line(x, y, r, a1) {
  return [
    "M" + [x, y].join(','),
    "l" + [(r * Math.cos(a1)).toFixed(2), (r * Math.sin(a1)).toFixed(2)].join(',')
  ].join('');
}
