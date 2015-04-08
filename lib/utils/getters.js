'use strict';

/**
 * @param {Object} destination
 * @param {Object} source
 */
module.exports = function getters(destination, source) {
  Object.getOwnPropertyNames(source).forEach(function(prop) {
    Object.defineProperty(destination, prop, Object.getOwnPropertyDescriptor(source, prop));
  });
};
