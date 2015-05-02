'use strict';

var _ = require('lodash');
var chai = require('chai');
var descriptors = require('./descriptors');
var flag = require('./flag');

/**
 * @private
 * @returns {(tinto.Assertion | function(Array.<tinto.Assertion>))}
 */
function should() {
  var accessor = createAccessor.call(this);

  Object.defineProperty(accessor, 'eventually', {
    get: function() {
      flag(accessor, 'eventually', true);

      return accessor;
    }
  });

  return accessor;
}

/**
 * @private
 * @returns {(tinto.Assertion | function(Array.<tinto.Assertion>))}
 */
function createAccessor() {
  var self = this;
  var assertion = new chai.Assertion(self);
  var accessor = function(assertions) {
    assertions = Array.prototype.slice.call(arguments);
    assertions.forEach(function(assert) {
      assert.call(assertion, self);
    });
  };

  _.forIn(descriptors(chai.Assertion.prototype), function(descriptor, prop) {
    if (!Function.prototype.hasOwnProperty(prop)) {
      Object.defineProperty(accessor, prop, descriptor);
    }
  });

  Object.keys(assertion).forEach(function(prop) {
    accessor[prop] = assertion[prop];
  });

  return accessor;
}

module.exports = should;
