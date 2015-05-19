'use strict';

var assert = require('./utils/assert');
var CountAssertion = require('./assertions/count-assertion');

/**
 * @private
 */
module.exports = function(chai, utils) {
  ['be', 'and'].forEach(function(chain) {
    chai.Assertion.addProperty(chain, function() {
      return this;
    });
  });

  ['all', 'eventually'].forEach(function(chain) {
    chai.Assertion.addProperty(chain, function() {
      utils.flag(this, chain, true);
      return this;
    });
  });

  chai.Assertion.addChainableMethod('have', function(count) {
    return new CountAssertion(this, count);
  }, function() {
    return this;
  });

  chai.Assertion.addProperty('not', function() {
    utils.flag(this, 'negate', true);
    return this;
  });

  chai.Assertion.addMethod('equal', assert('equal', function(assertable, value) {
    return assertable.equals(value);
  }, 'equal #{exp} but was #{act}'));

  chai.Assertion.addChainableMethod('contain', assert('contain', function(assertable, value) {
    return assertable.contains(value);
  }, 'contain #{exp}'), function() {
    return this;
  });
};
