var async = require('async');
var exec = require('child_process').exec;
var render = require('mustache').render;
var fs = require('fs');

var CONCURRENCY_LIMIT = 5;

async.series([
  generateFrameworkLogos.bind(null, "assets/framework-icons/templates/tech_badge_bg.png",
                                                  "assets/framework-icons/templates/tech_badge_mask.png",
                                                  "assets/framework-icons/templates/tech_badge_fg.png", [
    ["xamarin"],
    ["air"],
    ["titanium"],
    ["jqtouch"],
    ["jquerymobile"],
    ["mgwt"],
    ["senchatouch2"],
    ["native"],
    ["rhomobile"],
    ["kendoui"],
    ["intelappframework"]
  ]),

  generateIcons.bind(null, "assets/icon-base-173x173.png", [
    // ["FRAMEWORK-OVERLAY", "TARGET", WIDTH],
    ["assets/frameworks/air.png", "air/src/com/propertycross/air/assets/icon16x16.png", 16],
    ["assets/frameworks/air.png", "air/src/com/propertycross/air/assets/icon32x32.png", 32],
    ["assets/frameworks/air.png", "air/src/com/propertycross/air/assets/icon36x36.png", 36],
    ["assets/frameworks/air.png", "air/src/com/propertycross/air/assets/icon48x48.png", 48],
    ["assets/frameworks/air.png", "air/src/com/propertycross/air/assets/icon57x57.png", 57],
    ["assets/frameworks/air.png", "air/src/com/propertycross/air/assets/icon72x72.png", 72],
    ["assets/frameworks/air.png", "air/src/com/propertycross/air/assets/icon114x114.png", 114],
    ["assets/frameworks/air.png", "air/src/com/propertycross/air/assets/icon128x128.png", 128],
    ["assets/frameworks/jqtouch.png", "jqtouch/assets/icons/36x36.png", 36],
    ["assets/frameworks/jqtouch.png", "jqtouch/assets/icons/48x48.png", 48],
    ["assets/frameworks/jqtouch.png", "jqtouch/assets/icons/72x72.png", 72],
    ["assets/frameworks/jqtouch.png", "jqtouch/assets/icons/96x96.png", 96],
    ["assets/frameworks/jqtouch.png", "jqtouch/assets/icons/icon-57.png", 57],
    ["assets/frameworks/jqtouch.png", "jqtouch/assets/icons/icon-72.png", 72],
    ["assets/frameworks/jqtouch.png", "jqtouch/assets/icons/icon-57-2x.png", 114],
    ["assets/frameworks/jqtouch.png", "jqtouch/assets/icons/icon-72-2x.png", 144],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/assets/icons/36x36.png", 36],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/assets/icons/48x48.png", 48],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/assets/icons/72x72.png", 72],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/assets/icons/96x96.png", 96],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/assets/icons/icon-57.png", 57],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/assets/icons/icon-72.png", 72],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/assets/icons/icon-57-2x.png", 114],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/assets/icons/icon-72-2x.png", 144],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/assets/icons/ApplicationIcon.png", 66],
    ["assets/frameworks/jquerymobile.png", "jquerymobile/assets/icons/ApplicationTileIcon.png", 173],
    ["assets/frameworks/native.png", "native/android/PropertyCross/res/drawable-hdpi/ic_launcher.png", 72],
    ["assets/frameworks/native.png", "native/android/PropertyCross/res/drawable-ldpi/ic_launcher.png", 36],
    ["assets/frameworks/native.png", "native/android/PropertyCross/res/drawable-mdpi/ic_launcher.png", 48],
    ["assets/frameworks/native.png", "native/android/PropertyCross/res/drawable-xhdpi/ic_launcher.png", 96],
    ["assets/frameworks/mgwt.png", "mgwt/src/main/webapp/assets/icons/36x36.png", 36],
    ["assets/frameworks/mgwt.png", "mgwt/src/main/webapp/assets/icons/48x48.png", 48],
    ["assets/frameworks/mgwt.png", "mgwt/src/main/webapp/assets/icons/72x72.png", 72],
    ["assets/frameworks/mgwt.png", "mgwt/src/main/webapp/assets/icons/96x96.png", 96],
    ["assets/frameworks/mgwt.png", "mgwt/src/main/webapp/assets/icons/icon-57.png", 57],
    ["assets/frameworks/mgwt.png", "mgwt/src/main/webapp/assets/icons/icon-72.png", 72],
    ["assets/frameworks/mgwt.png", "mgwt/src/main/webapp/assets/icons/icon-57-2x.png", 114],
    ["assets/frameworks/mgwt.png", "mgwt/src/main/webapp/assets/icons/icon-72-2x.png", 144],
    ["assets/frameworks/native.png", "native/ios/Icon.png", 57],
    ["assets/frameworks/native.png", "native/ios/Icon@2x.png", 114],
    ["assets/frameworks/native.png", "native/ios/Property Finder/Icon.png", 57],
    ["assets/frameworks/native.png", "native/ios/Property Finder/Icon@2x.png", 114],
    ["assets/frameworks/native.png", "native/windowsphone/PropertyFinder/ApplicationIcon.png", 66],
    ["assets/frameworks/native.png", "native/windowsphone/PropertyFinder/ApplicationTileIcon.png", 173],
    ["assets/frameworks/rhomobile.png", "rhomobile/icon/icon.png", 72],
    ["assets/frameworks/rhomobile.png", "rhomobile/icon/icon57.png", 57],
    ["assets/frameworks/rhomobile.png", "rhomobile/icon/icon72.png", 72],
    ["assets/frameworks/rhomobile.png", "rhomobile/icon/icon114.png", 114],
    ["assets/frameworks/titanium.png", "titanium/Resources/android/appicon.png", 128],
    ["assets/frameworks/titanium.png", "titanium/Resources/iphone/appicon.png", 57],
    ["assets/frameworks/titanium.png", "titanium/Resources/iphone/appicon@2x.png", 114],
    ["assets/frameworks/xamarin.png", "xamarin/android/PropertyCross/Resources/drawable-hdpi/ic_launcher.png", 72],
    ["assets/frameworks/xamarin.png", "xamarin/android/PropertyCross/Resources/drawable-ldpi/ic_launcher.png", 36],
    ["assets/frameworks/xamarin.png", "xamarin/android/PropertyCross/Resources/drawable-mdpi/ic_launcher.png", 48],
    ["assets/frameworks/xamarin.png", "xamarin/android/PropertyCross/Resources/drawable-xhdpi/ic_launcher.png", 96],
    ["assets/frameworks/sencha.png", "senchatouch2/resources/icons/ApplicationIcon.png", 144],
    ["assets/frameworks/kendoui.png", "kendoui/assets/icons/36x36.png", 36],
    ["assets/frameworks/kendoui.png", "kendoui/assets/icons/48x48.png", 48],
    ["assets/frameworks/kendoui.png", "kendoui/assets/icons/72x72.png", 72],
    ["assets/frameworks/kendoui.png", "kendoui/assets/icons/96x96.png", 96],
    ["assets/frameworks/kendoui.png", "kendoui/assets/icons/icon-57.png", 57],
    ["assets/frameworks/kendoui.png", "kendoui/assets/icons/icon-72.png", 72],
    ["assets/frameworks/kendoui.png", "kendoui/assets/icons/icon-57-2x.png", 114],
    ["assets/frameworks/kendoui.png", "kendoui/assets/icons/icon-72-2x.png", 144],
    ["assets/frameworks/kendoui.png", "kendoui/assets/icons/ApplicationIcon.png", 66],
    ["assets/frameworks/kendoui.png", "kendoui/assets/icons/ApplicationTileIcon.png", 173],
    ["assets/frameworks/intelappframework.png", "intelappframework/assets/icons/36x36.png", 36],
    ["assets/frameworks/intelappframework.png", "intelappframework/assets/icons/48x48.png", 48],
    ["assets/frameworks/intelappframework.png", "intelappframework/assets/icons/72x72.png", 72],
    ["assets/frameworks/intelappframework.png", "intelappframework/assets/icons/96x96.png", 96],
    ["assets/frameworks/intelappframework.png", "intelappframework/assets/icons/icon-57.png", 57],
    ["assets/frameworks/intelappframework.png", "intelappframework/assets/icons/icon-72.png", 72],
    ["assets/frameworks/intelappframework.png", "intelappframework/assets/icons/icon-57-2x.png", 114],
    ["assets/frameworks/intelappframework.png", "intelappframework/assets/icons/icon-72-2x.png", 144],
    ["assets/frameworks/intelappframework.png", "intelappframework/assets/icons/ApplicationIcon.png", 66],
    ["assets/frameworks/intelappframework.png", "intelappframework/assets/icons/ApplicationTileIcon.png", 173]
  ]),

  generateSplashscreens.bind(null, "assets/splashscreen-bottom-640x640.png", [
    // ["TARGET", WIDTH, HEIGHT],
    ["air/src/com/propertycross/air/assets/splash.png", 320, 480],
    ["jqtouch/assets/splashscreens/200x320.png", 200, 320],
    ["jqtouch/assets/splashscreens/320x480.png", 320, 480],
    ["jqtouch/assets/splashscreens/480x800.png", 480, 800],
    ["jqtouch/assets/splashscreens/720x1280.png", 720, 1280],
    ["jqtouch/assets/splashscreens/screen-iphone-portrait.png", 320, 480],
    ["jqtouch/assets/splashscreens/screen-iphone-portrait-2x.png", 640, 960],
    ["jquerymobile/assets/splashscreens/200x320.png", 200, 320],
    ["jquerymobile/assets/splashscreens/320x480.png", 320, 480],
    ["jquerymobile/assets/splashscreens/480x800.png", 480, 800],
    ["jquerymobile/assets/splashscreens/720x1280.png", 720, 1280],
    ["jquerymobile/assets/splashscreens/screen-iphone-portrait.png", 320, 480],
    ["jquerymobile/assets/splashscreens/screen-iphone-portrait-2x.png", 640, 960],
    ["jquerymobile/assets/splashscreens/SplashScreenImage.jpg", 480, 800],
    ["mgwt/src/main/webapp/assets/splashscreens/200x320.png", 200, 320],
    ["mgwt/src/main/webapp/assets/splashscreens/320x480.png", 320, 480],
    ["mgwt/src/main/webapp/assets/splashscreens/480x800.png", 480, 800],
    ["mgwt/src/main/webapp/assets/splashscreens/720x1280.png", 720, 1280],
    ["mgwt/src/main/webapp/assets/splashscreens/screen-iphone-portrait.png", 320, 480],
    ["mgwt/src/main/webapp/assets/splashscreens/screen-iphone-portrait-2x.png", 640, 960],
    ["rhomobile/app/loading.png",320, 480],
    ["rhomobile/app/loading@2x.png", 640, 960],
    ["rhomobile/app/loading-568h@2x.png", 640, 1136],
    ["rhomobile/app/loading.png",640, 960],
    ["titanium/Resources/iphone/Default.png", 320, 480],
    ["titanium/Resources/iphone/Default@2x.png", 640, 960],
    ["senchatouch2/resources/loading/Default.png", 320, 480],
    ["kendoui/assets/splashscreens/200x320.png", 200, 320],
    ["kendoui/assets/splashscreens/320x480.png", 320, 480],
    ["kendoui/assets/splashscreens/480x800.png", 480, 800],
    ["kendoui/assets/splashscreens/720x1280.png", 720, 1280],
    ["kendoui/assets/splashscreens/screen-iphone-portrait.png", 320, 480],
    ["kendoui/assets/splashscreens/screen-iphone-portrait-2x.png", 640, 960],
    ["kendoui/assets/splashscreens/SplashScreenImage.jpg", 480, 800],
    ["intelappframework/assets/splashscreens/200x320.png", 200, 320],
    ["intelappframework/assets/splashscreens/320x480.png", 320, 480],
    ["intelappframework/assets/splashscreens/480x800.png", 480, 800],
    ["intelappframework/assets/splashscreens/720x1280.png", 720, 1280],
    ["intelappframework/assets/splashscreens/screen-iphone-portrait.png", 320, 480],
    ["intelappframework/assets/splashscreens/screen-iphone-portrait-2x.png", 640, 960],
    ["intelappframework/assets/splashscreens/SplashScreenImage.jpg", 480, 800]
  ]),

  generateOther.bind(null, "assets/star.png", [
    // ["TARGET", WIDTH (, HEIGHT)],
    ["xamarin/android/PropertyCross/Resources/drawable-xhdpi/star.png", 64],
    ["xamarin/android/PropertyCross/Resources/drawable-hdpi/star.png", 48],
    ["xamarin/android/PropertyCross/Resources/drawable-mdpi/star.png", 32],
    ["native/android/PropertyCross/res/drawable-hdpi/star.png", 48],
    ["native/android/PropertyCross/res/drawable-mdpi/star.png", 32]
    ["native/android/PropertyCross/res/drawable-xhdpi/star.png", 64],
  ]),

  generateOther.bind(null, "assets/nostar.png", [
    // ["TARGET", WIDTH (, HEIGHT)],
    ["native/android/PropertyCross/res/drawable-hdpi/nostar.png", 48],
    ["native/android/PropertyCross/res/drawable-mdpi/nostar.png", 32],
    ["native/android/PropertyCross/res/drawable-xhdpi/nostar.png", 64],
    ["xamarin/android/PropertyCross/Resources/drawable-xhdpi/nostar.png", 64],
    ["xamarin/android/PropertyCross/Resources/drawable-hdpi/nostar.png", 48],
    ["xamarin/android/PropertyCross/Resources/drawable-mdpi/nostar.png", 32]
  ]),

  generateOther.bind(null, "assets/refresh.png", [
    // ["TARGET", WIDTH (, HEIGHT)],
    ["native/android/PropertyCross/res/drawable-hdpi/refresh.png", 48],
    ["native/android/PropertyCross/res/drawable-mdpi/refresh.png", 32],
    ["native/android/PropertyCross/res/drawable-xhdpi/refresh.png", 64],
    ["xamarin/android/PropertyCross/Resources/drawable-xhdpi/refresh.png", 64],
    ["xamarin/android/PropertyCross/Resources/drawable-hdpi/refresh.png", 48],
    ["xamarin/android/PropertyCross/Resources/drawable-mdpi/refresh.png", 32]
  ]),

  generateOther.bind(null, "assets/actionbar_tile.png", [
    // ["TARGET", WIDTH (, HEIGHT)],
    ["native/android/PropertyCross/res/drawable-mdpi/actionbar_tile.png", 6],
    ["xamarin/android/PropertyCross/Resources/drawable-mdpi/actionbar_tile.png", 6]
  ])

], function(err) {
  if (err) {
    console.error(err);
  }
});

function generateFrameworkLogos(background, mask, foreground, icons, callback) {
  async.forEachLimit(icons, CONCURRENCY_LIMIT, function(config, callback) {
    var maskedImage = "website/framework-icons/" + config[0] + "-masked-temp.png",
          withBackground = "website/framework-icons/" + config[0] + "-with-background-temp.png",
          complete = "website/framework-icons/" + config[0] + "-complete.png";

    async.series([
      function(callback) {
        // mask the logo
        renderAndExec(
            "convert    \"{{{icon}}}\"  \"{{{mask}}}\" -alpha Off  -compose CopyOpacity -composite png32:\"{{{result}}}\"",
            {
              icon: "assets/framework-icons/" + config[0] + ".png",
              mask: mask,
              result:  maskedImage
            },
            callback);
      },
      function(callback) {
        // compose with background
        renderAndExec(
            "convert   \"{{{background}}}\" \"{{{overlay}}}\" -composite png32:\"{{{result}}}\"",
            {
              background: background,
              overlay: maskedImage,
              result: withBackground
            },
            callback);
      },
      function(callback) {
        // compose with foreground
        renderAndExec(
            "convert   \"{{{background}}}\" \"{{{overlay}}}\" -composite -define png:exclude-chunks=date png32:\"{{{result}}}\"",
            {
              background: withBackground,
              overlay: foreground,
              result: complete
            },
            callback);
      },
      function(callback) {
        // delete temp files
        fs.unlink(maskedImage, callback)
      },
      function(callback) {
        // delete temp files
        fs.unlink(withBackground, callback)
      }
    ], callback);

  }, callback);
}

function generateIcons(background, icons, callback) {
  async.forEachLimit(icons, CONCURRENCY_LIMIT, function(config, callback) {
    renderAndExec(
        "convert \"{{{background}}}\" \"{{{overlay}}}\" -composite -resize {{{width}}}x{{{height}}}! -define png:exclude-chunks=date  png32:\"{{{result}}}\"",
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
        "convert \"{{{source}}}\" -resize {{{width}}}x{{{height}}}! -define png:exclude-chunks=date  png32:\"{{{result}}}\"",
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
        "convert -size {{{nominalWidth}}}x{{{nominalHeight}}} canvas:black \"{{{source}}}\" -geometry +0+{{{offset}}} -composite -resize {{{width}}}x{{{height}}}! -define png:exclude-chunks=date  \"{{{result}}}\"",
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
