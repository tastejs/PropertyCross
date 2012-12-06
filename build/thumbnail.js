var find = require('./find');
var Magician = require('magician');

var thumbnailWidth = 200;

find('website/screenshots', {
  include: '*.png',
  exclude: '*.thumbnail.png'
}, function (files) {
  files.forEach(function(file) {
    var img = new Magician(file, file.replace('.png', '.thumbnail.png'));
    img.getDimensions(function(err, d) {
      if (err) {
        console.error(err, "Is ImageMagick installed? See README.md.");
      }
      var ratio = d.height / d.width;
      var newHeight = thumbnailWidth * ratio;
      img.resize({ width: thumbnailWidth, height: newHeight }, function(err) {
        if (err) {
          console.error(file, err);
        }
      })
    });
  });
});