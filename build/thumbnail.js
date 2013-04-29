var find = require('./find');
var Magician = require('magician');
var exec = require('child_process').exec;
var render = require('mustache').render;

var thumbnailWidth = 200;

find('website/screenshots', {
  include: '*.png',
  exclude: '*.thumbnail.png'
}, function (files) {
  files.forEach(function(file) {
    var target = file.replace('.png', '.thumbnail.png');
    var img = new Magician(file, target);
    img.getDimensions(function(err, d) {
      if (err) {
        console.error(err, "Is ImageMagick installed? See README.md.");
      }
      var ratio = d.height / d.width;
      var newHeight = thumbnailWidth * ratio;
      renderAndExec(
          "convert {{{source}}} -resize {{{width}}}x{{{height}}}! -define png:exclude-chunks=date {{{result}}}",
          {
            source: file,
            width: thumbnailWidth,
            height: newHeight,
            result: target
          },
          function(err) {
            if (err) {
              console.error(file, err);
            }
          });
    });
  });
});

function renderAndExec(template, data, callback) {
  var cmd = render(template, data);
  exec(cmd, function(err) {
    if (err) {
      console.error("Failed to execute " + cmd + "\n");
    }
    callback(err);
  });
}