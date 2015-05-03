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
    Object.defineProperty(component, '__bundle__', {
      value: name
    });
  });

  tinto[name] = root;
}

module.exports = bundle;
