var fs = require('fs');
var path = require('path');
var util = require('util');

find('jQueryMobile', [function (item, itemPath) {
      return true;
    }, "*.js", "!jQueryMobile/iOS/model/*"],
    function (allPaths) {
      console.log(allPaths);
    });

function wildcardFilter(spec) {
  // any occurrence of '/' disallows wildcards from matching '/'
  var wildcard = spec.indexOf('/') > -1 ? '[^\\' + path.sep + ']' : '.';
  // swap / and \ for system path separator
  spec = spec.replace(/[\/\\]/g, '\\' + path.sep);
  // escape '.'
  spec = spec.replace(/[\.]/g, '\\.');
  // swap ? for single wildcard
  spec = spec.replace(/\?/g, wildcard);
  // swap * for n wildcards
  spec = spec.replace(/\*/g, wildcard + '*');
  var regex = new RegExp(spec);
  return function (itemPath) {
    return regex.test(itemPath);
  };
}

function equalityFilter(spec) {
  return function (itemPath) {
    return itemPath === spec;
  };
}

function negateFilter(filter) {
  return function (itemPath) {
    return !filter(itemPath);
  };
}

function andFilter(filters) {
  return function (itemPath) {
    return filters.map(function (filter) {
      return filter(itemPath);
    }).reduce(function (groupResult, result) {
          return result && groupResult;
        }, true);
  };
}

function convertFilterExpression(filter) {
  if (typeof filter == 'function') {
    return filter;
  } else if (typeof filter == 'string') {
    if (filter[0] == '!') {
      return negateFilter(convertFilterExpression(filter.substr(1)));
    } else if (filter.match(/[\?\*]/)) {
      return wildcardFilter(filter);
    } else {
      return equalityFilter(filter);
    }
  } else if (util.isArray(filter)) {
    return andFilter(filter.map(convertFilterExpression))
  } else {
    throw "Unknown filter expression " + filter;
  }
}

function find(root, filter, callback) {
  filter = convertFilterExpression(filter);
  function innerFind(root) {
    return fs.readdirSync(root).map(function (item) {
      var itemPath = path.join(root, item);
      var stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        return innerFind(itemPath);
      } else {
        if (filter(itemPath, item, stats)) {
          return itemPath;
        }
      }
    }).reduce(function (all, files) {
          return files ? all.concat(files) : all;
        }, []);

  }

  callback(innerFind(root));
}
