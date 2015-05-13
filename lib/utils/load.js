'use strict';

var file = require('file');
var path = require('path');

/**
 * @private
 * @returns {Object}
 */
function load(root) {
  var namespace = {};

  root = Array.prototype.slice.call(arguments, 0);

  file.walkSync(path.join.apply(path, root), function(dirPath, dirs, files) {
    files.forEach(function(file) {
      var type = require(path.join(dirPath, file));

      namespace[type.name] = type;
    });
  });

  return namespace;
}

module.exports = load;
