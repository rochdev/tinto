'use strict';

var _ = require('lodash');
var Q = require('q');
var should = require('./utils/should');
var AssertionResult = require('./assertion-result');
var tinto = {};

/**
* @param {tinto.Component} component
* @param {string} name
* @param {Promise.<*>} value
* @constructor
*/
tinto.Attribute = function Attribute(component, name, value) {
  this.component = component;
  this.name = name;

  Object.defineProperty(this, 'value', {
    get: value
  });

  /**
   * @name tinto.Attribute#should
   * @type {tinto.AttributeAssertion}
   */
  Object.defineProperty(this, 'should', {
    get: should
  });
};

/**
 * @returns {string}
 */
tinto.Attribute.prototype.toString = function toString() {
  return ['property', this.name, 'of', this.component.toString()].join(' ');
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
