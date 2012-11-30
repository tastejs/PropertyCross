var async = require('async');
var exec = require('child_process').exec;
var render = require('mustache').render;

var CONCURRENCY_LIMIT = 5;

async.series([
  generateIcons.bind(null, "assets/icon-base-173x173.png", [
    // ["FRAMEWORK-OVERLAY", "TARGET", WIDTH],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/android/assets/icons/36x36.png", 36],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/android/assets/icons/48x48.png", 48],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/android/assets/icons/72x72.png", 72],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/android/assets/icons/96x96.png", 96],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/ios/assets/icons/icon-57.png", 57],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/ios/assets/icons/icon-72.png", 72],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/ios/assets/icons/icon-57-2x.png", 114],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/ios/assets/icons/icon-72-2x.png", 144],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/windowsphone/ApplicationIcon.png", 66],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/windowsphone/ApplicationTileIcon.png", 173],
    ["assets/frameworks/titanium.png", "titanium/Resources/android/appicon.png", 128],
    ["assets/frameworks/titanium.png", "titanium/Resources/iphone/appicon.png", 57],
    ["assets/frameworks/titanium.png", "titanium/Resources/iphone/appicon@2x.png", 114],
    ["assets/frameworks/xamarin.png", "xamarin/android/PropertyCross/Resources/drawable-hdpi/ic_launcher.png", 72],
    ["assets/frameworks/xamarin.png", "xamarin/android/PropertyCross/Resources/drawable-ldpi/ic_launcher.png", 36],
    ["assets/frameworks/xamarin.png", "xamarin/android/PropertyCross/Resources/drawable-mdpi/ic_launcher.png", 48],
    ["assets/frameworks/xamarin.png", "xamarin/android/PropertyCross/Resources/drawable-xhdpi/ic_launcher.png", 96]
  ]),

  generateSplashscreens.bind(null, "assets/splashscreen-bottom-640x640.png", [
    // ["TARGET", WIDTH, HEIGHT],
    ["jquerymobile/android/assets/splashscreens/200x320.png", 200, 320],
    ["jquerymobile/android/assets/splashscreens/320x480.png", 320, 480],
    ["jquerymobile/android/assets/splashscreens/480x800.png", 480, 800],
    ["jquerymobile/android/assets/splashscreens/720x1280.png", 720, 1280],
    ["jquerymobile/ios/assets/splashscreens/screen-iphone-portrait.png", 320, 480],
    ["jquerymobile/ios/assets/splashscreens/screen-iphone-portrait-2x.png", 640, 960],
    ["jquerymobile/windowsphone/SplashScreenImage.jpg", 480, 800],
    ["titanium/Resources/iphone/Default.png", 320, 480],
    ["titanium/Resources/iphone/Default@2x.png", 640, 960]
  ]),

  generateOther.bind(null, "assets/star.png", [
    // ["FRAMEWORK-OVERLAY", "TARGET", WIDTH],
    ["xamarin/android/PropertyCross/Resources/drawable-xhdpi/star.png", 64],
    ["xamarin/android/PropertyCross/Resources/drawable-hdpi/star.png", 48],
    ["xamarin/android/PropertyCross/Resources/drawable-mdpi/star.png", 32]
  ]),

  generateOther.bind(null, "assets/nostar.png", [
    // ["FRAMEWORK-OVERLAY", "TARGET", WIDTH],
    ["xamarin/android/PropertyCross/Resources/drawable-xhdpi/nostar.png", 64],
    ["xamarin/android/PropertyCross/Resources/drawable-hdpi/nostar.png", 48],
    ["xamarin/android/PropertyCross/Resources/drawable-mdpi/nostar.png", 32]
  ]),

  generateOther.bind(null, "assets/actionbar_tile.png", [
    // ["FRAMEWORK-OVERLAY", "TARGET", WIDTH],
    ["xamarin/android/PropertyCross/Resources/drawable-mdpi/actionbar_tile.png", 6]
  ])
  
], function(err) {
  if (err) {
    console.error(err);
  }
});

function generateIcons(background, icons, callback) {
  async.forEachLimit(icons, CONCURRENCY_LIMIT, function(config, callback) {
    renderAndExec(
        "convert {{{background}}} {{{overlay}}} -composite -resize {{{width}}}x{{{height}}}! -define png:exclude-chunks=date {{{result}}}",
        {
          background: background,
          overlay: config[0],
          width: config[2],
          height: config[2],
          result: config[1]
        },
        callback);
  }, callback);
}

function generateOther(source, config, callback) {
  async.forEachLimit(config, CONCURRENCY_LIMIT, function(config, callback) {
    renderAndExec(
        "convert {{{source}}} -resize {{{width}}}x{{{height}}}! -define png:exclude-chunks=date {{{result}}}",
        {
          source: source,
          width: config[1],
          height: config[2] || config[1],
          result: config[0]
        },
        callback);
  }, callback);
}

function generateSplashscreens(source, splashscreens, callback) {
  async.forEachLimit(splashscreens, CONCURRENCY_LIMIT, function(config, callback) {
    var width = config[1], height = config[2];
    var nominalHeight = height / width * 640;
    renderAndExec(
        "convert -size {{{nominalWidth}}}x{{{nominalHeight}}} canvas:black {{{source}}} -geometry +0+{{{offset}}} -composite -resize {{{width}}}x{{{height}}}! -define png:exclude-chunks=date {{{result}}}",
        {
          nominalWidth: 640,
          nominalHeight: nominalHeight,
          offset: nominalHeight - 640,
          source: source,
          width: width,
          height: height,
          result: config[0]
        },
        callback);
  }, callback);
}

function renderAndExec(template, data, callback) {
  var cmd = render(template, data);
  exec(cmd, function(err) {
    if (err) {
      console.error("Failed to execute " + cmd + "\n");
    }
    callback(err);
  });
}