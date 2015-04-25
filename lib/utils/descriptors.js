'use strict';

/**
 * @private
 * @param {Object} object
 * @returns {Object}
 */
function descriptors(object) {
  var props = {};

  getPropertyNames(object).forEach(function(prop) {
    props[prop] = getPropertyDescriptor(object, prop);
  });

  return props;
}

/**
 * @private
 * @param {Object} object
 * @param {string} name
 * @returns {Object}
 */
function getPropertyDescriptor(object, name) {
  var descriptor;

  do {
    descriptor = Object.getOwnPropertyDescriptor(object, name);
  } while ((object = Object.getPrototypeOf(object)) && !descriptor);

  return descriptor;
}

/**
 * @private
 * @param {Object} obj
 * @returns {Array.<string>}
 */
function getPropertyNames(obj) {
  var props = [];

  do {
    Object.getOwnPropertyNames(obj).forEach(addToProps);
  } while ((obj = Object.getPrototypeOf(obj)));

  function addToProps(prop) {
    if (props.indexOf(prop) === -1) {
      props.push(prop);
    }
  }

  return props;
}

module.exports = descriptors;
