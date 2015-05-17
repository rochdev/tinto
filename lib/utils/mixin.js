'use strict';

var _ = require('lodash');
var descriptors = require('./descriptors');

/**
 * @private
 * @param {Object} destination
 * @param {Object} source
 */
function mixin(destination, source) {
  var existing = [];

  _.forIn(descriptors(destination), function(descriptor, prop) {
    if (!descriptor.configurable) {
      existing.push(prop);
    }
  });

  _.forIn(descriptors(source), function(descriptor, prop) {
    if (existing.indexOf(prop) === -1) {
      Object.defineProperty(destination, prop, descriptor);
    }
  });
}

module.exports = mixin;
