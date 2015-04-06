'use strict';

module.exports = function(chai, utils) {
  ['be', 'have', 'and'].forEach(function(chain) {
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

  chai.Assertion.addProperty('not', function() {
    utils.flag(this, 'negate', true);
    return this;
  });
};
