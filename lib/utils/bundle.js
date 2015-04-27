'use strict';

var _ = require('lodash');
var tinto = require('../tinto');

/**
 * @private
 * @param {string} name
 * @param {Object} root
 */
function bundle(name, root) {
  _.forIn(root.components, function(component) {
    component.__bundle__ = name;
  });

  tinto[name] = root;
}

module.exports = bundle;
