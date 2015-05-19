'use strict';

var _ = require('lodash');
var chai = require('chai');
var mixin = require('./mixin');
var flag = require('./flag');
var descriptors = require('./descriptors');
var CountAssertion = require('../assertions/count-assertion');

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

  mixin(accessor, chai.Assertion.prototype);

  Object.keys(assertion).forEach(function(prop) {
    accessor[prop] = assertion[prop];
  });

  _.forIn(descriptors(self), function(descriptor, prop) {
    descriptor.get && CountAssertion.register(prop);
  });

  return accessor;
}

module.exports = should;
