'use strict';

var util = require('util');
var Q = require('q');
var bundles = require('./bundles');
var chai = require('chai');
var tinto = {};

/**
 * @constructor
 */
tinto.Assertable = function Assertable() {
  var self = this;

  this._properties = {};
  this._states = {};

  /**
   * @type {tinto.Assertion}
   */
  Object.defineProperty(this, 'should', {
    get: function() {
      return chai.expect(self);
    }
  });
};

/**
 * @param {string} state
 * @returns {Promise}
 */
tinto.Assertable.prototype.is = function(state) {
  if (!this._states[state]) {
    throw new Error(util.format('Unsupported state "%s"', state));
  }

  return this._states[state].bind(this);
};

/**
 * @param {string} property
 * @param {*} value
 * @returns {Promise}
 */
tinto.Assertable.prototype.has = function(property, value) {
  if (!this._properties[property]) {
    throw new Error(util.format('Unsupported property "%s"', property));
  }

  return this._properties[property].bind(this, value);
};

/**
 * @param {string} name
 * @param {function} [matcher]
 */
tinto.Assertable.prototype.state = function(name, matcher) {
  this._states[name] = getMatcher('states', name, matcher);

  if (!this._states[name]) {
    throw new Error(util.format('State "%s" does not exist', name));
  }
};

/**
 * @param {Object.<string, function>} mappings
 */
tinto.Assertable.prototype.states = function(mappings) {
  var self = this;

  Object.keys(mappings).forEach(function(name) {
    self.state(name, mappings[name]);
  });
};

/**
 * @param {string} name
 * @param {function} [matcher]
 */
tinto.Assertable.prototype.property = function(name, matcher) {
  this._properties[name] = getMatcher('properties', name, matcher);

  if (!this._properties[name]) {
    throw new Error(util.format('Property "%s" does not exist', name));
  }
};

/**
 * @param {Object.<string, function>} mappings
 */
tinto.Assertable.prototype.properties = function(mappings) {
  var self = this;

  Object.keys(mappings).forEach(function(name) {
    self.property(name, mappings[name]);
  });
};

/**
 * @private
 * @param {function()} matcher
 * @returns {Function}
 */
function wrap(matcher) {
  return function() {
    return Q.when(matcher.apply(this, arguments));
  };
}

/**
 * @private
 * @param {string} type
 * @param {string} name
 * @param {function()} override
 * @returns {Function}
 */
function getMatcher(type, name, override) {
  if (override) {
    return wrap(override);
  } else {
    for (var i = bundles.length - 1; i >= 0; i--) {
      if (bundles[i][type][name]) {
        return wrap(bundles[i][type][name]);
      }
    }
  }
}

module.exports = tinto.Assertable;
