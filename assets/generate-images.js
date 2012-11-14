generateIcons("icon-base-173x173.png", [
// ["FRAMEWORK-OVERLAY", "TARGET", WIDTH],
  ["frameworks/jquerymobile.png", "../jquerymobile/android/assets/icons/36x36.png", 36],
  ["frameworks/jquerymobile.png", "../jquerymobile/android/assets/icons/48x48.png", 48],
  ["frameworks/jquerymobile.png", "../jquerymobile/android/assets/icons/72x72.png", 72],
  ["frameworks/jquerymobile.png", "../jquerymobile/android/assets/icons/96x96.png", 96],
  ["frameworks/jquerymobile.png", "../jquerymobile/ios/assets/icons/icon-57.png", 57],
  ["frameworks/jquerymobile.png", "../jquerymobile/ios/assets/icons/icon-72.png", 72],
  ["frameworks/jquerymobile.png", "../jquerymobile/ios/assets/icons/icon-57-2x.png", 114],
  ["frameworks/jquerymobile.png", "../jquerymobile/ios/assets/icons/icon-72-2x.png", 144]
]);

generateSplashscreens("splashscreen-bottom-640x640.png", [
// ["TARGET", WIDTH, HEIGHT],
  ["../jquerymobile/android/assets/splashscreens/200x320.png", 200, 320],
  ["../jquerymobile/android/assets/splashscreens/320x480.png", 320, 480],
  ["../jquerymobile/android/assets/splashscreens/480x800.png", 480, 800],
  ["../jquerymobile/android/assets/splashscreens/720x1280.png", 720, 1280],
  ["../jquerymobile/ios/assets/splashscreens/screen-iphone-portrait.png", 320, 480],
  ["../jquerymobile/ios/assets/splashscreens/screen-iphone-portrait-2x.png", 640, 960]
]);


function template(tmpl, values) {
  return tmpl.replace(/\{([^\}]*)\}/g, function(brackets, key) {
    return values[key] || '';
  });
}

function exec(tmpl, config, callback) {
  var cmd = template(tmpl, config);
  console.log(cmd);
  return require('child_process').exec(cmd, function(err) {
    if (callback) {
      return callback(err);
    }
  });
}

function generateIcons(background, icons) {
  icons.forEach(function(config) {
    exec("convert {background} {overlay} -composite -resize {width}x{height}! -define png:exclude-chunks=date {result}", {
      background: background,
      overlay: config[0],
      width: config[2],
      height: config[2],
      result: config[1]
    }, function(err, sdout, sderr) {
      if (err) {
        console.error(err);
      }
    });
  });
}
function generateSplashscreens(source, splashscreens) {
  splashscreens.forEach(function(config) {
    var width = config[1], height = config[2];
    var nominalHeight = height / width * 640;
    exec("convert -size {nominalWidth}x{nominalHeight} canvas:black {source} -geometry +0+{offset} -composite -resize {width}x{height}! -define png:exclude-chunks=date {result}", {
      nominalWidth: 640,
      nominalHeight: nominalHeight,
      offset: nominalHeight - 640,
      source: source,
      width: width,
      height: height,
      result: config[0]
    }, function(err, sdout, sderr) {
      if (err) {
        console.error(err);
      }
    });
  });
}
