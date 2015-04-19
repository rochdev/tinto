'use strict';

var chai = require('chai');

/**
 * @private
 * @returns {(tinto.Assertion | function(Array.<tinto.Assertion>))}
 */
function should() {
  var self = this;
  var assertion = new chai.Assertion(self);
  var accessor = function(assertions) {
    assertions = Array.prototype.slice.call(arguments);
    assertions.forEach(function(assertion) {
      assertion(self);
    });
  };

  getAllPropertyNames(chai.Assertion.prototype).forEach(function(prop) {
    if (getAllPropertyNames(accessor).indexOf(prop) === -1) {
      Object.defineProperty(accessor, prop, Object.getOwnPropertyDescriptor(chai.Assertion.prototype, prop));
    }
  });

  Object.keys(assertion).forEach(function(prop) {
    accessor[prop] = assertion[prop];
  });

  return accessor;
}

/**
 * @private
 * @param {*} obj
 * @returns {Array.<string>}
 */
function getAllPropertyNames(obj) {
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

module.exports = should;
