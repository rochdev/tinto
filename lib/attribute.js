'use strict';

// TODO: improve error messages for equals and contains to show expected value instead of Attribute instance

var should = require('./utils/should');
var tinto = {};

/**
* @param {Promise.<*>} value
* @constructor
*/
tinto.Attribute = function Attribute(value) {
  this.value = value;

  /**
   * @type {tinto.AttributeAssertion}
   */
  Object.defineProperty(this, 'should', {
    get: should
  });
};

/**
* @param {*} value
* @returns {function() : Promise.<Boolean>}
*/
tinto.Attribute.prototype.equals = function equals(value) {
  var self = this;

  return function() {
    return self.value.then(function(actual) {
      return [actual === value, actual];
    });
  };
};

/**
* @param {*} value
* @returns {function() : Promise.<Boolean>}
*/
tinto.Attribute.prototype.contains = function contains(value) {
  var self = this;

  return function() {
    return self.value.then(function(actual) {
      return [actual.indexOf(value) !== -1, actual];
    });
  };
};

module.exports = tinto.Attribute;
