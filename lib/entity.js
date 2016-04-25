'use strict';

var _ = require('lodash');
var Q = require('q');
var util = require('util');
var should = require('./utils/should');
var descriptors = require('./utils/descriptors');
var Attribute = require('./attribute');
var AssertionResult = require('./assertion-result');
var PropertyAssertion = require('./assertions/property-assertion');
var StateAssertion = require('./assertions/state-assertion');
var tinto = {};

tinto.Entity = function Entity() {
  this._properties = {};
  this._states = {};

  /**
   * @name tinto.Entity#should
   * @type {tinto.Assertion}
   */

  /**
   * @name tinto.Entity#should
   * @function
   * @param {...tinto.Assertion} assertions
   */
  Object.defineProperty(this, 'should', {
    get: should
  });
};

/**
 * @param {string} state
 * @returns {function() : Promise.<tinto.AssertionResult>}
 */
tinto.Entity.prototype.is = function(state) {
  var self = this;

  if (!this._states[state]) {
    throw new Error(util.format('Unsupported state "%s"', state));
  }

  return function() {
    return self._states[state].call(self).then(function(result) {
      return new AssertionResult(result);
    });
  };
};

/**
 * @param {string} property
 * @param {*} expected
 * @returns {function() : Promise.<tinto.AssertionResult>}
 */
tinto.Entity.prototype.has = function(property, expected) {
  if (typeof property === 'number') {
    return hasCount.call(this, expected, property);
  } else {
    return hasValue.call(this, property, expected);
  }
};

/**
 * @param {string} name
 * @param {function() : Promise} [matcher]
 * @param {Array.<*>} [args]
 */
tinto.Entity.prototype.state = function(name, matcher, args) {
  this._states[name] = wrap(matcher, args);

  StateAssertion.register(name);
};

/**
 * @param {Object.<string, function() : Promise>} mappings
 */
tinto.Entity.prototype.states = function() {
  processMappings.call(this, 'state', arguments);
};

/**
 * @param {string} name
 * @param {function() : Promise} [matcher]
 * @param {Array.<*>} [args]
 */
tinto.Entity.prototype.property = function(name, matcher, args) {
  var self = this;

  this._properties[name] = wrap(matcher, args);

  PropertyAssertion.register(name);

  this.getter(name, function() {
    return new Attribute(this, name, function() {
      return matcher.call(self);
    });
  });
};

/**
 * @param {Object.<string, function() : Promise>} mappings
 */
tinto.Entity.prototype.properties = function() {
  processMappings.call(this, 'property', arguments);
};

/**
 * @param {string} prop
 * @param {function()} func
 */
tinto.Entity.prototype.getter = function(prop, func) {
  Object.defineProperty(this, prop, {
    get: func,
    enumerable: true,
    configurable: true
  });
};

/**
 * @param {Object} props
 */
tinto.Entity.prototype.getters = function(props) {
  _.forIn(descriptors(props), function(descriptor, prop) {
    if (descriptor.enumerable) {
      if (descriptor.get) {
        this.getter(prop, descriptor.get);
      } else if (descriptor.value && typeof descriptor.value === 'function') {
        this.getter(prop, descriptor.value);
      }
    }
  }.bind(this));
};

/**
 * @private
 * @param {function()} matcher
 * @param {Array.<*>} args
 * @returns {function() : Promise}
 */
function wrap(matcher, args) {
  return function() {
    return Q.when(args ? matcher.apply(this, args) : matcher.call(this));
  };
}

/**
 * @private
 * @param {string} property
 * @param {*} value
 * @returns {function() : Promise.<tinto.AssertionResult>}
 */
function hasValue(property, value) {
  var self = this;

  if (!this._properties[property]) {
    throw new Error(util.format('Unsupported property "%s"', property));
  }

  return function() {
    return self._properties[property].call(self).then(function(actual) {
      return new AssertionResult(_.isEqual(value, actual), value, actual);
    });
  };
}

/**
 * @private
 * @param {string} property
 * @param {number} count
 * @returns {function() : Promise.<tinto.AssertionResult>}
 */
function hasCount(property, count) {
  var collection = this[property];

  if (collection.count === undefined || typeof collection.count !== 'function') {
    throw new Error('Count assertions can only be applied to collections');
  }

  return function() {
    return Q.resolve(collection.count()).then(function(length) {
      return new AssertionResult(count === length, count, length);
    });
  };
}

/**
 * @private
 * @param {string} type
 * @param {Array.<string|Object>} mappings
 */
function processMappings(type, mappings) {
  var self = this;

  mappings = Array.prototype.slice.call(mappings, 0);
  mappings.forEach(function(mapping) {
    if (typeof mapping === 'string') {
      self[type](mapping);
    } else {
      _.forEach(mapping, function(matcher, name) {
        self[type](name, matcher);
      }, self);
    }
  });
}

module.exports = tinto.Entity;
