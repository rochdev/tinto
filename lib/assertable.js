'use strict';

var _ = require('lodash');
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
  support.call(this, 'states', name, matcher, 'State "%s" does not exist');
};

/**
 * @param {Object.<string, function>} mappings
 */
tinto.Assertable.prototype.states = function(mappings) {
  _.forEach(mappings, function(matcher, name) {
    this.state(name, matcher);
  }, this);
};

/**
 * @param {string} name
 * @param {function} [matcher]
 */
tinto.Assertable.prototype.property = function(name, matcher) {
  support.call(this, 'properties', name, matcher, 'Property "%s" does not exist');
};

/**
 * @param {Object.<string, function>} mappings
 */
tinto.Assertable.prototype.properties = function(mappings) {
  _.forEach(mappings, function(matcher, name) {
    this.property(name, matcher);
  }, this);
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

function support(type, name, matcher, message) {
  this['_' + type][name] = getMatcher(type, name, matcher);

  if (!this['_' + type][name]) {
    throw new Error(util.format(message, name));
  }
}

module.exports = tinto.Assertable;
