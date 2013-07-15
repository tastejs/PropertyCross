module.exports = function(grunt) {
  'use strict';

  var path = require('path');

  var Deferred = require('deferreds/Deferred');
  var forEachSeries = require('deferreds/forEachSeries');

  var util = require('./util');


  var _runCommands = function(tasks, rejectOnError) {
    return forEachSeries(tasks, function(task) {
      grunt.log.write(task.msg);
      var promise = util.cmd(task.cmd, task.cwd, rejectOnError);
      var timer = setInterval(function() {
        grunt.log.notverbose.write('.');
      }, 1000);
      return promise.then(
        function() {
          clearInterval(timer);
          grunt.log.ok();
        },
        function(err) {
          clearInterval(timer);
          throw err;
        }
      );
    });
  };


  grunt.registerMultiTask('pkg', 'Generates debug packages for iOS and android', function() {
    var done = this.async();
    var options = this.options();
    var buildDir = this.files[0].src[0];
    var dest = this.files[0].dest;

    switch (this.target) {
      case 'android':
        new Deferred().resolve()
          .then(function checkExecs() {
            return forEachSeries([
              {
                exec: 'android',
                msg: '`android` from the Android SDK was not found in your PATH. It may be required to build Android packages.'
              },
              {
                exec: 'ant',
                msg: '`ant` (Apache Ant) was not found in your PATH. It is required to build Android packages.'
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
          .then(function() {
            if (!options.targetSdk) {
              return util.getLatestAndroidSdk().then(function(target) {
                options.targetSdk = target;
              });
            }
          })
          .then(function run() {
            return _runCommands([
              {
                cmd: 'android update project -p ' + buildDir + ' --target "' + options.targetSdk + '"',
                msg: 'Updating Android project...'
              },
              {
                cmd: 'ant debug',
                cwd: buildDir,
                msg: 'Building debug package...'
              }
            ]);
          }).then(function() {
            var src = grunt.file.expand(path.resolve(buildDir, 'bin') + '/*-debug.apk')[0];
            grunt.file.copy(src, dest);
            grunt.log.writeln('Package saved to ' + dest);
          })
          .then(done, done);
        break;
      case 'ios':
        var appName = util.getAppNameIos(buildDir);
        new Deferred().resolve()
          .then(function checkExecs() {
            return forEachSeries([
              {
                exec: 'xcodebuild',
                msg: '`xcodebuild` from Xcode\'s "Command Line Tools" was not found in your PATH. It is required to build iOS packages.'
              },
              {
                exec: 'xcrun',
                msg: '`xcrun` from Xcode\'s "Command Line Tools" was not found in your PATH. It is required to build iOS packages.'
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
          .then(function run() {
            var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
            var provisionFile = grunt.file.expand(path.resolve(home, 'Library/MobileDevice/Provisioning Profiles/*.mobileprovision'))[0];
            return _runCommands([
              {
                cmd: 'xcodebuild' +
                     ' -project ' + path.resolve(buildDir, appName + '.xcodeproj') +
                     ' -configuration Debug' +
                     ' -sdk iphoneos' +
                     ' CODE_SIGN_IDENTITY="' + options.identity + '"' +
                     ' CONFIGURATION_BUILD_DIR="' + path.resolve(buildDir, 'build') + '"' +
                     ' clean build',
                msg: 'Building signed debug package...'
              },
              {
                cmd: 'xcrun' +
                     ' -sdk iphoneos' +
                     ' PackageApplication' +
                     ' -v ' + path.resolve(buildDir, 'build', appName + '.app') +
                     ' -o ' + path.resolve(buildDir, 'build', appName + '.ipa') +
                     ' --sign "' + options.identity + '"' +
                     ' --embed "' + provisionFile + '"',
                msg: 'Generating package archive...'
              }
            ]);
          }).then(function() {
            var src = path.resolve(buildDir, 'build', appName + '.ipa');
            grunt.file.copy(src, dest);
            grunt.log.writeln('Package saved to ' + dest);
          })
          .then(null, function(err) {
            console.error(err.stack);
          })
          .then(done, done);
        break;
    }
  });


  var _installAndroid = function(pkg, devicePkg) {
    return _runCommands([
      {
        cmd: 'adb uninstall ' + devicePkg,
        msg: 'Uninstalling existing package "' + devicePkg + '"...'
      },
      {
        cmd: 'adb install ' + pkg,
        msg: 'Installing "' + pkg + '" to device...'
      }
    ], false).then(null, function(err) {
      //`adb install` writes to stderr when reporting bitrate. no idea why.
      if (err.search(/\d*?\sbytes in/) !== -1) {
        grunt.log.ok();
        return true; //continue
      }
      throw err;
    });
  };


  var _installIos = function(pkg, devicePkg) {
    return _runCommands([
      {
        cmd: 'ideviceinstaller --uninstall ' + devicePkg,
        msg: 'Uninstalling existing package "' + devicePkg + '"...'
      },
      {
        cmd: 'ideviceinstaller --install ' + pkg,
        msg: 'Installing "' + pkg + '" to device...'
      }
    ], false).then(null, function(err) {
      //`ideviceinstaller --install` writes to stderr when archive is missing
      //some common files. App still installs and functions properly, however.
      if (err.search(/ERROR: could not locate/) !== -1) {
        return true; //continue
      }
      throw err;
    });
  };


  grunt.registerTask('install', 'Installs package to first connected device', function() {
    var done = this.async();

    new Deferred().resolve()
      .then(function checkExecs() {
        return forEachSeries([
          {
            exec: 'ideviceinstaller',
            msg: '`ideviceinstaller` from the "libimobiledevice" package was not found in your PATH. It is required to install and uninstall packages to/from iOS devices. Mac OS X users may use https://github.com/benvium/libimobiledevice-macosx'
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
      .then(function() {
        grunt.log.write('Looking for an attached device...');
      })
      .then(util.getConnectedDevice)
      .then(function(device) {
        var files, buildDir, pkgFile;
        switch(device) {
          case 'android':
            grunt.log.writeln('Android device found.');

            files = grunt.task.normalizeMultiTaskFiles(grunt.config.get('pkg.android'));
            buildDir = files[0].src[0];
            pkgFile = files[0].dest;

            return util.getAppPkgNameAndroid(buildDir)
              .then(function(pkgName) {
                return _installAndroid(pkgFile, pkgName);
              });
          case 'ios':
            grunt.log.writeln('iOS device found.');

            files = grunt.task.normalizeMultiTaskFiles(grunt.config.get('pkg.ios'));
            buildDir = files[0].src[0];
            pkgFile = files[0].dest;
            var bundleIdentifier = util.getAppPkgNameIos(buildDir);
            return _installIos(pkgFile, bundleIdentifier);
          default:
            grunt.log.writeln('No device found.');
            throw 'break';
        }
      })
      .then(done, function(err) {
        grunt.fail.warn(err);
        done();
      });


  });

};
