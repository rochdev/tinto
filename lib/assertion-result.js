'use strict';

var tinto = {};

/**
 * @param {Boolean} outcome
 * @param {*} actual
 * @constructor
 */
tinto.AssertionResult = function AssertionResult(outcome, actual) {
  this.outcome = outcome;
  this.actual = actual;
};

module.exports = tinto.AssertionResult;
