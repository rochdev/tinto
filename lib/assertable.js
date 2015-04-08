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

  this._supportedProperties = {};
  this._supportedStates = {};

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
  if (!this._supportedStates[state]) {
    throw new Error(util.format('Unsupported state "%s"', state));
  }

  return this._supportedStates[state].bind(this);
};

/**
 * @param {string} property
 * @param {*} value
 * @returns {Promise}
 */
tinto.Assertable.prototype.has = function(property, value) {
  if (!this._supportedProperties[property]) {
    throw new Error(util.format('Unsupported property "%s"', property));
  }

  return this._supportedProperties[property].bind(this, value);
};

/**
 * @param {string} name
 * @param {function} [matcher]
 */
tinto.Assertable.prototype.supportState = function(name, matcher) {
  this._supportedStates[name] = getMatcher('states', name, matcher);

  if (!this._supportedStates[name]) {
    throw new Error(util.format('State "%s" does not exist', name));
  }
};

/**
 * @param {Object.<string, function>} mappings
 */
tinto.Assertable.prototype.supportStates = function(mappings) {
  var self = this;

  Object.keys(mappings).forEach(function(name) {
    self.supportState(name, mappings[name]);
  });
};

/**
 * @param {string} name
 * @param {function} [matcher]
 */
tinto.Assertable.prototype.supportProperty = function(name, matcher) {
  this._supportedProperties[name] = getMatcher('properties', name, matcher);

  if (!this._supportedProperties[name]) {
    throw new Error(util.format('Property "%s" does not exist', name));
  }
};

/**
 * @param {Object.<string, function>} mappings
 */
tinto.Assertable.prototype.supportProperties = function(mappings) {
  var self = this;

  Object.keys(mappings).forEach(function(name) {
    self.supportProperty(name, mappings[name]);
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
