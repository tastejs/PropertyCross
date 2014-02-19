'use strict';


var path = require('path');
var child = require('child_process');

var grunt = require('grunt/lib/grunt');
var toArray = require('mout/lang/toArray');
var partial = require('mout/function/partial');
var Deferred = require('deferreds/Deferred');
var Promise = require('deferreds/Promise');
var forEachSeries = require('deferreds/forEachSeries');
var series = require('deferreds/series');
var promisify = require('promisemonkey');
var parseString = promisify.convert(require('xml2js').parseString);


var util = {};


var _partial = function() {
  var args = toArray(arguments);
  var ret = partial.apply(this, args);

  ret.then = function(onFulfilled, onRejected) {
    return function() {
      return Promise.fromAny(partial.apply(this, args))
        .then(onFulfilled, onRejected);
    };
  };

  return ret;
};


util.cmd = function(command, cwd, rejectOnError) {
  grunt.verbose.write('\n$ ' + command + '\n');
  cwd = cwd || process.cwd();
  if (rejectOnError === undefined) {
    rejectOnError = true;
  }

  var deferred = new Deferred();

  var p = child.exec(command, {cwd: cwd, maxBuffer: 10000000}, function(err, stdout) {
    if (err) {
      deferred.reject(err);
    }
    else {
      deferred.resolve(stdout);
    }
  });

  if (grunt.option('verbose')) {
    var firstline = true;

    p.stdout.on('data', function(data) {
      if (firstline) {
        process.stdout.write('> ');
        firstline = false;
      }
      process.stdout.write(data.toString().replace(/\n/g, '\n> '));
    });

    p.stderr.on('data', function(err) {
      if (firstline) {
        process.stderr.write('> ');
        firstline = false;
      }
      process.stderr.write(err.toString().replace(/\n/g, '\n> '));
    });
  }

  if (rejectOnError) {
    p.stderr.on('data', function(err) {
      deferred.reject(err);
      p.kill();
    });
  }

  return deferred.promise();
};


util.getConnectedDevice = function() {
  return new Deferred().resolve()
    .then(function checkExecs() {
      return forEachSeries([
        {
          exec: 'ideviceinfo',
          msg: '`ideviceinfo` from the "libimobiledevice" package was not found in your PATH. It is required to query iOS devices. Mac OS X users may use https://github.com/benvium/libimobiledevice-macosx'
        },
        {
          exec: 'adb',
          msg: '`adb` from the Android SDK was not found in your PATH. It is required to install and uninstall packages to/from Android devices.'
        }
      ], function(task) {
        return util.cmd('type ' + task.exec + ' >/dev/null').then(
          null,
          function() {
            grunt.log.error('WARNING: ' + task.msg);
            return true;
          }
        );
      });
    })
    .then(function checkAttached() {
      return series([
        _partial(util.cmd, 'adb get-state').then(
          function(stdout) {
            return stdout.toString().trim() === 'device';
          },
          function() {
            return false;
          }
        ),
        _partial(util.cmd, 'ideviceinfo').then(
          function(stdout) {
            return stdout.search(/no device found/gi) === -1;
          },
          function() {
            return false;
          }
        )
      ]);
    })
    .then(function(results) {
      if (results[0]) {
        return 'android';
      }
      if (results[1]) {
        return 'ios';
      }
      return undefined;
    });
};


util.getAppNameAndroid = function(dir) {
  var file = path.resolve(dir, 'res/values/strings.xml');

  return parseString(grunt.file.read(file))
    .then(function(data) {
      console.log(JSON.stringify(data, false, 4));
      //return data.resources.
    });
};


util.getAppPkgNameAndroid = function(dir) {
  var manifest = path.resolve(dir, 'AndroidManifest.xml');

  return parseString(grunt.file.read(manifest))
    .then(function(data) {
      return data.manifest.$['package'];
    });
};


util.getLatestAndroidSdk = function() {
  return util.cmd('android list target --compact').then(function(data) {
    return data.split('\n').filter(function(id) {
      return id.trim().length;
    }).pop();
  });
};


var _searchTarget = 'Debug';
util.getAppNameIos = function(dir) {
  var projDir = grunt.file.expand(dir + '/*.xcodeproj')[0];
  var pbxproj = path.resolve(projDir, 'project.pbxproj');
  var data = grunt.file.read(pbxproj);

  var cand;
  data.split('\n').every(function(line) {
    if (line.search(/PRODUCT_NAME =/) !== -1) {
      cand = line.match(/PRODUCT_NAME = (.*?);/)[1];
      cand = cand.replace(/"/g, '');
      return true; //continue
    }
    if (cand && line.search(/name =/) !== -1) {
      var target = line.match(/name = (.*?);/)[1];
      if (target === _searchTarget) {
        return false; //break;
      }
    }
    return true;
  });

  return cand;
};


util.getAppPkgNameIos = function(dir) {
  var plist = grunt.file.expand(dir + '/**/*-Info.plist')[0];
  var data = grunt.file.read(plist);

  var bundleIdentifier;
  data.split('\n').forEach(function(line, i, list) {
    if (line.search(/<key>.*?CFBundleIdentifier.*?<\/key>/i) !== -1) {
      var next = list[i+1];
      bundleIdentifier = next.match(/<string>(.*)<\/string>/i)[1];
    }
  });

  if (!bundleIdentifier) {
    throw 'Could not parse bundle identifier from ' + plist;
  }

  return bundleIdentifier;
};


module.exports = util;
