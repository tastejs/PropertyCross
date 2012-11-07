var fs = require('fs');
var path = require('path');

find('.', function(item, itemPath) {
      console.log(item, itemPath);
      return true;
    },
    function(allPaths) {
      console.log(allPaths);
    });

function find(root, filter, callback) {
  function innerFind(root) {
    return fs.readdirSync(root).map(function (item) {
      var itemPath = path.join(root, item);
      var stats = fs.statSync(itemPath);
      if (!filter(item, itemPath, stats)) {
        return;
      } else if (stats.isDirectory()) {
        return innerFind(itemPath);
      } else {
        return itemPath;
      }
    }).reduce(function (all, files) {
          return files ? all.concat(files) : all;
        }, []);

  }
  callback(innerFind(root));
}
