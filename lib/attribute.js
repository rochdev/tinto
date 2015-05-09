'use strict';

// TODO: improve error messages for equals and contains to show expected value instead of Attribute instance

var _ = require('lodash');
var Q = require('q');
var should = require('./utils/should');
var AssertionResult = require('./assertion-result');
var tinto = {};

/**
* @param {Promise.<*>} value
* @constructor
*/
tinto.Attribute = function Attribute(value) {
  this.value = value;

  /**
   * @name tinto.Attribute#should
   * @type {tinto.AttributeAssertion}
   */
  Object.defineProperty(this, 'should', {
    get: should
  });
};

/**
* @param {*} value
* @returns {function() : Promise.<tinto.AssertionResult>}
*/
tinto.Attribute.prototype.equals = function equals(value) {
  var self = this;

  return function() {
    return self.value.then(function(actual) {
      return new AssertionResult(_.isEqual(actual, value), value, actual);
    });
  };
};

/**
* @param {...*} values
* @returns {function() : Promise.<tinto.AssertionResult>}
*/
tinto.Attribute.prototype.contains = function contains(values) {
  var self = this;

  values = Array.prototype.slice.call(arguments, 0);

  return function() {
    return Q.all(values.map(function(value) {
      return self.value.then(function(actual) {
        return new AssertionResult(actual.indexOf(value) !== -1, value);
      });
    }));
  };
};

module.exports = tinto.Attribute;
