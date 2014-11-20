var fs = require('fs');
var find = require('./find');
var path = require('path');
var async = require('async');
var yaml = require('yamljs');
var Q = require('q');

find('.', "*/stats-config.json", function (statsConfigFiles) {
  var stats = statsConfigFiles.map(function(statsConfigFile) {
    var statsRoot = path.dirname(statsConfigFile),
        statsConfig = JSON.parse(fs.readFileSync(statsConfigFile).toString()),
        stats = {},
        deferred = Q.defer();
    async.forEach(Object.keys(statsConfig), function(key, callback) {
      count(statsRoot, statsConfig[key], process.argv.indexOf("lloc") > -1 ? countLogicalLinesOfCode : countLinesOfCode, function(error, count) {
        if (!error && count > 0) {
          stats[key] = count;
        }
        callback(error);
      });
    }, function() {
      deferred.resolve({ statsRoot: statsRoot, lineCounts: stats, pie: createPie(stats) });
    });
    return deferred.promise;
  });
  Q.all(stats).done(process.argv.indexOf("json") > -1 ? printJSON : printYAML);
});

function printYAML(stats) {
  stats.map(function(moduleStats) {
    console.log("---");
    console.log(moduleStats.statsRoot);
    console.log("---");
    console.log(yaml.stringify({
      pie: moduleStats.pie
    }));
  });
}

function printJSON(stats) {
  console.log(JSON.stringify({
    stats: stats
  }, null, 2));
}

function countLogicalLinesOfCode(file) {
  var fileExt = file.split('.').pop();
  if (fileExt == "lloc") {
    return 0;
  }

  var fileContent = fs.readFileSync(file).toString();

  if (["h", "m", "cs", "java", "js", "css", "scss", "as"].indexOf(fileExt) > -1) { // C-style
    // Remove block comments: /* foo */
    fileContent = fileContent.replace(/\/\*([\s\S]*?)\*\//g, '');
    // Remove lines containing only line comment
    fileContent = fileContent.replace(/^\s*\/\/.*?$/gm, '');
    // Remove lines containing only open/close item/block ({}[],)
    fileContent = fileContent.replace(/^(\s|[\{\}\[\]\,])*?$/gm, '');
  } else if (["erb", "mxml", "xml", "html"].indexOf(fileExt) > -1) { // XML-style
    // Remove block comments: <!-- foo -->
    fileContent = fileContent.replace(/\<\!\-\-([\s\S]*?)\-\-\>/g, '');
  } else if (["rb", "coffee"].indexOf(fileExt) > -1) { // Ruby-style
    // Remove lines containing only line comment: # foo
    fileContent = fileContent.replace(/^\s*#[^#].+?$/gm, '');
    if (fileExt == "rb") {
      // Remove lines containing only close block ("end")
      fileContent = fileContent.replace(/^\s*end.*?$/gm, '');
    } else if (fileExt == "coffee") {
      // Remove block comments: ### foo ###
      fileContent = fileContent.replace(/###([\s\S]*?)###/g, '');
    }
  } else {
    console.log("Warning: File " + file + " is not classified for LLOC analysis");
  }

  // Remove blank lines
  fileContent = fileContent.replace(/^\s*$/gm, '');

  if (process.argv.indexOf("verify") > -1) {
      fs.writeFileSync(file + ".lloc", fileContent);
  }

  return fileContent.match(/\n/g).length;
}

function countLinesOfCode(file) {
  return fs.readFileSync(file).toString().match(/\n/g).length
}

function count(root, filter, counter, callback) {
  if (!filter) {
    return callback(Number.NaN);
  }
  find(root, filter, function (files) {
    var count = files.map(function(file) {
      var lines = counter(file);
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
