var fs = require('fs');
var path = require('path');
var util = require('util');

function wildcardFilter(spec) {
  // swap / and \ for system path separator
  spec = spec.replace(/[\/\\]/g, '\\' + path.sep);
  // escape '.'
  spec = spec.replace(/[\.]/g, '\\.');
  // swap ? for single  wildcard
  spec = spec.replace(/\?/g, '.');
  // swap * for n wildcards
  spec = spec.replace(/\*/g, '.*');
  // ensure the whole path is matched
  spec = "^" + spec + "$";
  var regex = new RegExp(spec);
  return function (itemPath) {
    return regex.test(itemPath);
  };
}

function equalityFilter(spec) {
  // swap / and \ for system path separator
  spec = spec.replace(/[\/\\]/g, path.sep);
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
function orFilter(filters) {
  return function (itemPath) {
    return filters.map(function (filter) {
      return filter(itemPath);
    }).reduce(function (groupResult, result) {
          return result || groupResult;
        }, false);
  };
}

function convertFilterExpression(groupingFilter, filter) {
  if (typeof filter == 'function') {
    return filter;
  } else if (typeof filter == 'string') {
    if (filter[0] == '!') {
      return negateFilter(convertFilterExpression(groupingFilter, filter.substr(1)));
    } else if (filter.match(/[\?\*]/)) {
      return wildcardFilter(filter);
    } else {
      return equalityFilter(filter);
    }
  } else if (util.isArray(filter)) {
    return groupingFilter(filter.map(convertFilterExpression.bind(null, groupingFilter)));
  } else if (filter.include || filter.exclude) {
    return convertFilterExpression(andFilter, [
      convertFilterExpression(orFilter, filter.include || []),
      negateFilter(convertFilterExpression(orFilter, filter.exclude || []))]);
  } else {
    throw "Unknown filter expression " + filter;
  }
}

function find(root, filter, callback) {
  filter = convertFilterExpression(orFilter, filter);
  function innerFind(folder) {
    return fs.readdirSync(folder).map(function (item) {
      var itemPath = path.join(folder, item);
      var stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        return innerFind(itemPath);
      } else {
        if (filter(path.relative(root, itemPath), item, stats)) {
          return itemPath;
        }
      }
    }).reduce(function (all, files) {
          return files ? all.concat(files) : all;
        }, []);

  }

  callback(innerFind(root));
}

module.exports = find;