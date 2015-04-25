'use strict';

/**
 * @param {Object} destination
 * @param {Object} source
 */
module.exports = function getters(destination, source) {
  var props = [];

  Object.getOwnPropertyNames(source).forEach(function(prop) {
    props.push(prop);
    Object.defineProperty(destination, prop, Object.getOwnPropertyDescriptor(source, prop));
  });

  return props;
};
