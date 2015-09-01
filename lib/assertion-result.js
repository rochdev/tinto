'use strict';

var tinto = {};

/**
 * @param {boolean} outcome
 * @param {*} expected
 * @param {*} actual
 * @constructor
 */
tinto.AssertionResult = function AssertionResult(outcome, expected, actual) {
  this.outcome = outcome;
  this.expected = expected;
  this.actual = actual;
};

module.exports = tinto.AssertionResult;
